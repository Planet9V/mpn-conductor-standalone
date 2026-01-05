-- Database Schema Enhancement for Psychometric Glossary
-- Adds description fields to support detailed glossary and cross-referencing
-- As requested by User for "comprehensive integrations"

-- 1. Add description columns to style_psychometric_mappings
ALTER TABLE style_psychometric_mappings 
ADD COLUMN IF NOT EXISTS trait_description TEXT, -- Detailed definition of the psychometric trait involving deep theory
ADD COLUMN IF NOT EXISTS mapping_explanation TEXT, -- Why this trait maps to this musical parameter
ADD COLUMN IF NOT EXISTS theoretical_source TEXT; -- Citation/Source (e.g. "Lacan, Seminar XI", "Marston DISC")

-- 2. Create a dedicated glossary table for reusable definitions (optional but good practice)
-- This allows us to define "High Dominance" once and reuse it across Rhythm, Harmony etc.
CREATE TABLE IF NOT EXISTS psychometric_glossary (
    glossary_id SERIAL PRIMARY KEY,
    term_key VARCHAR(100) UNIQUE NOT NULL, -- e.g. "DISC_HIGH_D", "ENTROPY_HIGH"
    category VARCHAR(50), -- e.g. "DISC", "OCEAN", "LACAN"
    short_definition TEXT,
    detailed_definition TEXT,
    musical_implication TEXT,
    citations TEXT
);

-- 3. Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_glossary_key ON psychometric_glossary(term_key);

-- 4. Comment on table
COMMENT ON TABLE psychometric_glossary IS 'Comprehensive glossary of psychometric terms, definitions and musical implications';
