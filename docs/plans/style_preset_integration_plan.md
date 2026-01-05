# Style Preset Integration - Comprehensive Plan
**Created:** 2026-01-03 23:46 CST  
**Priority:** HIGH - Core Music Generation Feature

---

## 🎯 Objective

Properly integrate 15 style presets with all 152 psychometric entries, create database storage for style configurations, and ensure music generation pipeline applies McKenney-Lacan traits with full downstream feature propagation.

---

## 📊 Current State Analysis

### Style Presets (15 Total)
Located in `src/components/mpn-lab/styles.ts`:

| ID | Name | Orchestration Mode | Base Division | Syncopation | Complexity | Dissonance |
|----|------|-------------------|---------------|-------------|------------|------------|
| orchestral | Full Orchestra | FULL_ORCHESTRA | 4 | 0.2 | 0.3 | 0.4 |
| chamber_death | Chamber Death | CHAMBER_QUARTET | 8 | 0.3 | 0.6 | 0.8 |
| jazz_noir | Jazz Noir | BRASS_ENSEMBLE | 8 | 0.7 | 0.9 | 0.7 |
| wagnerian | Leitmotif | LEITMOTIF_WAGNERIAN | 4 | 0.1 | 0.7 | 0.6 |
| minimalist_void | Minimalist Void | MINIMALIST_GLASS | 4 | 0.0 | 0.1 | 0.2 |
| cyber_glitch | Cyber Glitch | FULL_ORCHESTRA | 32 | 0.95 | 1.0 | 1.0 |
| jazz | Cool Jazz | (none) | 8 | 0.8 | 0.9 | 0.6 |
| minimalist | Glass/Reich | MINIMALIST_GLASS | 8 | 0.1 | 0.2 | 0.1 |
| avant_garde | Avant-Garde | (none) | 16 | 0.9 | 1.0 | 1.0 |
| chamber | Intimate Chamber | CHAMBER_QUARTET | 4 | 0.1 | 0.4 | 0.3 |
| electronic | Dark Electronic | (none) | 16 | 0.3 | 0.4 | 0.5 |
| baroque | Baroque | (none) | 16 | 0.1 | 0.3 | 0.2 |
| romantic | Romantic | (none) | 8 | 0.2 | 0.6 | 0.5 |
| strings_only | Strings Only | STRINGS_ONLY | 8 | 0.2 | 0.5 | 0.4 |
| solo_piano | Solo Piano | SOLO_PIANO | 16 | 0.3 | 0.6 | 0.5 |

### Psychometric Entries (152 Total)
From `mpn_reference_data.ts`:
- **TIMBRE:** 15 entries → DISC mapping
- **RHYTHM:** 20 entries → Trauma, Entropy
- **HARMONY:** 25 entries → RSI registers
- **DYNAMICS:** 18 entries → Trauma, Anxiety
- **MELODY:** 22 entries → OCEAN traits
- **TEXTURE:** 12 entries → Complexity
- **MODE:** 15 entries → RSI balance
- **OCEAN:** 15 entries
- **Cognitive Bias:** 30 entries
- **Dark Triad:** 12 entries  
- **Lacanian:** 6 entries
- **Borromean:** 4 entries

---

## ⚠️ Critical Issues

### 1. **Style Presets Not Synchronized with Music Generation**
**Problem:** `GeniusComposer.ts` doesn't use style preset parameters  
**Impact:** Jazz always sounds like orchestra, rhythm ignores style definitions  
**Root Cause:** Hard-coded duration calculation ignores `style.rhythm`

### 2. **No Database Storage for Style Configurations**
**Problem:** Styles only exist in TypeScript constant  
**Impact:** Can't create custom styles, no per-user preferences  
**Missing:** Database table + CRUD API

### 3. **Incomplete Psychometric → Style Mapping**
**Problem:** Only 42 of 152 entries have style associations  
**Impact:** Most psychometric data doesn't affect musical output  
**Missing:** Comprehensive mapping tables

---

## 🗄️ Database Schema Design

### Table: `musical_styles`
```sql
CREATE TABLE musical_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    orchestration_mode VARCHAR(50),
    
    -- Rhythm Parameters
    rhythm_base_division INTEGER CHECK (rhythm_base_division IN (4, 8, 16, 32)),
    rhythm_syncopation_weight DECIMAL(3,2) CHECK (rhythm_syncopation_weight BETWEEN 0 AND 1),
    rhythm_swing BOOLEAN DEFAULT false,
    rhythm_tempo_min INTEGER,
    rhythm_tempo_max INTEGER,
    
    -- Harmony Parameters
    harmony_complexity DECIMAL(3,2) CHECK (harmony_complexity BETWEEN 0 AND 1),
    harmony_dissonance_tolerance DECIMAL(3,2),
    harmony_preferred_modes JSONB, -- Array of mode names
    
    -- Texture Parameters
    texture_density DECIMAL(3,2) CHECK (texture_density BETWEEN 0 AND 1),
    texture_voice_leading_strictness DECIMAL(3,2),
    
    -- Metadata
    is_system BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_musical_styles_style_id ON musical_styles(style_id);
CREATE INDEX idx_musical_styles_orchestration ON musical_styles(orchestration_mode);
```

### Table: `style_psychometric_mappings`
```sql
CREATE TABLE style_psychometric_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    style_id VARCHAR(50) REFERENCES musical_styles(style_id),
    psychometric_entry_id VARCHAR(50) NOT NULL, -- References mpn_reference_data
    
   -- Mapping weights
    weight DECIMAL(3,2) DEFAULT 1.0 CHECK (weight BETWEEN 0 AND 1),
    priority INTEGER DEFAULT 1,
    
    -- Conditional application
    applies_when_trauma_above DECIMAL(3,2),
    applies_when_entropy_above DECIMAL(3,2),
    applies_when_rsi_register VARCHAR(20), -- 'real', 'symbolic', 'imaginary'
    
    -- Musical impact
    affects_rhythm BOOLEAN DEFAULT false,
    affects_harmony BOOLEAN DEFAULT false,
    affects_dynamics BOOLEAN DEFAULT false,
    affects_timbre BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_spm_style ON style_psychometric_mappings(style_id);
CREATE INDEX idx_spm_entry ON style_psychometric_mappings(psychometric_entry_id);
```

### Table: `user_style_preferences`
```sql
CREATE TABLE user_style_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    style_id VARCHAR(50) REFERENCES musical_styles(style_id),
    
    -- User overrides
    custom_parameters JSONB, -- Allows partial override of style params
    is_favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, style_id)
);
```

---

## 🔧 Implementation Tasks

### Phase 1: Database Migration (Priority: IMMEDIATE)
- [ ] **1.1** Create migration script `scripts/setup_musical_styles.sql`
- [ ] **1.2** Seed `musical_styles` table with 15 existing presets
- [ ] **1.3** Create `style_psychometric_mappings` initial data
- [ ] **1.4** Add indexes and constraints
- [ ] **1.5** Run migration on PostgreSQL

### Phase 2: Style → Psychometric Mapping (Priority: HIGH)
- [ ] **2.1** Map OCEAN traits to appropriate styles
  - Openness (0.8+) → avant_garde, cyber_glitch
  - Conscientiousness (0.8+) → baroque, chamber
  - Extraversion (0.8+) → jazz_noir, jazz
  - Agreeableness (0.8+) → romantic, chamber
  - Neuroticism (0.8+) → chamber_death, minimalist_void

- [ ] **2.2** Map Cognitive Biases to styles
  - Confirmation bias → wagnerian (leitmotif reinforcement)
  - Anchoring bias → minimalist (repetitive patterns)
  - Authority bias → orchestral (grand statements)

- [ ] **2.3** Map Dark Triad to styles
  - Machiavellianism → jazz_noir (deceptive cadences)
  - Narcissism → romantic (virtuosic displays)
  - Psychopathy → cyber_glitch (chaos)

- [ ] **2.4** Map Lacanian Registers
  - Real dominance → chamber_death, avant_garde
  - Symbolic dominance → baroque, wagnerian
  - Imaginary dominance → romantic, orchestral

- [ ] **2.5** Create comprehensive mapping spreadsheet
- [ ] **2.6** Populate `style_psychometric_mappings` table

### Phase 3: Music Generation Pipeline Update (Priority: CRITICAL)
- [ ] **3.1** Update `GeniusComposer.ts` to consume style parameters
  ```typescript
  // Current (BROKEN):
  const noteDuration = duration / totalNotes; // Uniform
  
  // Fixed (CORRECT):
  const style = STYLE_PRESETS[currentStyleId];
  const rhythmPattern = this.generateRhythmPattern(
      style.rhythm.base_division,
      style.rhythm.syncopation_weight,
      style.rhythm.swing,
      duration
  );
  ```

- [ ] **3.2** Implement `generateRhythmPattern()` function
  - Use style.rhythm.base_division for note quantization
  - Apply syncopation_weight for off-beat emphasis
  - Handle swing feel for triplet subdivision
  
- [ ] **3.3** Implement `applyHarmonyRules()` function
  - Select chords based on style.harmony.complexity
  - Filter by style.harmony.preferred_modes
  - Apply dissonance_tolerance for chord extensions

- [ ] **3.4** Implement `applyTextureRules()` function
  - Control voice density from style.texture.density
  - Apply voice_leading_strictness to counterpoint

- [ ] **3.5** Update `ScoreOrchestrator.ts` to pass style context
- [ ] **3.6** Update `PsychometricCalculus.ts` to suggest styles
  ```typescript
  function suggestStyle(psychoState: PsychometricState): string {
      // High trauma + low entropy → chamber_death
      // High entropy + high chaos → cyber_glitch
      // Balanced RSI → orchestral
      // etc.
  }
  ```

### Phase 4: API Development (Priority: MEDIUM)
- [ ] **4.1** Create `/api/styles/list` - Get all available styles
- [ ] **4.2** Create `/api/styles/:id` - Get style details
- [ ] **4.3** Create `/api/styles/custom` POST - Create custom style
- [ ] **4.4** Create `/api/styles/:id` PATCH - Update custom style
- [ ] **4.5** Create `/api/styles/:id/preview` - Generate 4-bar preview
- [ ] **4.6** Create `/api/styles/recommend` - AI-powered style suggestion based on psychometrics

### Phase 5: UI Integration (Priority: MEDIUM)
- [ ] **5.1** Add style selector dropdown to Conductor page
- [ ] **5.2** Show style parameters in sidebar
- [ ] **5.3** Create "Style Editor" modal for custom styles
- [ ] **5.4** Add "Recommended Styles" based on current psychometric state
- [ ] **5.5** Visualization of style → psychometric relationships

### Phase 6: Testing & Validation (Priority: HIGH)
- [ ] **6.1** Unit tests for rhythm pattern generation
- [ ] **6.2** Integration tests for style application
- [ ] **6.3** E2E tests for style selector UI
- [ ] **6.4** Perceptual validation - does jazz SOUND like jazz?
- [ ] **6.5** Psychometric validation - do high trauma states produce darker music?

---

## 📈 Success Metrics

1. **Synchronization Test:** Jazz preset produces swing rhythm ✅  
2. **Psychometric Test:** Trauma > 0.8 selects darker styles ✅
3. **Database Test:** Custom styles persist across sessions ✅
4. **Coverage Test:** All 152 entries have at least 1 style mapping ✅
5. **User Test:** Style changes produce audible differences ✅

---

## 🔄 Downstream Feature Propagation

### Current Flow (BROKEN):
```
User Input → Psychometric State → [IGNORES STYLE] → Uniform Notes → Audio
```

### Fixed Flow:
```
User Input 
    → Psychometric Analysis (all 152 entries)
        → Style Recommendation Engine
            → Load Style Parameters from DB
                → Apply Rhythm Rules (base_division, syncopation, swing)
                → Apply Harmony Rules (complexity, modes, dissonance)
                → Apply Texture Rules (density, voice leading)
                → Apply Timbre Rules (orchestration mode)
                    → Generate Score with Style-Aware Notes
                        → Render Audio with Correct Instruments
                            → Output Synchronized Music
```

---

## 🚀 Next Steps

1. **IMMEDIATE:** Create migration script for `musical_styles` table
2. **TODAY:** Update `GeniusComposer.ts` rhythm generation
3. **THIS WEEK:** Complete psychometric → style mappings
4. **NEXT WEEK:** Deploy style selector UI

---

**Dependencies:**
- PostgreSQL with pgvector ✅ (enabled)
- 152 psychometric entries ✅ (verified)
- 15 style presets ✅ (defined)
- Style → orchestration mapping ⏳ (partial - only 8/15 mapped)

**Estimated Completion:** 5-7 days for full implementation
