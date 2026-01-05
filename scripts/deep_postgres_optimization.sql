-- ==============================================================================
-- PostgreSQL Deep Optimization Migration
-- For text/document-heavy psychometric music application
-- 
-- Created: 2026-01-04
-- Purpose: Optimize indexing and storage for script parsing and musical metadata
-- ==============================================================================

-- ============================================================================
-- 1. DOCUMENTS/SCRIPTS TABLE WITH ENHANCED METADATA
-- ============================================================================

CREATE TABLE IF NOT EXISTS scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core metadata
    title TEXT NOT NULL,
    author TEXT,
    original_creation_date DATE,
    theme TEXT DEFAULT 'Drama',
    
    -- Content
    raw_content TEXT NOT NULL,
    
    -- Extended metadata (JSONB for flexibility)
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- System timestamps
    loaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Processing status
    is_processed BOOLEAN DEFAULT FALSE,
    processing_version INTEGER DEFAULT 1,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_version_id UUID REFERENCES scripts(id),
    
    -- Full-text search vector (auto-generated)
    content_search tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(author, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(raw_content, '')), 'C')
    ) STORED
);

-- ============================================================================
-- 2. PSYCHOMETRIC SCRIPT FRAMES TABLE
-- Stores parsed frames with psychometric data
-- ============================================================================

CREATE TABLE IF NOT EXISTS script_frames (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    
    -- Frame position
    frame_index INTEGER NOT NULL,
    
    -- Speaker/actor info
    speaker TEXT,
    actor_id TEXT,
    
    -- Content
    text_content TEXT NOT NULL,
    stage_directions TEXT,
    
    -- Psychometric data
    trauma NUMERIC(5,4) DEFAULT 0.3,
    entropy NUMERIC(5,4) DEFAULT 0.25,
    rsi_real NUMERIC(5,4) DEFAULT 0.33,
    rsi_symbolic NUMERIC(5,4) DEFAULT 0.33,
    rsi_imaginary NUMERIC(5,4) DEFAULT 0.34,
    
    -- Musical metadata
    chord TEXT DEFAULT 'Cm',
    tempo INTEGER DEFAULT 80,
    dynamic_level TEXT DEFAULT 'mf',
    
    -- Extended musical data
    musical_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(script_id, frame_index)
);

-- ============================================================================
-- 3. AUDIT TRAIL TABLE
-- Track all changes to scripts with system timestamps
-- ============================================================================

CREATE TABLE IF NOT EXISTS script_audit_log (
    id SERIAL PRIMARY KEY,
    script_id UUID REFERENCES scripts(id),
    
    -- Action type
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'PROCESS')),
    
    -- User/system info
    changed_by TEXT DEFAULT 'system',
    
    -- Timestamps (system time for accurate auditing)
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    
    -- Additional context
    context JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- 4. INDEXES - GIN FOR JSONB METADATA
-- Use jsonb_path_ops for containment queries (more storage efficient)
-- ============================================================================

-- Metadata containment queries
CREATE INDEX IF NOT EXISTS idx_scripts_metadata_tags 
ON scripts USING GIN ((metadata->'tags') jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_scripts_metadata_psychometric 
ON scripts USING GIN ((metadata->'psychometric_data') jsonb_path_ops);

CREATE INDEX IF NOT EXISTS idx_scripts_metadata_musical 
ON scripts USING GIN ((metadata->'musical_metadata') jsonb_path_ops);

-- Frame musical metadata
CREATE INDEX IF NOT EXISTS idx_frames_musical_metadata 
ON script_frames USING GIN (musical_metadata jsonb_path_ops);

-- ============================================================================
-- 5. INDEXES - B-TREE FOR EXACT MATCH ON EXTRACTED FIELDS
-- More efficient than GIN for equality operations
-- ============================================================================

-- Author lookup
CREATE INDEX IF NOT EXISTS idx_scripts_author 
ON scripts USING BTREE (author);

-- Original creation date range queries
CREATE INDEX IF NOT EXISTS idx_scripts_creation_date 
ON scripts USING BTREE (original_creation_date);

-- System timestamps for audit/ordering
CREATE INDEX IF NOT EXISTS idx_scripts_loaded_at 
ON scripts USING BTREE (loaded_at DESC);

CREATE INDEX IF NOT EXISTS idx_scripts_processed_at 
ON scripts USING BTREE (processed_at DESC);

-- Frame lookups
CREATE INDEX IF NOT EXISTS idx_frames_script_id 
ON script_frames USING BTREE (script_id);

CREATE INDEX IF NOT EXISTS idx_frames_speaker 
ON script_frames USING BTREE (speaker);

-- Psychometric range queries
CREATE INDEX IF NOT EXISTS idx_frames_trauma 
ON script_frames USING BTREE (trauma);

CREATE INDEX IF NOT EXISTS idx_frames_entropy 
ON script_frames USING BTREE (entropy);

-- ============================================================================
-- 6. FULL-TEXT SEARCH INDEX
-- GIN on generated tsvector column
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_scripts_fts 
ON scripts USING GIN (content_search);

-- ============================================================================
-- 7. PARTIAL INDEXES
-- Index only relevant subsets for common query patterns
-- ============================================================================

-- Only processed scripts (for production queries)
CREATE INDEX IF NOT EXISTS idx_scripts_processed 
ON scripts USING BTREE (processed_at DESC)
WHERE is_processed = TRUE;

-- High-trauma frames (for crisis detection)
CREATE INDEX IF NOT EXISTS idx_frames_high_trauma 
ON script_frames USING BTREE (trauma DESC)
WHERE trauma > 0.7;

-- ============================================================================
-- 8. PSYCHOMETRIC MAPPINGS OPTIMIZATION
-- Optimize the existing style_psychometric_mappings table
-- ============================================================================

-- Fast lookup by psychometric entry and style
CREATE INDEX IF NOT EXISTS idx_psych_mappings_lookup 
ON style_psychometric_mappings (
    psychometric_entry_id,
    style_id,
    weight DESC
);

-- Fast lookup by affect type
CREATE INDEX IF NOT EXISTS idx_psych_mappings_affect_tempo 
ON style_psychometric_mappings (affects_tempo)
WHERE affects_tempo = TRUE;

CREATE INDEX IF NOT EXISTS idx_psych_mappings_affect_harmony 
ON style_psychometric_mappings (affects_harmony)
WHERE affects_harmony = TRUE;

CREATE INDEX IF NOT EXISTS idx_psych_mappings_affect_dynamics 
ON style_psychometric_mappings (affects_dynamics)
WHERE affects_dynamics = TRUE;

-- ============================================================================
-- 9. UPDATE TRIGGER FOR TIMESTAMPS
-- Automatically update updated_at on row changes
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_scripts_updated_at ON scripts;
CREATE TRIGGER update_scripts_updated_at
    BEFORE UPDATE ON scripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. AUDIT TRIGGER
-- Automatically log changes to scripts table
-- ============================================================================

CREATE OR REPLACE FUNCTION log_script_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO script_audit_log (script_id, action, old_values)
        VALUES (OLD.id, 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO script_audit_log (script_id, action, old_values, new_values)
        VALUES (NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO script_audit_log (script_id, action, new_values)
        VALUES (NEW.id, 'CREATE', to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_scripts ON scripts;
CREATE TRIGGER audit_scripts
    AFTER INSERT OR UPDATE OR DELETE ON scripts
    FOR EACH ROW
    EXECUTE FUNCTION log_script_changes();

-- ============================================================================
-- 11. HELPFUL VIEWS
-- ============================================================================

-- Scripts with frame counts
CREATE OR REPLACE VIEW scripts_with_stats AS
SELECT 
    s.*,
    COUNT(f.id) as frame_count,
    AVG(f.trauma) as avg_trauma,
    AVG(f.entropy) as avg_entropy,
    ARRAY_AGG(DISTINCT f.speaker) FILTER (WHERE f.speaker IS NOT NULL) as speakers
FROM scripts s
LEFT JOIN script_frames f ON f.script_id = s.id
GROUP BY s.id;

-- Recent activity view
CREATE OR REPLACE VIEW recent_script_activity AS
SELECT 
    sal.id,
    sal.action,
    sal.changed_at,
    sal.changed_by,
    s.title as script_title
FROM script_audit_log sal
LEFT JOIN scripts s ON s.id = sal.script_id
ORDER BY sal.changed_at DESC
LIMIT 100;

-- ============================================================================
-- 12. BULK INGESTION HELPER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION bulk_ingest_scripts(
    data JSONB
)
RETURNS INTEGER AS $$
DECLARE
    inserted_count INTEGER := 0;
    item JSONB;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(data)
    LOOP
        INSERT INTO scripts (
            title,
            author,
            original_creation_date,
            theme,
            raw_content,
            metadata
        ) VALUES (
            item->>'title',
            item->>'author',
            (item->>'original_creation_date')::DATE,
            COALESCE(item->>'theme', 'Drama'),
            item->>'raw_content',
            COALESCE(item->'metadata', '{}'::jsonb)
        )
        ON CONFLICT DO NOTHING;
        
        inserted_count := inserted_count + 1;
    END LOOP;
    
    RETURN inserted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE scripts IS 'Stores theatrical scripts with full-text search and psychometric metadata';
COMMENT ON TABLE script_frames IS 'Individual frames/scenes with psychometric and musical data';
COMMENT ON TABLE script_audit_log IS 'Audit trail for all script changes with system timestamps';
