# MPN Conductor - Architecture Documentation
**Version:** 3.1.0  
**Updated:** 2026-01-03 17:15 CST  
**Status:** CURRENT

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 MPN CONDUCTOR STACK                     │
├─────────────────────────────────────────────────────────┤
│  PRESENTATION    Next.js 16.1 / React 19 / Tailwind 4  │
│  ORCHESTRATION   ScoreOrchestrator, GeniusComposer     │
│  CALCULUS        PsychometricCalculus, ReferenceLookup │
│  OUTPUT          Tone.js, Three.js, Nivo, XYFlow       │
│  INFRASTRUCTURE  Docker, PostgreSQL, Vitest, Playwright│
└─────────────────────────────────────────────────────────┘
```

### Core Modules

| Module | File | Lines | Purpose |
|--------|------|-------|---------|
| Psychometric Calculus | `psychometric_calculus.ts` | ~400 | Transform ψ → ♪ |
| Score Orchestrator | `score_orchestrator.ts` | ~400 | Multi-stave coordination |
| Leitmotif Generator | `leitmotif_generator.ts` | ~300 | Actor motif system |
| Genius Composer | `GeniusComposer.ts` | ~290 | Melody/chord generation with AI |
| Reference Data | `mpn_reference_data.ts` | ~3500 | 151 entry dictionary |
| Reference Lookup | `mpn_reference_lookup.ts` | ~200 | Query functions |
| AI Music Client | `ai_music_client.ts` | ~198 | OpenRouter/LM Studio integration |
| AI Script Validator | `AIScriptValidator.tsx` | ~393 | Intelligent script parsing |

### Data Flow

```
User Input (Text/Upload)
    ↓
AI Script Validator (GPT-4)
    ↓
Psychometric Analysis
    ↓
Musical Parameter Calculation
    ↓
Score Generation (Multi-stave)
    ↓
Audio Synthesis (Tone.js) + Visual (Three.js/VexFlow)
```

### File Structure

```
mpn-conductor-standalone/
├── src/
│   ├── app/
│   │   ├── page.tsx                      # Landing
│   │   ├── layout.tsx                    # Root layout
│   │   ├── globals.css                   # Design system
│   │   ├── mpn-conductor/page.tsx        # Main conductor (798 lines)
│   │   ├── mpn-reference/page.tsx        # Dictionary browser
│   │   ├── mpn-lab/page.tsx              # Experiments
│   │   ├── play-library/                 # Script library
│   │   │   ├── page.tsx                  # Library view
│   │   │   └── import/page.tsx           # Import wizard with AI validation
│   │   └── api/
│   │       ├── plays/route.ts            # CRUD for scripts
│   │       ├── process-play/route.ts     # Processing endpoint
│   │       └── analyze-script/route.ts   # AI analysis endpoint (NEW)
│   ├── components/
│   │   ├── branding/                     # Logo, PageHeader
│   │   └── mpn-lab/                      # 44+ MPN components
│   │       ├── psychometric_calculus.ts
│   │       ├── score_orchestrator.ts
│   │       ├── leitmotif_generator.ts
│   │       ├── GeniusComposer.ts
│   │       ├── mpn_reference_data.ts
│   │       ├── mpn_reference_lookup.ts
│   │       ├── literary_data.ts
│   │       ├── styles.ts                 # 15 orchestration modes
│   │       ├── types.ts
│   │       ├── AIScriptValidator.tsx     # NEW: AI validation wizard
│   │       ├── ConductorScoreVexFlow.tsx # Multi-measure display
│   │       └── [40+ more components]
│   ├── lib/
│   │   ├── db.ts                         # PostgreSQL + pgvector
│   │   ├── utils.ts                      # Utilities
│   │   └── ai/
│   │       ├── ai_music_client.ts        # AI melody generation
│   │       └── openrouter_client.ts      # OpenRouter API wrapper
│   └── __tests__/                        # 7 test files, 132+ tests
├── public/
│   ├── docs/                             # HTML documentation
│   │   ├── index.html                    # Documentation hub
│   │   ├── master-documentation.html     # THIS FILE - comprehensive
│   │   ├── architecture.html
│   │   ├── features.html
│   │   ├── api-reference.html
│   │   └── [6 more docs]
│   └── theory/                           # Theory documents (54 files)
│       ├── RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md
│       ├── RSCH-42-AI_MODEL_FRAMEWORK.md
│       └── mckenney_lacan_appliced_2025_11_19/ (54 theory docs)
├── scripts/
│   ├── init_db.sql                       # PostgreSQL schema
│   ├── setup_pgvector.sql                # NEW: Vector DB setup
│   └── enable_pgvector.sh                # NEW: Auto-enable script
├── docs/
│   └── PGVECTOR_SETUP.md                 # NEW: Vector DB guide
├── docker-compose.yml                    # Container orchestration
├── Dockerfile                            # Production build
├── package.json                          # Dependencies
├── vitest.config.ts                      # Unit test config
├── playwright.config.ts                  # E2E test config
└── IMPLEMENTATION_PLAN.md                # Project roadmap
```

### Database Schema

**PostgreSQL Tables:**

```sql
-- Play scripts storage
CREATE TABLE plays (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    theme VARCHAR(100),
    description TEXT,
    source_text TEXT,
    is_processed BOOLEAN DEFAULT false,
    processed_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Vector embeddings (pgvector)
CREATE TABLE embeddings (
    id SERIAL PRIMARY KEY,
    play_id UUID REFERENCES plays(id),
    frame_index INT,
    embedding_type VARCHAR(50),
    embedding vector(1536),
    content_text TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Psychometric clusters
CREATE TABLE psychometric_clusters (
    id SERIAL PRIMARY KEY,
    cluster_label VARCHAR(100),
    centroid_embedding vector(1536),
    member_count INT,
    description TEXT
);
```

## Component Architecture

### Psychometric Calculus Engine

**Input:** `PsychometricState`
- trauma: 0-1
- entropy: 0-1  
- lyapunov: number
- RSI registers (Real, Symbolic, Imaginary)
- DISC profile
- OCEAN traits
- Dark Triad scores

**Output:** `MusicalParams`
- tempo: 40-180 BPM
- key: Musical key
- dynamics: MIDI velocity 20-127
- mode: Musical mode
- timbre: Instrument selection
- texture: Density/layering

**Transformations:**
- Trauma → Dynamics: Linear mapping to MIDI velocity
- Entropy → Tempo: Exponential scaling
- RSI → Mode: Weighted modal selection (Phrygian/Ionian/Lydian)
- DISC → Instrument: D=Brass, I=Woodwind, S=Strings, C=Percussion

### Leitmotif System

Each actor receives:
- **Pitch Class Set:** 3-7 notes from chromatic scale
- **Rhythm Pattern:** Based on personality traits
- **Transformations:** Original, inverted, retrograde, augmented, diminished, fragmented

### Orchestration Modes (15 Total)

1. **FULL_ORCHESTRA** - All families active
2. **CHAMBER_QUARTET** - Intimate ensemble
3. **SOLO_PIANO** - Single instrument reduction
4. **BRASS_ENSEMBLE** - Power and authority
5. **STRINGS_ONLY** - Emotional depth
6. **LEITMOTIF_WAGNERIAN** - Thematic development
7. **MINIMALIST_GLASS** - Repetitive patterns
8. **MINIMALIST_REICH** - Phase shifting
9. **CHAMBER_DEATH** - Sparse strings, darkness (NEW)
10. **JAZZ_NOIR** - Muted brass, diminished chords (NEW)
11. **WAGNERIAN** - Evolving leitmotifs (NEW)
12. **MINIMALIST_VOID** - Extreme sparsity (NEW)
13. **CYBER_GLITCH** - Digital chaos, microtonal (NEW)
14. **STRINGS_PURE** - Quartet emotionality (NEW)
15. **SOLO_PIANO_REDUCTION** - Piano-only version (NEW)

---

**For complete API specifications, see /docs/api-reference.html**
**For theory foundations, see /public/theory/RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md**
