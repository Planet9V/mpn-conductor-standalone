# MPN Development Guide

## Project Status: v3.2.0
**Last Updated:** 2026-01-04 13:15 CST  
**Maintained By:** Antigravity AI Development System

---

## Quick Start for New Developers

```bash
# Clone and setup
git clone <repo-url>
cd mpn-conductor-standalone
npm install

# Environment setup (copy and configure)
cp .env.example .env.local

# Start development
npm run dev
```

## Current Implementation Status

### ✅ Completed Features

| Feature | File | Status |
|---------|------|--------|
| MP3 Export | `src/lib/audio_exporter.ts` | ✅ Working |
| MIDI Export | `src/lib/midi_writer.ts` | ✅ Working |
| WebWorker Orchestration | `src/workers/orchestrator.worker.ts` | ✅ Working |
| Leitmotif Transformation | `src/lib/leitmotif_transformation_rules.ts` | ✅ Working |
| Emotional TTS Framework | `src/lib/emotional_tts_renderer.ts` | ✅ Implemented |
| PostgreSQL Optimization | `scripts/deep_postgres_optimization.sql` | ✅ Ready to run |
| Character Persona Schema | `scripts/enhanced_character_schema.sql` | ✅ Ready to run |
| Wiki Documentation | `/wiki/*` | ✅ 6 pages |
| Reference Dictionary | `/mpn-reference` | ✅ v3.2.0, 498 entries |

### 🔲 Pending Implementation

| Phase | Feature | Priority |
|-------|---------|----------|
| 2 | Real Instrument Samples | HIGH |
| 3 | Text2midi API Integration | MEDIUM |
| 4 | ActorInstrumentPicker UI | MEDIUM |
| 5 | Azure Speech Configuration | LOW |

---

## Architecture Overview

```
mpn-conductor-standalone/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── mpn-conductor/      # Main conductor interface
│   │   ├── mpn-lab/            # 14 experimental visualizations
│   │   ├── mpn-reference/      # Reference dictionary (498 entries)
│   │   ├── wiki/               # Documentation wiki
│   │   └── play-library/       # Script management
│   ├── components/
│   │   └── mpn-lab/            # Core MPN components
│   │       ├── GeniusComposer.ts          # Melody generation
│   │       ├── ScoreOrchestrator.ts       # Multi-actor orchestration
│   │       ├── MPNSynthesizer.ts          # Audio synthesis
│   │       ├── leitmotif_generator.ts     # Theme creation
│   │       └── mpn_reference_data.ts      # 3556 lines of mappings
│   ├── lib/                    # Utility libraries
│   │   ├── leitmotif_transformation_rules.ts  # Williams/Shore techniques
│   │   ├── emotional_tts_renderer.ts     # Multi-provider TTS
│   │   ├── audio_exporter.ts             # MP3 export
│   │   └── midi_writer.ts                # MIDI export
│   └── workers/
│       └── orchestrator.worker.ts        # Off-thread processing
├── scripts/
│   ├── deep_postgres_optimization.sql    # DB performance
│   └── enhanced_character_schema.sql     # Character personas
├── docs/
│   └── development/                      # THIS FOLDER
└── public/
    └── theory/                           # Academic documentation
        └── MPN_ACADEMIC_DISSERTATION.md  # 25+ page paper
```

---

## Key Concepts

### 1. Psychometric Dimensions (10 total)
- **DISC:** Dominance, Influence, Steadiness, Compliance
- **OCEAN/Big Five:** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **Dark Triad:** Narcissism, Machiavellianism, Psychopathy
- **Lacanian RSI:** Real, Symbolic, Imaginary
- **Cognitive Biases:** 12 categories (confirmation, anchoring, etc.)
- **Trauma/Entropy:** Continuous 0-1 scales

### 2. Musical Categories (10 total)
- Timbre, Rhythm, Harmony, Dynamics, Melody
- Texture, Mode, Intervals, Articulation, Silence

### 3. Leitmotif Transformation Rules

```typescript
// Modal mapping based on RSI dominance
Real dominant    → Aeolian/Dorian (grounded)
Symbolic dominant → Lydian/Mixolydian (magical)
Imaginary dominant → Phrygian/Locrian (unstable)

// Fragmentation based on entropy
entropy < 0.25 → Full theme
entropy 0.25-0.5 → Truncated (60%)
entropy 0.5-0.75 → Core motif (4 notes)
entropy > 0.75 → Dissolution (single notes)
```

### 4. AI Expert Agents (PostgreSQL)

The system includes 6 pre-seeded AI expert personas:
- **Dr. Lacan-AI** - Psychoanalysis
- **Prof. Williams-Shore** - Film Score Musicology
- **Dr. Phase-Space** - Hamiltonian Physics
- **Dr. Granovetter-Ising** - Network Dynamics
- **Prof. Stanislavski-AI** - Dramaturgy
- **Dr. DISC-OCEAN** - Psychometrics

---

## Environment Variables

```env
# Required
DATABASE_URL=postgresql://...

# Optional AI Features
OPENROUTER_API_KEY=sk-or-...
HUGGINGFACE_API_KEY=hf_...
ELEVENLABS_API_KEY=sk_...

# Optional Azure TTS
AZURE_SPEECH_KEY=...
AZURE_SPEECH_REGION=eastus
```

---

## Common Development Tasks

### Add a new psychometric mapping
1. Edit `src/components/mpn-lab/mpn_reference_data.ts`
2. Add entry with category, dimension, and implementation details
3. Update version number and date

### Add a new visualization experiment
1. Create `src/components/mpn-lab/MPNExperiment_YourName.tsx`
2. Add dynamic import in `/mpn-lab/page.tsx`
3. Add to SECTIONS navigation

### Run PostgreSQL migrations
```bash
psql -d mpn_conductor -f scripts/deep_postgres_optimization.sql
psql -d mpn_conductor -f scripts/enhanced_character_schema.sql
```

---

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testPathPattern="psychometric"
```

---

## Build & Deploy

```bash
# Production build
npm run build

# Verify (should show 21/21 pages)
# All pages should be ○ (static) or ƒ (dynamic)
```

---

## Related Documentation

- [Academic Dissertation](/theory/MPN_ACADEMIC_DISSERTATION.md)
- [Wiki](/wiki)
- [Architecture](/wiki/architecture/data-flow)
- [40+ Frameworks](/wiki/features/frameworks)

---

**For questions or issues, check the wiki at `/wiki` first.**
