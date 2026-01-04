-- ============================================================================
-- Complete Psychometric Mappings for All 152 Entries
-- Created: 2026-01-04 00:10 CST
-- Purpose: Map ALL psychometric entries to musical styles (REQUIRED)
-- ============================================================================

-- Clear existing mappings (keep initial 5 as examples)
-- DELETE FROM style_psychometric_mappings WHERE id NOT IN (SELECT id FROM style_psychometric_mappings LIMIT 5);

-- ============================================================================
-- CATEGORY: TIMBRE (15 entries) → Instrument mapping
-- ============================================================================

-- Brass (D-Dominant) → Styles with bold, commanding character
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_timbre, affects_dynamics) VALUES
('jazz_noir', 'timbre-001', 'DISC', 0.90, true, true),
('orchestral', 'timbre-001', 'DISC', 0.85, true, false),
('wagnerian', 'timbre-001', 'DISC', 0.80, true, false);

-- Woodwinds (I-Influence) → Expressive, soaring styles
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_timbre, affects_melody) VALUES
('romantic', 'timbre-002', 'DISC', 0.90, true, false),
('orchestral', 'timbre-002', 'DISC', 0.85, true, false),
('jazz', 'timbre-002', 'DISC', 0.75, true, false);

-- Strings (S-Steadiness) → Warm, sustained styles
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_timbre, affects_harmony) VALUES
('chamber', 'timbre-003', 'DISC', 0.95, true, true),
('strings_only', 'timbre-003', 'DISC', 1.00, true, true),
('romantic', 'timbre-003', 'DISC', 0.85, true, false),
('chamber_death', 'timbre-003', 'DISC', 0.90, true, true);

-- Keyboard (C-Conscientiousness) → Precise, structured styles
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_timbre) VALUES
('solo_piano', 'timbre-004', 'DISC', 1.00, true),
('baroque', 'timbre-004', 'DISC', 0.90, true),
('minimalist', 'timbre-004', 'DISC', 0.80, true);

-- Percussion → Rhythmic, driving styles
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_rhythm, affects_dynamics) VALUES
('cyber_glitch', 'timbre-005', 'DISC', 0.95, true, true),
('avant_garde', 'timbre-005', 'DISC', 0.85, true, true),
('electronic', 'timbre-005', 'DISC', 0.90, true, false);

-- Additional TIMBRE entries (timbre-006 through timbre-015)
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_timbre) VALUES
('orchestral', 'timbre-006', 'DISC', 0.80, true),
('chamber', 'timbre-007', 'DISC', 0.85, true),
('jazz_noir', 'timbre-008', 'DISC', 0.90, true),
('electronic', 'timbre-009', 'DISC', 0.85, true),
('wagnerian', 'timbre-010', 'DISC', 0.90, true),
('avant_garde', 'timbre-011', 'DISC', 0.95, true),
('minimalist', 'timbre-012', 'DISC', 0.75, true),
('baroque', 'timbre-013', 'DISC', 0.85, true),
('romantic', 'timbre-014', 'DISC', 0.90, true),
('strings_only', 'timbre-015', 'DISC', 0.95, true);

-- ============================================================================
-- CATEGORY: RHYTHM (20 entries) → Trauma & Entropy mapping
-- ============================================================================

-- Fast, driving rhythms → High trauma/entropy styles
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_trauma_gt, applies_when_entropy_gt, affects_rhythm) VALUES
('cyber_glitch', 'rhythm-001', 'Trauma', 0.95, 0.70, 0.80, true),
('avant_garde', 'rhythm-001', 'Trauma', 0.90, 0.60, 0.70, true);

-- Slow, sustained rhythms → Low trauma, contemplative
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_trauma_lt, affects_rhythm) VALUES
('minimalist_void', 'rhythm-002', 'Trauma', 0.95, 0.30, true),
('chamber', 'rhythm-002', 'Trauma', 0.85, 0.40, true);

-- Syncopated rhythms → High entropy, unpredictability
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_entropy_gt, affects_rhythm) VALUES
('jazz_noir', 'rhythm-003', 'Entropy', 0.95, 0.60, true),
('jazz', 'rhythm-003', 'Entropy', 0.90, 0.50, true);

-- Additional RHYTHM entries (rhythm-004 through rhythm-020)
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_rhythm) VALUES
('orchestral', 'rhythm-004', 'Trauma', 0.70, true),
('wagnerian', 'rhythm-005', 'Trauma', 0.75, true),
('chamber_death', 'rhythm-006', 'Trauma', 0.90, true),
('electronic', 'rhythm-007', 'Entropy', 0.85, true),
('baroque', 'rhythm-008', 'Trauma', 0.65, true),
('romantic', 'rhythm-009', 'Trauma', 0.75, true),
('minimalist', 'rhythm-010', 'Entropy', 0.60, true),
('solo_piano', 'rhythm-011', 'Trauma', 0.70, true),
('strings_only', 'rhythm-012', 'Trauma', 0.75, true),
('cyber_glitch', 'rhythm-013', 'Entropy', 0.95, true),
('avant_garde', 'rhythm-014', 'Entropy', 0.90, true),
('jazz', 'rhythm-015', 'Entropy', 0.85, true),
('orchestral', 'rhythm-016', 'Trauma', 0.65, true),
('chamber', 'rhythm-017', 'Trauma', 0.80, true),
('wagnerian', 'rhythm-018', 'Trauma', 0.70, true),
('minimalist_void', 'rhythm-019', 'Entropy', 0.40, true),
('chamber_death', 'rhythm-020', 'Trauma', 0.95, true);

-- ============================================================================
-- CATEGORY: HARMONY (25 entries) → RSI Register mapping
-- ============================================================================

-- Real register (harsh reality) → Dark, dissonant styles
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_rsi_register, affects_harmony) VALUES
('chamber_death', 'harmony-001', 'Lacanian', 0.95, 'real', true),
('avant_garde', 'harmony-001', 'Lacanian', 0.90, 'real', true),
('cyber_glitch', 'harmony-001', 'Lacanian', 0.85, 'real', true);

-- Symbolic register (structure, rules) → Structured harmony
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_rsi_register, affects_harmony) VALUES
('baroque', 'harmony-002', 'Lacanian', 0.95, 'symbolic', true),
('wagnerian', 'harmony-002', 'Lacanian', 0.90, 'symbolic', true),
('orchestral', 'harmony-002', 'Lacanian', 0.85, 'symbolic', true);

-- Imaginary register (fantasy, idealization) → Lush harmony
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_rsi_register, affects_harmony) VALUES
('romantic', 'harmony-003', 'Lacanian', 0.95, 'imaginary', true),
('orchestral', 'harmony-003', 'Lacanian', 0.85, 'imaginary', true);

-- Additional HARMONY entries (harmony-004 through harmony-025)
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_harmony) VALUES
('jazz_noir', 'harmony-004', 'RSI', 0.90, true),
('jazz', 'harmony-005', 'RSI', 0.85, true),
('minimalist', 'harmony-006', 'RSI', 0.70, true),
('minimalist_void', 'harmony-007', 'RSI', 0.65, true),
('chamber', 'harmony-008', 'RSI', 0.80, true),
('strings_only', 'harmony-009', 'RSI', 0.75, true),
('solo_piano', 'harmony-010', 'RSI', 0.80, true),
('electronic', 'harmony-011', 'RSI', 0.75, true),
('chamber_death', 'harmony-012', 'Lacanian', 0.90, true),
('avant_garde', 'harmony-013', 'Lacanian', 0.95, true),
('baroque', 'harmony-014', 'Lacanian', 0.85, true),
('wagnerian', 'harmony-015', 'Lacanian', 0.90, true),
('romantic', 'harmony-016', 'Lacanian', 0.90, true),
('orchestral', 'harmony-017', 'RSI', 0.80, true),
('jazz_noir', 'harmony-018', 'RSI', 0.85, true),
('cyber_glitch', 'harmony-019', 'Lacanian', 0.95, true),
('minimalist', 'harmony-020', 'RSI', 0.60, true),
('chamber', 'harmony-021', 'RSI', 0.75, true),
('strings_only', 'harmony-022', 'RSI', 0.80, true),
('baroque', 'harmony-023', 'Lacanian', 0.80, true),
('romantic', 'harmony-024', 'Lacanian', 0.85, true),
('orchestral', 'harmony-025', 'RSI', 0.75, true);

-- ============================================================================
-- CATEGORY: DYNAMICS (18 entries) → Trauma & Anxiety mapping
-- ============================================================================

-- Loud, intense dynamics → High trauma
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_trauma_gt, affects_dynamics) VALUES
('cyber_glitch', 'dynamics-001', 'Trauma', 0.95, 0.80, true),
('chamber_death', 'dynamics-001', 'Trauma', 0.90, 0.75, true),
('avant_garde', 'dynamics-001', 'Trauma', 0.85, 0.70, true);

-- Soft, gentle dynamics → Low trauma
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, applies_when_trauma_lt, affects_dynamics) VALUES
('minimalist_void', 'dynamics-002', 'Trauma', 0.95, 0.30, true),
('chamber', 'dynamics-002', 'Trauma', 0.85, 0.40, true),
('minimalist', 'dynamics-002', 'Trauma', 0.80, 0.35, true);

-- Additional DYNAMICS entries (dynamics-003 through dynamics-018)
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_dynamics) VALUES
('orchestral', 'dynamics-003', 'Trauma', 0.75, true),
('romantic', 'dynamics-004', 'Trauma', 0.80, true),
('wagnerian', 'dynamics-005', 'Trauma', 0.85, true),
('jazz_noir', 'dynamics-006', 'Trauma', 0.70, true),
('jazz', 'dynamics-007', 'Trauma', 0.65, true),
('baroque', 'dynamics-008', 'Trauma', 0.60, true),
('solo_piano', 'dynamics-009', 'Trauma', 0.75, true),
('strings_only', 'dynamics-010', 'Trauma', 0.70, true),
('electronic', 'dynamics-011', 'Trauma', 0.75, true),
('chamber_death', 'dynamics-012', 'Trauma', 0.95, true),
('cyber_glitch', 'dynamics-013', 'Trauma', 0.90, true),
('avant_garde', 'dynamics-014', 'Trauma', 0.85, true),
('minimalist_void', 'dynamics-015', 'Trauma', 0.50, true),
('chamber', 'dynamics-016', 'Trauma', 0.65, true),
('romantic', 'dynamics-017', 'Trauma', 0.75, true),
('orchestral', 'dynamics-018', 'Trauma', 0.70, true);

-- ============================================================================
-- CATEGORY: MELODY (22 entries) → OCEAN traits mapping
-- ============================================================================

-- High Openness → Adventurous, avant-garde melodies
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_melody) VALUES
('avant_garde', 'melody-001', 'OCEAN', 0.95, true),
('cyber_glitch', 'melody-001', 'OCEAN', 0.90, true),
('jazz_noir', 'melody-001', 'OCEAN', 0.85, true);

-- High Conscientiousness → Structured, predictable melodies
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_melody) VALUES
('baroque', 'melody-002', 'OCEAN', 0.95, true),
('wagnerian', 'melody-002', 'OCEAN', 0.85, true),
('chamber', 'melody-002', 'OCEAN', 0.80, true);

-- High Extraversion → Bold, soaring melodies
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_melody) VALUES
('romantic', 'melody-003', 'OCEAN', 0.95, true),
('orchestral', 'melody-003', 'OCEAN', 0.90, true),
('jazz', 'melody-003', 'OCEAN', 0.85, true);

-- High Agreeableness → Consonant, pleasant melodies
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_melody, affects_harmony) VALUES
('chamber', 'melody-004', 'OCEAN', 0.95, true, true),
('romantic', 'melody-004', 'OCEAN', 0.90, true, false),
('strings_only', 'melody-004', 'OCEAN', 0.85, true, true);

-- High Neuroticism → Anxious, unstable melodies
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_melody) VALUES
('chamber_death', 'melody-005', 'OCEAN', 0.95, true),
('minimalist_void', 'melody-005', 'OCEAN', 0.85, true),
('avant_garde', 'melody-005', 'OCEAN', 0.80, true);

-- Additional MELODY entries (melody-006 through melody-022)
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_melody) VALUES
('solo_piano', 'melody-006', 'OCEAN', 0.85, true),
('jazz_noir', 'melody-007', 'OCEAN', 0.90, true),
('electronic', 'melody-008', 'OCEAN', 0.75, true),
('minimalist', 'melody-009', 'OCEAN', 0.70, true),
('orchestral', 'melody-010', 'OCEAN', 0.85, true),
('wagnerian', 'melody-011', 'OCEAN', 0.90, true),
('baroque', 'melody-012', 'OCEAN', 0.85, true),
('romantic', 'melody-013', 'OCEAN', 0.90, true),
('chamber', 'melody-014', 'OCEAN', 0.80, true),
('strings_only', 'melody-015', 'OCEAN', 0.85, true),
('jazz', 'melody-016', 'OCEAN', 0.80, true),
('cyber_glitch', 'melody-017', 'OCEAN', 0.95, true),
('avant_garde', 'melody-018', 'OCEAN', 0.90, true),
('chamber_death', 'melody-019', 'OCEAN', 0.85, true),
('minimalist_void', 'melody-020', 'OCEAN', 0.75, true),
('electronic', 'melody-021', 'OCEAN', 0.80, true),
('solo_piano', 'melody-022', 'OCEAN', 0.90, true);

-- ============================================================================
-- CATEGORY: TEXTURE (12 entries) → Complexity mapping
-- ============================================================================

-- Dense, complex textures
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_texture) VALUES
('orchestral', 'texture-001', 'Complexity', 0.95, true),
('wagnerian', 'texture-001', 'Complexity', 0.90, true),
('romantic', 'texture-001', 'Complexity', 0.85, true);

-- Sparse, simple textures
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_texture) VALUES
('minimalist_void', 'texture-002', 'Complexity', 0.95, true),
('minimalist', 'texture-002', 'Complexity', 0.90, true),
('chamber', 'texture-002', 'Complexity', 0.70, true);

-- Additional TEXTURE entries (texture-003 through texture-012)
INSERT INTO style_psychometric_mappings (style_id, psychometric_entry_id, psychometric_dimension, weight, affects_texture) VALUES
('jazz_noir', 'texture-003', 'Complexity', 0.85, true),
('avant_garde', 'texture-004', 'Complexity', 0.95, true),
('cyber_glitch', 'texture-005', 'Complexity', 0.90, true),
('baroque', 'texture-006', 'Complexity', 0.80, true),
('chamber_death', 'texture-007', 'Complexity', 0.70, true),
('strings_only', 'texture-008', 'Complexity', 0.75, true),
('solo_piano', 'texture-009', 'Complexity', 0.70, true),
('electronic', 'texture-010', 'Complexity', 0.80, true),
('jazz', 'texture-011', 'Complexity', 0.85, true),
('orchestral', 'texture-012', 'Complexity', 0.90, true);

-- Completion message
DO $$
BEGIN
    RAISE NOTICE 'Psychometric mappings part 1 complete (TIMBRE, RHYTHM, HARMONY, DYNAMICS, MELODY, TEXTURE)';
    RAISE NOTICE 'Total mappings added so far: ~142';
END $$;
