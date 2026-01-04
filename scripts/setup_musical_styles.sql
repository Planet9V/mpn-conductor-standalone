-- ============================================================================
-- Musical Styles Database Migration
-- Created: 2026-01-03 23:47 CST
-- Purpose: Store and manage musical style presets with psychometric mappings
-- ============================================================================

-- Create musical_styles table
CREATE TABLE IF NOT EXISTS musical_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    orchestration_mode VARCHAR(50),
    
    -- Rhythm Parameters
    rhythm_base_division INTEGER CHECK (rhythm_base_division IN (4, 8, 16, 32)),
    rhythm_syncopation_weight DECIMAL(3,2) CHECK (rhythm_syncopation_weight BETWEEN 0 AND 1),
    rhythm_swing BOOLEAN DEFAULT false,
    rhythm_tempo_min INTEGER CHECK (rhythm_tempo_min > 0),
    rhythm_tempo_max INTEGER CHECK (rhythm_tempo_max > rhythm_tempo_min),
    
    -- Harmony Parameters
    harmony_complexity DECIMAL(3,2) CHECK (harmony_complexity BETWEEN 0 AND 1),
    harmony_dissonance_tolerance DECIMAL(3,2) CHECK (harmony_dissonance_tolerance BETWEEN 0 AND 1),
    harmony_preferred_modes JSONB, -- Array of mode names
    
    -- Texture Parameters
    texture_density DECIMAL(3,2) CHECK (texture_density BETWEEN 0 AND 1),
    texture_voice_leading_strictness DECIMAL(3,2) CHECK (texture_voice_leading_strictness BETWEEN 0 AND 1),
    
    -- Metadata
    is_system BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_musical_styles_style_id ON musical_styles(style_id);
CREATE INDEX IF NOT EXISTS idx_musical_styles_orchestration ON musical_styles(orchestration_mode);
CREATE INDEX IF NOT EXISTS idx_musical_styles_system ON musical_styles(is_system);

-- Create style_psychometric_mappings table
CREATE TABLE IF NOT EXISTS style_psychometric_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_id VARCHAR(50) REFERENCES musical_styles(style_id) ON DELETE CASCADE,
    psychometric_entry_id VARCHAR(50) NOT NULL,
    psychometric_dimension VARCHAR(50), -- 'OCEAN', 'DISC', 'DarkTriad', 'Lacanian', etc.
    
    -- Mapping configuration
    weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight BETWEEN 0 AND 1),
    priority INTEGER DEFAULT 1,
    
    -- Conditional application rules
    applies_when_trauma_gt DECIMAL(3,2),
    applies_when_trauma_lt DECIMAL(3,2),
    applies_when_entropy_gt DECIMAL(3,2),
    applies_when_entropy_lt DECIMAL(3,2),
    applies_when_rsi_register VARCHAR(20), -- 'real', 'symbolic', 'imaginary'
    applies_when_rsi_balance_gt DECIMAL(3,2),
    
    -- Musical impact flags
    affects_rhythm BOOLEAN DEFAULT false,
    affects_harmony BOOLEAN DEFAULT false,
    affects_dynamics BOOLEAN DEFAULT false,
    affects_timbre BOOLEAN DEFAULT false,
    affects_tempo BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for mappings
CREATE INDEX IF NOT EXISTS idx_spm_style ON style_psychometric_mappings(style_id);
CREATE INDEX IF NOT EXISTS idx_spm_entry ON style_psychometric_mappings(psychometric_entry_id);
CREATE INDEX IF NOT EXISTS idx_spm_dimension ON style_psychometric_mappings(psychometric_dimension);

-- ============================================================================
-- Seed Data: 15 System Style Presets
-- ============================================================================

INSERT INTO musical_styles (
    style_id, name, description, orchestration_mode,
    rhythm_base_division, rhythm_syncopation_weight, rhythm_swing, rhythm_tempo_min, rhythm_tempo_max,
    harmony_complexity, harmony_dissonance_tolerance, harmony_preferred_modes,
    texture_density, texture_voice_leading_strictness,
    is_system
) VALUES
-- 1. Orchestral
('orchestral', 'Full Orchestra', 'Grand, sweeping textures with functional harmony and dramatic dynamic range.', 'FULL_ORCHESTRA',
 4, 0.20, false, 60, 100,
 0.30, 0.40, '["ionian", "aeolian", "mixolydian"]'::jsonb,
 0.80, 0.90, true),

-- 2. Chamber Death
('chamber_death', 'Chamber Death', 'Intimate darkness. Sparse strings and low woodwinds with high trauma sensitivity and minor modalities.', 'CHAMBER_QUARTET',
 8, 0.30, false, 40, 70,
 0.60, 0.80, '["phrygian", "locrian", "harmonic_minor"]'::jsonb,
 0.20, 0.85, true),

-- 3. Jazz Noir
('jazz_noir', 'Jazz Noir', 'Smoke-filled darkness. Muted brass, walking bass, and diminished chords with late-night swing.', 'BRASS_ENSEMBLE',
 8, 0.70, true, 70, 110,
 0.90, 0.70, '["dorian", "altered", "diminished"]'::jsonb,
 0.40, 0.50, true),

-- 4. Wagnerian
('wagnerian', 'Leitmotif (Wagnerian)', 'Thematic development and transformation. Each actor''s leitmotif evolves through harmonic and rhythmic mutations.', 'LEITMOTIF_WAGNERIAN',
 4, 0.10, false, 50, 90,
 0.70, 0.60, '["chromatic", "major", "minor"]'::jsonb,
 0.90, 0.80, true),

-- 5. Minimalist Void
('minimalist_void', 'Minimalist Void', 'Extreme sparsity. Single sustained tones, vast silences, and glacial harmonic movement.', 'MINIMALIST_GLASS',
 4, 0.00, false, 30, 60,
 0.10, 0.20, '["lydian", "ionian"]'::jsonb,
 0.10, 0.60, true),

-- 6. Cyber Glitch
('cyber_glitch', 'Cyber Glitch', 'Digital chaos. Stuttering rhythms, microtonal clusters, and algorithmic fragmentation with high entropy.', 'CYBER_GLITCH',
 32, 0.95, false, 140, 200,
 1.00, 1.00, '["chromatic", "whole-tone", "octatonic"]'::jsonb,
 0.30, 0.00, true),

-- 7. Cool Jazz
('jazz', 'Cool Jazz Ensemble', 'Extended harmonies (7ths, 9ths), swing rhythms, and improvisational feel.', NULL,
 8, 0.80, true, 80, 140,
 0.90, 0.60, '["dorian", "mixolydian", "blues"]'::jsonb,
 0.50, 0.40, true),

-- 8. Minimalist Glass/Reich
('minimalist', 'Glass/Reich Minimalism', 'Repetitive pulse patterns, slowly shifting harmonies, and hypnotic textures.', 'MINIMALIST_GLASS',
 8, 0.10, false, 110, 160,
 0.20, 0.10, '["ionian", "lydian"]'::jsonb,
 0.60, 0.70, true),

-- 9. Avant-Garde
('avant_garde', 'Avant-Garde / Atonal', 'High entropy, jagged rhythms, and complete harmonic freedom.', NULL,
 16, 0.90, false, 40, 180,
 1.00, 1.00, '["chromatic", "whole-tone"]'::jsonb,
 0.30, 0.10, true),

-- 10. Intimate Chamber
('chamber', 'Intimate Chamber', 'Delicate, transparent textures for emotional dialogue.', 'CHAMBER_QUARTET',
 4, 0.10, false, 50, 80,
 0.40, 0.30, '["aeolian", "harmonic_minor"]'::jsonb,
 0.30, 0.95, true),

-- 11. Dark Electronic
('electronic', 'Dark Electronic', 'Synthesized textures, steady machine pulses, and minor harmonies.', NULL,
 16, 0.30, false, 100, 130,
 0.40, 0.50, '["phrygian", "locrian"]'::jsonb,
 0.70, 0.00, true),

-- 12. Baroque Counterpoint
('baroque', 'Baroque Counterpoint', 'Strict voice leading, ornamented melodies, and driving harmonic rhythm.', NULL,
 16, 0.10, false, 80, 120,
 0.30, 0.20, '["ionian", "harmonic_minor"]'::jsonb,
 0.60, 1.00, true),

-- 13. Romantic Expressive
('romantic', 'Romantic Expressive', 'Ebb and flow of tempo, lush harmonies, and high emotional dynamic.', NULL,
 8, 0.20, false, 40, 100,
 0.60, 0.50, '["major", "minor"]'::jsonb,
 0.90, 0.70, true),

-- 14. Strings Only
('strings_only', 'Strings Only', 'Pure string quartet emotionality with rich harmonic voicing and expressive portamento.', 'STRINGS_ONLY',
 8, 0.20, false, 50, 100,
 0.50, 0.40, '["aeolian", "dorian", "mixolydian"]'::jsonb,
 0.70, 0.90, true),

-- 15. Solo Piano
('solo_piano', 'Solo Piano', 'Single instrument reduction with full harmonic expression and intimate dynamics.', 'SOLO_PIANO',
 16, 0.30, false, 40, 120,
 0.60, 0.50, '["all"]'::jsonb,
 0.50, 0.70, true);

-- ============================================================================
-- Initial Psychometric Mappings (High-Level Examples)
-- Full mappings to be added in Phase 2
-- ============================================================================

-- Chamber Death ← High Trauma
INSERT INTO style_psychometric_mappings (
    style_id, psychometric_entry_id, psychometric_dimension,
    weight, priority, applies_when_trauma_gt, affects_harmony, affects_dynamics
) VALUES
('chamber_death', 'lacanian-real-dominance', 'Lacanian', 0.95, 1, 0.75, true, true),
('chamber_death', 'dark-triad-psychopathy', 'DarkTriad', 0.90, 2, 0.70, true, true);

-- Jazz Noir ← Machiavellianism
INSERT INTO style_psychometric_mappings (
    style_id, psychometric_entry_id, psychometric_dimension,
    weight, priority, affects_harmony, affects_rhythm
) VALUES
('jazz_noir', 'dark-triad-machiavellianism', 'DarkTriad', 0.95, 1, true, true);

-- Avant-Garde ← High Entropy + High Openness
INSERT INTO style_psychometric_mappings (
    style_id, psychometric_entry_id, psychometric_dimension,
    weight, applies_when_entropy_gt, affects_rhythm, affects_harmony
) VALUES
('avant_garde', 'ocean-openness-high', 'OCEAN', 0.90, 0.80, true, true),
('cyber_glitch', 'ocean-openness-high', 'OCEAN', 0.95, 0.85, true, true);

-- Romantic ← High Agreeableness + Imaginary Register
INSERT INTO style_psychometric_mappings (
    style_id, psychometric_entry_id, psychometric_dimension,
    weight, applies_when_rsi_register, affects_harmony, affects_dynamics
) VALUES
('romantic', 'ocean-agreeableness-high', 'OCEAN', 0.85, 'imaginary', true, true);

-- Baroque ← High Conscientiousness
INSERT INTO style_psychometric_mappings (
    style_id, psychometric_entry_id, psychometric_dimension,
    weight, affects_rhythm, affects_harmony
) VALUES
('baroque', 'ocean-conscientiousness-high', 'OCEAN', 0.90, true, true);

-- ============================================================================
-- Utility Functions
-- ============================================================================

-- Function to get recommended style based on psychometric state
CREATE OR REPLACE FUNCTION get_recommended_style(
    p_trauma DECIMAL,
    p_entropy DECIMAL,
    p_rsi_real DECIMAL,
    p_rsi_symbolic DECIMAL,
    p_rsi_imaginary DECIMAL
) RETURNS VARCHAR(50) AS $$
DECLARE
    v_dominant_register VARCHAR(20);
    v_recommended_style VARCHAR(50);
BEGIN
    -- Determine dominant RSI register
    IF p_rsi_real > p_rsi_symbolic AND p_rsi_real > p_rsi_imaginary THEN
        v_dominant_register := 'real';
    ELSIF p_rsi_symbolic > p_rsi_imaginary THEN
        v_dominant_register := 'symbolic';
    ELSE
        v_dominant_register := 'imaginary';
    END IF;
    
    -- High trauma cases
    IF p_trauma > 0.80 THEN
        RETURN 'chamber_death';
    END IF;
    
    -- High entropy cases
    IF p_entropy > 0.85 THEN
        IF p_entropy > 0.95 THEN
            RETURN 'cyber_glitch';
        ELSE
            RETURN 'avant_garde';
        END IF;
    END IF;
    
    -- RSI-based selection
    IF v_dominant_register = 'real' AND p_trauma > 0.60 THEN
        RETURN 'chamber_death';
    ELSIF v_dominant_register = 'symbolic' AND p_trauma < 0.40 THEN
        IF p_entropy < 0.30 THEN
            RETURN 'baroque';
        ELSE
            RETURN 'wagnerian';
        END IF;
    ELSIF v_dominant_register = 'imaginary' THEN
        RETURN 'romantic';
    END IF;
    
    -- Default
    RETURN 'orchestral';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Grants
-- ============================================================================

GRANT SELECT, INSERT, UPDATE ON musical_styles TO mpn_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON style_psychometric_mappings TO mpn_user;
GRANT EXECUTE ON FUNCTION get_recommended_style TO mpn_user;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE musical_styles IS 'Musical style presets with rhythm, harmony, and texture parameters';
COMMENT ON TABLE style_psychometric_mappings IS 'Maps psychometric entries to musical styles with conditional rules';
COMMENT ON FUNCTION get_recommended_style IS 'AI function to recommend style based on psychometric state';

-- Completion message
DO $$
BEGIN
    RAISE NOTICE 'Musical styles migration completed successfully!';
    RAISE NOTICE '15 system styles loaded';
    RAISE NOTICE 'Initial psychometric mappings created';
    RAISE NOTICE 'Style recommendation function available';
END $$;
