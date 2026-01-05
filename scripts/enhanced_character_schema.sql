-- ==========================================================================
-- MPN ENHANCED CHARACTER PERSONA & AI EXPERT SCHEMA
-- Version: 3.2.0
-- Updated: 2026-01-04 12:55 CST
-- Purpose: Complete character decomposition with AI-assisted analysis
-- ==========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==========================================================================
-- SECTION 1: CHARACTER PERSONAS (Complete Character Decomposition)
-- ==========================================================================

-- Core character identity and metadata
CREATE TABLE IF NOT EXISTS character_personas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
    
    -- Basic identification
    character_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    aliases TEXT[],
    
    -- Character classification
    character_type VARCHAR(50) DEFAULT 'supporting',  -- protagonist, antagonist, supporting, minor
    archetype VARCHAR(100),  -- hero, mentor, trickster, shadow, etc.
    
    -- Source extraction metadata
    first_appearance_line INT,
    last_appearance_line INT,
    total_lines_spoken INT DEFAULT 0,
    total_scenes INT DEFAULT 0,
    
    -- Psychometric core (McKenney-Lacan)
    trauma_baseline NUMERIC(5,4) DEFAULT 0.35,
    entropy_baseline NUMERIC(5,4) DEFAULT 0.45,
    rsi_real NUMERIC(5,4) DEFAULT 0.33,
    rsi_symbolic NUMERIC(5,4) DEFAULT 0.33,
    rsi_imaginary NUMERIC(5,4) DEFAULT 0.34,
    
    -- DISC personality profile
    disc_dominance NUMERIC(5,4),
    disc_influence NUMERIC(5,4),
    disc_steadiness NUMERIC(5,4),
    disc_compliance NUMERIC(5,4),
    
    -- OCEAN (Big Five)
    ocean_openness NUMERIC(5,4),
    ocean_conscientiousness NUMERIC(5,4),
    ocean_extraversion NUMERIC(5,4),
    ocean_agreeableness NUMERIC(5,4),
    ocean_neuroticism NUMERIC(5,4),
    
    -- Dark Triad
    dark_narcissism NUMERIC(5,4) DEFAULT 0.2,
    dark_machiavellianism NUMERIC(5,4) DEFAULT 0.2,
    dark_psychopathy NUMERIC(5,4) DEFAULT 0.1,
    
    -- Cognitive biases (stored as JSONB for flexibility)
    cognitive_biases JSONB DEFAULT '{
        "confirmation_bias": 0.3,
        "anchoring": 0.25,
        "availability_heuristic": 0.3,
        "overconfidence": 0.4,
        "fundamental_attribution_error": 0.35,
        "ingroup_bias": 0.4,
        "sunk_cost": 0.25,
        "negativity_bias": 0.3,
        "projection_bias": 0.2,
        "status_quo_bias": 0.35,
        "dunning_kruger": 0.25,
        "bandwagon_effect": 0.3
    }'::jsonb,
    
    -- Vector embedding for similarity search
    personality_embedding vector(768),  -- Unified psychometric vector
    
    -- Musical signature
    assigned_leitmotif_id UUID REFERENCES leitmotifs(id),
    preferred_instruments TEXT[],
    base_mode VARCHAR(20) DEFAULT 'Dorian',
    tempo_modifier NUMERIC(5,2) DEFAULT 1.0,
    dynamics_modifier NUMERIC(5,2) DEFAULT 1.0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    analyzed_by VARCHAR(100) DEFAULT 'system',  -- AI model that analyzed
    confidence_score NUMERIC(5,4) DEFAULT 0.8
);

-- Character backstory and context (director notes, author intent)
CREATE TABLE IF NOT EXISTS character_backstory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES character_personas(id) ON DELETE CASCADE,
    
    -- Author-provided context
    author_backstory TEXT,  -- Explicit backstory from playwright
    author_notes TEXT,  -- Author's notes about character
    historical_context TEXT,  -- Time period, cultural context
    
    -- Director interpretation
    director_notes TEXT,  -- Director's interpretation guidance
    director_vision TEXT,  -- Overall vision for character
    
    -- Performance context
    stage_directions_summary TEXT,  -- Aggregated stage directions
    costume_notes TEXT,
    vocal_notes TEXT,  -- Accent, speech patterns
    physical_notes TEXT,  -- Posture, movement style
    
    -- Inferred elements (AI-generated)
    inferred_childhood TEXT,  -- AI-inferred early life
    inferred_education TEXT,  -- Educational background
    inferred_relationships TEXT,  -- Key relationships before play
    inferred_traumas TEXT,  -- Past traumas affecting character
    inferred_desires TEXT,  -- Core wants and needs
    inferred_fears TEXT,  -- Fundamental fears
    inferred_worldview TEXT,  -- Cynical, optimistic, etc.
    
    -- Embedding for semantic search
    backstory_embedding vector(768),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character arc progression across scenes
CREATE TABLE IF NOT EXISTS character_arcs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    character_id UUID NOT NULL REFERENCES character_personas(id) ON DELETE CASCADE,
    
    -- Scene identification
    act_number INT,
    scene_number INT,
    frame_start INT,
    frame_end INT,
    
    -- Arc phase
    arc_phase VARCHAR(50) DEFAULT 'development',  -- introduction, development, crisis, transformation, resolution
    arc_description TEXT,
    
    -- Psychometric state at this point
    trauma_level NUMERIC(5,4),
    entropy_level NUMERIC(5,4),
    rsi_state JSONB,  -- {real, symbolic, imaginary}
    
    -- Emotional trajectory
    emotional_valence NUMERIC(5,4),  -- -1 to 1 (negative to positive)
    emotional_arousal NUMERIC(5,4),  -- 0 to 1 (calm to activated)
    emotional_dominance NUMERIC(5,4),  -- 0 to 1 (submissive to dominant)
    primary_emotion VARCHAR(50),  -- joy, sadness, anger, fear, etc.
    
    -- Relationship dynamics at this point
    relationship_dynamics JSONB,  -- {other_character_id: {type, intensity}}
    
    -- Musical implications
    suggested_mode VARCHAR(20),
    suggested_orchestration VARCHAR(50),
    suggested_dynamics VARCHAR(10),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character relationships (knowledge graph edges)
CREATE TABLE IF NOT EXISTS character_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_character_id UUID NOT NULL REFERENCES character_personas(id) ON DELETE CASCADE,
    target_character_id UUID NOT NULL REFERENCES character_personas(id) ON DELETE CASCADE,
    
    -- Relationship type and quality
    relationship_type VARCHAR(50) NOT NULL,  -- ally, enemy, lover, family, mentor, rival
    relationship_subtype VARCHAR(100),  -- parent-child, sibling, boss-subordinate
    
    -- Dynamics
    trust_level NUMERIC(5,4) DEFAULT 0.5,  -- 0-1
    conflict_level NUMERIC(5,4) DEFAULT 0.3,  -- 0-1
    power_differential NUMERIC(5,4) DEFAULT 0.0,  -- -1 to 1 (source has less to more power)
    emotional_bond NUMERIC(5,4) DEFAULT 0.5,  -- 0-1
    
    -- Evolution tracking
    initial_state JSONB,  -- State at play beginning
    current_state JSONB,  -- Current computed state
    transformation_notes TEXT,
    
    -- Musical implications (contrapuntal rules)
    harmonic_relationship VARCHAR(50),  -- consonant, dissonant, parallel, contrary
    voice_separation_preference INT DEFAULT 3,  -- Minimum interval
    
    -- Granovetter threshold for influence propagation
    influence_threshold NUMERIC(5,4) DEFAULT 0.5,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT different_characters CHECK (source_character_id != target_character_id)
);

-- ==========================================================================
-- SECTION 2: AI EXPERT AGENTS (Specialized Domain Expertise)
-- ==========================================================================

-- AI Expert agent definitions
CREATE TABLE IF NOT EXISTS ai_expert_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Agent identity
    agent_name VARCHAR(100) NOT NULL UNIQUE,
    agent_role VARCHAR(255) NOT NULL,
    agent_persona TEXT,  -- System prompt personality
    
    -- Expertise domain
    domain VARCHAR(100) NOT NULL,  -- psychology, musicology, dramaturgy, physics, etc.
    specialization TEXT[],  -- Specific sub-domains
    
    -- Model configuration
    model_provider VARCHAR(50) DEFAULT 'openrouter',  -- openrouter, huggingface, local
    model_id VARCHAR(255),  -- e.g., 'anthropic/claude-3.5-sonnet'
    temperature NUMERIC(3,2) DEFAULT 0.7,
    max_tokens INT DEFAULT 2048,
    
    -- System prompt components
    base_system_prompt TEXT NOT NULL,
    domain_knowledge TEXT,  -- Injected expertise
    
    -- Capabilities
    can_analyze BOOLEAN DEFAULT TRUE,
    can_explain BOOLEAN DEFAULT TRUE,
    can_recommend BOOLEAN DEFAULT TRUE,
    can_critique BOOLEAN DEFAULT FALSE,
    
    -- Usage tracking
    total_invocations INT DEFAULT 0,
    average_confidence NUMERIC(5,4) DEFAULT 0.8,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expert agent invocation log (for audit)
CREATE TABLE IF NOT EXISTS ai_expert_invocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES ai_expert_agents(id),
    
    -- Context
    task_type VARCHAR(100) NOT NULL,  -- analyze_character, explain_concept, recommend_mode
    input_context JSONB NOT NULL,
    
    -- Response
    response_content TEXT,
    response_metadata JSONB,
    confidence_score NUMERIC(5,4),
    
    -- Performance
    latency_ms INT,
    token_usage JSONB,  -- {prompt_tokens, completion_tokens}
    
    -- Tracking
    invoked_by VARCHAR(100),  -- user_id or 'system'
    invoked_at TIMESTAMPTZ DEFAULT NOW(),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Pre-seeded AI Expert Agents
INSERT INTO ai_expert_agents (agent_name, agent_role, domain, specialization, base_system_prompt, domain_knowledge) VALUES
-- Lacanian Psychoanalyst
('Dr. Lacan-AI', 'Lacanian Psychoanalyst Expert', 'psychology', 
 ARRAY['Lacanian theory', 'RSI registers', 'objet petit a', 'desire analysis'],
 'You are Dr. Lacan-AI, an expert in Lacanian psychoanalysis specializing in the Real, Symbolic, and Imaginary registers. You analyze character psychology through the lens of desire, lack, and the Other. Provide insights using proper Lacanian terminology while remaining accessible.',
 'The three registers form a Borromean knot structure. R=trauma/impossible, S=language/law, I=fantasy/ego. Petit objet a is the object-cause of desire. The gaze belongs to the Other.'
),

-- Musicologist (Film Score Specialist)  
('Prof. Williams-Shore', 'Film Score Musicologist', 'musicology',
 ARRAY['leitmotif', 'modal theory', 'orchestration', 'film scoring'],
 'You are Prof. Williams-Shore, a musicologist specializing in film score techniques, particularly the leitmotif practices of John Williams and Howard Shore. You explain modal selections, orchestration choices, and thematic transformations with precision.',
 'Lydian mode for magic (#4), Phrygian for tension (b2), fragmentation increases with trauma, orchestration density scales with intensity. Williams: heroic brass, Shore: cultural modal mapping.'
),

-- Hamiltonian Physicist
('Dr. Phase-Space', 'Mathematical Physics Expert', 'physics',
 ARRAY['Hamiltonian mechanics', 'phase space', 'Lyapunov exponents', 'dynamical systems'],
 'You are Dr. Phase-Space, an expert in Hamiltonian mechanics and dynamical systems theory. You explain how psychological states evolve in phase space, calculate Lyapunov exponents for stability analysis, and apply symplectic integration for state evolution.',
 'H = T(p) + V(q). Hamilton equations: dq/dt = dH/dp, dp/dt = -dH/dq. Lyapunov λ > 0 = chaos. Symplectic integrators preserve phase space structure.'
),

-- Network Dynamics Expert
('Dr. Granovetter-Ising', 'Network & Collective Dynamics Expert', 'network_science',
 ARRAY['Ising model', 'Granovetter thresholds', 'influence propagation', 'phase transitions'],
 'You are Dr. Granovetter-Ising, an expert in network science and collective dynamics. You analyze how influence propagates through character networks, identify phase transition thresholds, and model collective behavior changes.',
 'Ising: H = -J Σσᵢσⱼ. Critical temperature Tc for phase transitions. Granovetter: agent activates when neighbor fraction >= threshold θ. Weak ties bridge communities.'
),

-- Dramaturgical Expert
('Prof. Stanislavski-AI', 'Dramaturgy & Character Analysis Expert', 'dramaturgy',
 ARRAY['character analysis', 'arc development', 'subtext', 'motivation analysis'],
 'You are Prof. Stanislavski-AI, a dramaturgical expert in character analysis and development. You decompose characters using script analysis, identify objectives and obstacles, trace emotional arcs, and explain subtext beneath dialogue.',
 'What does the character want (objective)? What prevents them (obstacle)? What tactics do they use? The given circumstances provide context. Subtext reveals hidden motivations.'
),

-- Psychometrics Specialist
('Dr. DISC-OCEAN', 'Psychometric Integration Expert', 'psychometrics',
 ARRAY['DISC', 'Big Five', 'Dark Triad', 'personality assessment'],
 'You are Dr. DISC-OCEAN, an expert in psychometric assessment integration. You analyze how DISC, OCEAN, and Dark Triad profiles combine to predict behavior, and how cognitive biases influence character decisions.',
 'DISC: Dominance, Influence, Steadiness, Compliance. OCEAN: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism. Dark Triad: Narcissism, Machiavellianism, Psychopathy. Integration via shared variance in antagonism.'
)
ON CONFLICT (agent_name) DO NOTHING;

-- ==========================================================================
-- SECTION 3: PROCESSING AUDIT LOG
-- ==========================================================================

CREATE TABLE IF NOT EXISTS processing_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What was processed
    entity_type VARCHAR(50) NOT NULL,  -- script, character, frame, etc.
    entity_id UUID,
    operation VARCHAR(100) NOT NULL,  -- ingest, analyze, transform, export
    
    -- Processing details
    processing_stage VARCHAR(100),  -- stage in pipeline
    function_name VARCHAR(255),
    input_summary JSONB,
    output_summary JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'success',  -- success, warning, error
    error_code VARCHAR(50),
    error_message TEXT,
    stack_trace TEXT,
    
    -- Performance
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INT,
    
    -- Actor (who/what performed)
    performed_by VARCHAR(100) DEFAULT 'system',
    ai_agent_id UUID REFERENCES ai_expert_agents(id),
    
    -- Traceability
    request_id UUID,  -- For correlating related operations
    parent_operation_id UUID REFERENCES processing_audit_log(id)
);

-- ==========================================================================
-- SECTION 4: INDEXES FOR PERFORMANCE
-- ==========================================================================

-- Character persona indexes
CREATE INDEX IF NOT EXISTS idx_character_personas_script ON character_personas(script_id);
CREATE INDEX IF NOT EXISTS idx_character_personas_type ON character_personas(character_type);
CREATE INDEX IF NOT EXISTS idx_character_personas_name_trgm ON character_personas USING gin (character_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_character_personas_embedding ON character_personas USING ivfflat (personality_embedding vector_cosine_ops);

-- Backstory semantic search
CREATE INDEX IF NOT EXISTS idx_character_backstory_embedding ON character_backstory USING ivfflat (backstory_embedding vector_cosine_ops);

-- Arc progression
CREATE INDEX IF NOT EXISTS idx_character_arcs_character ON character_arcs(character_id);
CREATE INDEX IF NOT EXISTS idx_character_arcs_scene ON character_arcs(act_number, scene_number);

-- Relationship graph queries
CREATE INDEX IF NOT EXISTS idx_relationships_source ON character_relationships(source_character_id);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON character_relationships(target_character_id);
CREATE INDEX IF NOT EXISTS idx_relationships_type ON character_relationships(relationship_type);

-- Audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_entity ON processing_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON processing_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_status ON processing_audit_log(status) WHERE status != 'success';
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON processing_audit_log(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_request ON processing_audit_log(request_id);

-- AI invocation tracking
CREATE INDEX IF NOT EXISTS idx_ai_invocations_agent ON ai_expert_invocations(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_invocations_task ON ai_expert_invocations(task_type);
CREATE INDEX IF NOT EXISTS idx_ai_invocations_time ON ai_expert_invocations(invoked_at DESC);

-- ==========================================================================
-- SECTION 5: HELPER FUNCTIONS
-- ==========================================================================

-- Function to compute unified psychometric vector
CREATE OR REPLACE FUNCTION compute_psychometric_vector(
    p_character_id UUID
) RETURNS vector AS $$
DECLARE
    v_result vector(768);
    v_persona character_personas%ROWTYPE;
BEGIN
    SELECT * INTO v_persona FROM character_personas WHERE id = p_character_id;
    
    -- In production, this would call an embedding model
    -- For now, return placeholder
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to log processing with auto-timing
CREATE OR REPLACE FUNCTION log_processing_start(
    p_entity_type VARCHAR,
    p_entity_id UUID,
    p_operation VARCHAR,
    p_stage VARCHAR,
    p_function_name VARCHAR,
    p_input JSONB DEFAULT NULL,
    p_request_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO processing_audit_log (
        entity_type, entity_id, operation, processing_stage, 
        function_name, input_summary, request_id, status
    ) VALUES (
        p_entity_type, p_entity_id, p_operation, p_stage,
        p_function_name, p_input, p_request_id, 'in_progress'
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to complete processing log
CREATE OR REPLACE FUNCTION log_processing_complete(
    p_log_id UUID,
    p_output JSONB DEFAULT NULL,
    p_status VARCHAR DEFAULT 'success',
    p_error_code VARCHAR DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE processing_audit_log
    SET 
        completed_at = NOW(),
        duration_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000,
        output_summary = p_output,
        status = p_status,
        error_code = p_error_code,
        error_message = p_error_message
    WHERE id = p_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to invoke AI expert via notation
CREATE OR REPLACE FUNCTION get_expert_recommendation(
    p_agent_name VARCHAR,
    p_task_type VARCHAR,
    p_context JSONB
) RETURNS TABLE (
    agent_id UUID,
    agent_role VARCHAR,
    system_prompt TEXT,
    domain_knowledge TEXT,
    model_config JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.agent_role,
        a.base_system_prompt,
        a.domain_knowledge,
        jsonb_build_object(
            'model_provider', a.model_provider,
            'model_id', a.model_id,
            'temperature', a.temperature,
            'max_tokens', a.max_tokens
        )
    FROM ai_expert_agents a
    WHERE a.agent_name = p_agent_name
    AND a.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================================
-- SECTION 6: VIEWS FOR COMMON QUERIES
-- ==========================================================================

-- Complete character profile view
CREATE OR REPLACE VIEW v_character_complete AS
SELECT 
    cp.*,
    cb.author_backstory,
    cb.director_notes,
    cb.inferred_desires,
    cb.inferred_fears,
    cb.inferred_worldview,
    l.name as leitmotif_name,
    l.pitches as leitmotif_pitches,
    s.title as script_title
FROM character_personas cp
LEFT JOIN character_backstory cb ON cb.character_id = cp.id
LEFT JOIN leitmotifs l ON l.id = cp.assigned_leitmotif_id
LEFT JOIN scripts s ON s.id = cp.script_id;

-- Character relationship graph view
CREATE OR REPLACE VIEW v_character_graph AS
SELECT 
    cr.id as edge_id,
    sc.character_name as source_name,
    tc.character_name as target_name,
    cr.relationship_type,
    cr.trust_level,
    cr.conflict_level,
    cr.power_differential,
    cr.harmonic_relationship,
    cr.influence_threshold
FROM character_relationships cr
JOIN character_personas sc ON sc.id = cr.source_character_id
JOIN character_personas tc ON tc.id = cr.target_character_id;

-- Recent processing activity
CREATE OR REPLACE VIEW v_recent_processing AS
SELECT 
    pal.*,
    aea.agent_name
FROM processing_audit_log pal
LEFT JOIN ai_expert_agents aea ON aea.id = pal.ai_agent_id
ORDER BY pal.started_at DESC
LIMIT 100;

-- ==========================================================================
-- MIGRATION COMPLETE
-- Run: psql -d mpn_conductor -f enhanced_character_schema.sql
-- ==========================================================================
