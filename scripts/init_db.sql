-- MPN Conductor Database Schema
-- Auto-executed on first container start
-- Version: 1.0.0
-- Date: 2026-01-01

-- ============================================
-- SCORES TABLE
-- Stores generated psychometric scores
-- ============================================
CREATE TABLE IF NOT EXISTS scores (
    id SERIAL PRIMARY KEY,
    scenario_id VARCHAR(255) NOT NULL,
    scenario_name VARCHAR(255),
    frame_index INTEGER NOT NULL,
    speaker VARCHAR(255),
    text TEXT,
    trauma FLOAT NOT NULL,
    entropy FLOAT NOT NULL,
    baseline FLOAT DEFAULT 0.5,
    arrhythmia FLOAT DEFAULT 0.0,
    neo_riemannian_op VARCHAR(10),
    chord VARCHAR(50),
    tempo INTEGER,
    dynamics VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_scores_scenario ON scores(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scores_created ON scores(created_at);

-- ============================================
-- ACTOR PROFILES TABLE
-- Stores psychometric profiles for actors
-- ============================================
CREATE TABLE IF NOT EXISTS actor_profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    archetype VARCHAR(100),
    -- DISC Profile
    disc_d FLOAT DEFAULT 0.5,
    disc_i FLOAT DEFAULT 0.5,
    disc_s FLOAT DEFAULT 0.5,
    disc_c FLOAT DEFAULT 0.5,
    -- OCEAN / Big Five
    ocean_o FLOAT DEFAULT 0.5,
    ocean_c FLOAT DEFAULT 0.5,
    ocean_e FLOAT DEFAULT 0.5,
    ocean_a FLOAT DEFAULT 0.5,
    ocean_n FLOAT DEFAULT 0.5,
    -- Dark Triad
    dark_triad_mach FLOAT DEFAULT 0.3,
    dark_triad_narc FLOAT DEFAULT 0.3,
    dark_triad_psych FLOAT DEFAULT 0.3,
    -- Musical Assignment
    instrument_family VARCHAR(50),
    leitmotif_pitches INTEGER[],
    leitmotif_rhythm FLOAT[],
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRESETS TABLE
-- Stores parameter adjustment presets
-- ============================================
CREATE TABLE IF NOT EXISTS presets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    adjustments JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SESSIONS TABLE
-- Tracks analysis sessions
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL,
    scenario_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    total_frames INTEGER,
    avg_trauma FLOAT,
    avg_entropy FLOAT,
    peak_trauma FLOAT,
    crisis_events INTEGER DEFAULT 0
);

-- ============================================
-- LEITMOTIFS TABLE
-- Stores generated leitmotifs for reuse
-- ============================================
CREATE TABLE IF NOT EXISTS leitmotifs (
    id SERIAL PRIMARY KEY,
    actor_profile_id INTEGER REFERENCES actor_profiles(id),
    name VARCHAR(255) NOT NULL,
    pitch_classes INTEGER[] NOT NULL,
    base_octave INTEGER DEFAULT 4,
    rhythm FLOAT[] NOT NULL,
    instrument VARCHAR(100),
    transformation_history JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default presets
INSERT INTO presets (name, description, adjustments, is_default) VALUES
('Default', 'Standard MPN parameters', '{}', TRUE),
('High Drama', 'Increased trauma sensitivity', '{"trauma_multiplier": 1.5, "entropy_weight": 1.2}', FALSE),
('Subtle Analysis', 'Reduced intensity for nuanced detection', '{"trauma_multiplier": 0.7, "tempo_dampening": 0.8}', FALSE)
ON CONFLICT (name) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mpn_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO mpn_user;
