-- Phase 5: Database Optimization & Audit Logs
-- Created: 2026-01-05
-- Priority: HIGH (per user feedback)

-- ============================================================================
-- 1. JSONB OPTIMIZATION INDEXES (GIN + jsonb_path_ops)
-- ============================================================================

-- Index for psychometric profiles in user_projects.config
CREATE INDEX IF NOT EXISTS idx_projects_config_psychometrics 
ON user_projects USING GIN ((config -> 'psychometrics') jsonb_path_ops);

-- Index for script metadata
CREATE INDEX IF NOT EXISTS idx_projects_config_scoring 
ON user_projects USING GIN ((config -> 'scoring') jsonb_path_ops);

-- Index for searching within system_config values
CREATE INDEX IF NOT EXISTS idx_system_config_value 
ON system_config USING GIN (to_tsvector('english', value));

-- ============================================================================
-- 2. FULL-TEXT SEARCH WITH TSVECTOR
-- ============================================================================

-- Add tsvector column to user_projects for script content search
ALTER TABLE user_projects 
ADD COLUMN IF NOT EXISTS script_search tsvector 
GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '') || ' ' || COALESCE(script_content, ''))
) STORED;

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_projects_script_search 
ON user_projects USING GIN (script_search);

-- ============================================================================
-- 3. EXPANDED AUDIT LOGGING STRUCTURE
-- ============================================================================

-- Add more columns to user_activity_log for richer tracking
ALTER TABLE user_activity_log
ADD COLUMN IF NOT EXISTS entity_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS entity_id UUID,
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS user_agent TEXT,
ADD COLUMN IF NOT EXISTS session_id VARCHAR(100);

-- Create indexes for common audit queries
CREATE INDEX IF NOT EXISTS idx_audit_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON user_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON user_activity_log(created_at DESC);

-- Create a view for easy audit querying
CREATE OR REPLACE VIEW v_audit_summary AS
SELECT 
    l.id,
    u.name AS user_name,
    u.email AS user_email,
    u.role AS user_role,
    l.action,
    l.entity_type,
    l.entity_id,
    l.details,
    l.ip_address,
    l.created_at
FROM user_activity_log l
LEFT JOIN users u ON l.user_id = u.id
ORDER BY l.created_at DESC;

-- ============================================================================
-- 4. TEMPORAL VERSIONING FOR SCRIPTS
-- ============================================================================

-- Create a project_versions table to track historical changes
CREATE TABLE IF NOT EXISTS project_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES user_projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    script_content TEXT,
    config JSONB,
    changed_by UUID REFERENCES users(id),
    change_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for version lookups
CREATE INDEX IF NOT EXISTS idx_versions_project ON project_versions(project_id, version_number DESC);

-- Trigger to auto-version on project updates
CREATE OR REPLACE FUNCTION fn_version_project()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.script_content IS DISTINCT FROM NEW.script_content 
       OR OLD.config IS DISTINCT FROM NEW.config THEN
        INSERT INTO project_versions (project_id, version_number, script_content, config, changed_by)
        SELECT 
            OLD.id,
            COALESCE((SELECT MAX(version_number) + 1 FROM project_versions WHERE project_id = OLD.id), 1),
            OLD.script_content,
            OLD.config,
            NEW.last_modified_by;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add last_modified_by column to user_projects
ALTER TABLE user_projects
ADD COLUMN IF NOT EXISTS last_modified_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create the trigger
DROP TRIGGER IF EXISTS trg_version_project ON user_projects;
CREATE TRIGGER trg_version_project
BEFORE UPDATE ON user_projects
FOR EACH ROW
EXECUTE FUNCTION fn_version_project();

-- ============================================================================
-- 5. BULK INGESTION SUPPORT
-- ============================================================================

-- Staging table for bulk imports
CREATE TABLE IF NOT EXISTS import_staging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_batch_id UUID NOT NULL,
    data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staging_batch ON import_staging(import_batch_id, status);

-- ============================================================================
-- 6. PERFORMANCE VIEW FOR ADMIN DASHBOARD
-- ============================================================================

CREATE OR REPLACE VIEW v_system_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE is_approved = TRUE) AS active_users,
    (SELECT COUNT(*) FROM users WHERE is_approved = FALSE) AS pending_users,
    (SELECT COUNT(*) FROM user_projects WHERE is_template = FALSE) AS personal_projects,
    (SELECT COUNT(*) FROM user_projects WHERE is_template = TRUE) AS template_projects,
    (SELECT COUNT(*) FROM user_activity_log WHERE created_at > NOW() - INTERVAL '24 hours') AS logs_24h,
    (SELECT COUNT(*) FROM ssml_elements) AS ssml_elements,
    (SELECT COUNT(*) FROM ssml_emotion_styles) AS ssml_emotions;
