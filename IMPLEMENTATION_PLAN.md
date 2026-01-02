# MPN Conductor - Implementation Plan

## Project Overview

**MPN Conductor** is a standalone Docker-ready application that translates psychological states into orchestral musical scores using the McKenney-Lacan theoretical framework.

| Property | Value |
|----------|-------|
| Version | 3.0 |
| Canon | v2.4 |
| Tests | 132 passing |
| Components | 44 |
| Reference Entries | 55+ |
| Literary Scenarios | 3 |

---

## Architecture Summary

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
| Genius Composer | `GeniusComposer.ts` | ~290 | Melody/chord generation |
| Reference Data | `mpn_reference_data.ts` | ~1470 | 55+ entry dictionary |
| Reference Lookup | `mpn_reference_lookup.ts` | ~200 | Query functions |

---

## Feature Specifications

### 1. Psychometric Calculus Engine

**Input**: `PsychometricState` (trauma, entropy, RSI registers)  
**Output**: `MusicalParams` (tempo, key, dynamics, mode, timbre)

| Transformation | Input | Output Range |
|----------------|-------|--------------|
| Trauma → Dynamics | 0-1 | pp (20) to ff (127) |
| Entropy → Tempo | 0-1 | 40-180 BPM |
| RSI → Mode | R/S/I weights | Phrygian/Ionian/Lydian |
| DISC → Instrument | D/I/S/C profile | 50+ instruments |

### 2. Leitmotif System

Each actor receives a unique musical signature:
- **Pitch Class Set** (3-7 notes from chromatic scale)
- **Rhythm Pattern** (durations based on personality)
- **Transformations**: original, inverted, retrograde, augmented, diminished, fragmented

### 3. Orchestration Modes

| Mode | Description |
|------|-------------|
| FULL_ORCHESTRA | All instrument families active |
| CHAMBER_QUARTET | Reduced ensemble |
| SOLO_PIANO | Single instrument reduction |
| BRASS_ENSEMBLE | Power and authority |
| STRINGS_ONLY | Emotional depth |
| LEITMOTIF_WAGNERIAN | Thematic development |
| MINIMALIST_GLASS | Repetition patterns |

### 4. Audio Synthesis

- **Engine**: Tone.js Web Audio API
- **Instruments**: 50+ presets
- **Features**: Real-time playback, crisis alerts, volume control
- **Optional**: ElevenLabs TTS for narration

### 5. Visualizations

| Visualization | Technology | Purpose |
|---------------|------------|---------|
| Conductor Score | SVG/Canvas | Multi-stave notation |
| Tonnetz Grid | Three.js | Neo-Riemannian space |
| Lorenz Attractor | Three.js | Phase space trajectory |
| RSI Triangle | Nivo | Register balance |
| Actor Network | XYFlow | Relationship graph |

---

## Operating Instructions

### Local Development

```bash
# Install and run
npm install
npm run dev -- --port 3002

# Access
http://localhost:3002/             # Landing
http://localhost:3002/mpn-conductor # Main score
http://localhost:3002/mpn-reference # Dictionary
http://localhost:3002/mpn-lab       # Experiments
http://localhost:3002/docs/         # Wiki documentation
```

### Docker Production

```bash
docker-compose up -d

# Services
- mpn-app: http://localhost:3001
- postgres: localhost:5432 (mpn_conductor)
```

### Testing

```bash
npm run test          # Unit tests (132)
npm run test -- --ui  # Vitest UI
npm run test:e2e      # Playwright E2E
```

---

## Documentation Links

| Document | Path | Description |
|----------|------|-------------|
| Wiki Index | `/docs/index.html` | Documentation home |
| Quick Start | `/docs/quickstart.html` | Setup guide |
| Architecture | `/docs/architecture.html` | System design |
| API Reference | `/docs/api-reference.html` | Core functions |
| Components | `/docs/components.html` | React library |
| Theory | `/docs/theory.html` | McKenney-Lacan |
| Testing | `/docs/testing.html` | Test suite |
| Deployment | `/docs/deployment.html` | Production guide |

### Theory Documentation

Located in `public/theory/`:
- `RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md` - Core MPN specification
- `RSCH-40-ORCHESTRAL_MANIFOLD_DYNAMICS.md` - Orchestral theory
- `RSCH-42-AI_MODEL_FRAMEWORK.md` - AI integration specs
- `RSCH-43-PSYCHOMETRIC_CALCULUS.md` - Calculus formulas

---

## File Index

```
mpn-conductor-standalone/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Design system
│   │   ├── mpn-conductor/page.tsx      # Main conductor (673 lines)
│   │   ├── mpn-reference/page.tsx      # Reference dictionary
│   │   └── mpn-lab/page.tsx            # Lab experiments
│   ├── components/
│   │   ├── branding/                   # Logo, PageHeader
│   │   └── mpn-lab/                    # 44 MPN components
│   │       ├── psychometric_calculus.ts
│   │       ├── score_orchestrator.ts
│   │       ├── leitmotif_generator.ts
│   │       ├── GeniusComposer.ts
│   │       ├── mpn_reference_data.ts
│   │       ├── mpn_reference_lookup.ts
│   │       ├── literary_data.ts
│   │       ├── types.ts
│   │       └── [38 more components]
│   ├── lib/
│   │   ├── db.ts                       # PostgreSQL connection
│   │   ├── utils.ts                    # Utilities
│   │   └── ai/                         # AI clients
│   └── __tests__/                      # 7 test files, 132 tests
├── public/
│   ├── docs/                           # Wiki documentation
│   └── theory/                         # Theory documents
├── scripts/
│   └── init_db.sql                     # Database schema
├── docker-compose.yml                  # Container orchestration
├── Dockerfile                          # Production build
├── package.json                        # Dependencies
├── vitest.config.ts                    # Unit test config
└── playwright.config.ts                # E2E test config
```

---

## Development Roadmap

### Completed ✅

- [x] Core psychometric calculus engine
- [x] Multi-stave score orchestrator
- [x] Leitmotif generation system
- [x] 7 orchestration modes
- [x] Tone.js audio synthesis
- [x] 3D visualizations (Tonnetz, Lorenz)
- [x] 3 literary scenarios
- [x] 132 unit tests passing
- [x] Docker deployment ready
- [x] Wiki documentation

### Next Steps: Enhancements

| Priority | Feature | Description |
|----------|---------|-------------|
| HIGH | MIDI Export | Export scores to MIDI files |
| HIGH | Custom Scenarios | Upload/create new literary scenarios |
| MEDIUM | Voice Leading | Automatic voice leading rules |
| MEDIUM | Chord Progression AI | ML-enhanced harmonic generation |
| MEDIUM | Real-time NLP | Analyze text input for RSI values |
| LOW | VR Conductor Mode | Immersive conducting experience |
| LOW | Mobile Responsive | Touch-optimized interface |

### Next Steps: Integrations

| Integration | API | Purpose |
|-------------|-----|---------|
| OpenRouter | GPT-4, Claude | Enhanced melody generation |
| HuggingFace | MusicGen | Neural music synthesis |
| ElevenLabs | TTS | Character voice narration |
| Spotify | Web API | Reference audio playback |

### Adding New Features

1. **New Orchestration Mode**
   - Add to `ORCHESTRATION_MODES` in `GeniusComposer.ts`
   - Implement mode logic in `orchestrateMelody()`
   - Update reference dictionary entries

2. **New Psychometric Dimension**
   - Extend `PsychometricState` interface
   - Add transformation in `psychometricToMusical()`
   - Create lookup entries in reference data

3. **New Literary Scenario**
   - Add to `LITERARY_SCENARIOS` in `literary_data.ts`
   - Define frames with trauma/entropy curves
   - Create actor profiles with DISC values

4. **New Visualization**
   - Create component in `src/components/mpn-lab/`
   - Add dynamic import in page.tsx
   - Connect to `scoreFrame` data

---

## Environment Configuration

```bash
# .env.local

# Core (no API keys required for basic usage)
NODE_ENV=development

# Optional: AI Integration
OPENROUTER_API_KEY=sk-or-v1-...
HUGGINGFACE_API_KEY=hf_...
ELEVENLABS_API_KEY=...

# Optional: Database
DATABASE_URL=postgresql://mpn_user:mpn_pass@localhost:5432/mpn_conductor
```

---

## Support & Resources

| Resource | Link |
|----------|------|
| GitHub | https://github.com/yourusername/mpn-conductor-standalone |
| Documentation | `/docs/index.html` |
| Theory Papers | `/public/theory/` |
| Issue Tracker | GitHub Issues |

---

*MPN Conductor v3.0 | Canon v2.4 | January 2026*
