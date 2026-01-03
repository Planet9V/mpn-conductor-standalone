# MPN Conductor

<div align="center">

![MPN Logo](https://img.shields.io/badge/MPN-Conductor-FFD700?style=for-the-badge&logo=music&logoColor=black)
![Version](https://img.shields.io/badge/version-3.0-blue?style=for-the-badge)
![Tests](https://img.shields.io/badge/tests-132%20passing-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-purple?style=for-the-badge)

**Musical Psychometric Notation System**

*Translating psychological states into orchestral scores using the McKenney-Lacan theoretical framework*

[Quick Start](#quick-start) • [Features](#features) • [Documentation](#documentation) • [Architecture](#architecture) • [API](#api-reference)

</div>

---

## Overview

MPN Conductor is an advanced visualization and audio synthesis system that transforms psychological metrics into real-time musical notation. Built on the McKenney-Lacan theoretical framework, it generates multi-stave conductor's scores where each character receives a unique musical voice based on their psychometric profile.

### What It Does

- **Transforms Psychometric Data** → Trauma, entropy, and Lacanian registers (Real/Symbolic/Imaginary) map to tempo, dynamics, mode, and harmonic tension
- **Generates Actor Leitmotifs** → DISC personality profiles generate unique musical signatures for each character
- **Orchestrates Multi-Stave Scores** → Real-time conductor's score with up to 12 simultaneous voices
- **Synthesizes Audio** → Live playback using Tone.js web audio synthesis
- **Visualizes Phase Space** → 3D Tonnetz grid and Lorenz attractor for state monitoring

---

## Quick Start

### Prerequisites

- Node.js 20.0.0+
- npm 9.0+
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mpn-conductor-standalone.git
cd mpn-conductor-standalone

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and navigate to:
- `/mpn-conductor` - Main conductor's score
- `/mpn-reference` - Reference dictionary
- `/mpn-lab` - Experimental tools

### Docker Deployment

```bash
# Build and run with PostgreSQL
docker-compose up -d

# Application: http://localhost:3001
```

---

## Features

### 🎼 Psychometric Score Generation
Transform psychological states into musical parameters using the psychometric calculus engine:

| Input | Output |
|-------|--------|
| Trauma (τ) | Dynamics (velocity) |
| Entropy (H) | Tempo & time signature |
| RSI Registers | Modal selection |
| DISC Profile | Instrument assignment |
| Dark Triad | Timbre & articulation |
| OCEAN/Big Five | Harmony, intervals, texture |
| Cognitive Biases | Rhythmic patterns, motifs |

### 🎭 Character Leitmotifs
Each actor receives a unique musical signature based on their profile:
- **Pitch Class Set** - Derived from personality dimensions
- **Rhythm Pattern** - Based on cognitive style
- **Transformations** - Inversion, retrograde, augmentation, fragmentation

### 🎹 7 Orchestration Modes
- `FULL_ORCHESTRA` - All instrument families
- `CHAMBER_QUARTET` - Intimate ensemble
- `SOLO_PIANO` - Single instrument reduction
- `BRASS_ENSEMBLE` - Power and authority
- `STRINGS_ONLY` - Emotional depth
- `LEITMOTIF_WAGNERIAN` - Thematic development
- `MINIMALIST_GLASS` - Repetition and pattern

### 📊 Real-Time Visualizations
- **Conductor Score** - Multi-stave notation with dynamics
- **Tonnetz Grid** - Neo-Riemannian harmonic space
- **Lorenz Attractor** - Phase space trajectory
- **RSI Triangle** - Lacanian register balance

### 🔊 Audio Synthesis
- Real-time playback via Tone.js
- 50+ instrument presets
- Crisis alert sonification
- ElevenLabs TTS integration (optional)

### 🤖 AI Integration (Optional)
- OpenRouter API for enhanced melody generation
- HuggingFace models for music analysis
- Configurable temperature control

---

## Documentation

Full documentation is available as an interactive wiki:

| Document | Description |
|----------|-------------|
| [Index](public/docs/index.html) | Documentation home |
| [Quick Start](public/docs/quickstart.html) | Installation & setup |
| [Architecture](public/docs/architecture.html) | System design |
| [API Reference](public/docs/api-reference.html) | Core functions |
| [Components](public/docs/components.html) | React components |
| [Theory](public/docs/theory.html) | McKenney-Lacan foundations |
| [Testing](public/docs/testing.html) | Test suite guide |
| [Deployment](public/docs/deployment.html) | Production deployment |

Access the wiki at `http://localhost:3000/docs/` when running locally.

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                    PRESENTATION                        │
│  Conductor Score │ Reference Dict │ MPN Lab            │
├────────────────────────────────────────────────────────┤
│                    ORCHESTRATION                       │
│  ScoreOrchestrator │ GeniusComposer │ LeitmotifGen     │
├────────────────────────────────────────────────────────┤
│                      CALCULUS                          │
│  PsychometricCalc │ ReferenceLookup │ ReferenceData    │
├────────────────────────────────────────────────────────┤
│                       OUTPUT                           │
│  Tone.js Audio │ Three.js 3D │ Nivo Charts             │
└────────────────────────────────────────────────────────┘
```

### Key Files

```
src/
├── app/
│   ├── mpn-conductor/page.tsx    # Main conductor UI (673 lines)
│   ├── mpn-reference/page.tsx    # Reference dictionary
│   └── mpn-lab/page.tsx          # Experiments
├── components/mpn-lab/
│   ├── psychometric_calculus.ts  # Core transformation engine
│   ├── score_orchestrator.ts     # Multi-stave coordinator
│   ├── leitmotif_generator.ts    # Actor motif system
│   ├── GeniusComposer.ts         # Melody/chord generation
│   └── mpn_reference_data.ts     # 1468-line dictionary
└── __tests__/                    # 132 unit tests
```

---

## API Reference

### Core Functions

```typescript
// Transform psychological state to musical parameters
psychometricToMusical(state: PsychometricState): MusicalParams

// Analyze text for Lacanian registers
analyzeRSI(text: string): { real: number; symbolic: number; imaginary: number }

// Generate actor leitmotif from DISC profile
generateLeitmotif(profile: ActorProfile): Leitmotif

// Process a script frame through the orchestrator
orchestrator.processFrame(script, trauma, entropy): ScoreOutput
```

### Types

```typescript
interface PsychometricState {
    trauma: number;      // 0-1 (Riemann curvature)
    entropy: number;     // 0-1 (Shannon entropy)
    rsi: { real: number; symbolic: number; imaginary: number };
}

interface ActorProfile {
    id: string;
    name: string;
    disc?: { D: number; I: number; S: number; C: number };
    darkTriad?: { machiavellianism: number; narcissism: number; psychopathy: number };
}
```

---

## Testing

```bash
# Run unit tests (132 tests)
npm run test

# Run with UI
npm run test -- --ui

# Run E2E tests
npm run test:e2e
```

### Test Coverage

| Module | Tests | Status |
|--------|-------|--------|
| Psychometric Calculus | 33 | ✅ |
| Leitmotif Generator | 22 | ✅ |
| Score Orchestrator | 15 | ✅ |
| Genius Composer | 18 | ✅ |
| Reference Data | 19 | ✅ |
| Literary Data | 18 | ✅ |
| MPN Calculus | 7 | ✅ |

---

## Tech Stack

- **Framework**: Next.js 16.1 / React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Audio**: Tone.js
- **3D**: react-three-fiber / Three.js
- **Visualization**: Nivo, XYFlow, react-globe.gl
- **Animation**: Framer Motion, GSAP
- **Testing**: Vitest, Playwright
- **Database**: PostgreSQL
- **Deployment**: Docker

---

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
# Optional AI Integration
OPENROUTER_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...
ELEVENLABS_API_KEY=...

# Optional Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mpn_conductor
```

---

## Literary Scenarios

Built-in scenarios from classic literature:

| Scenario | Source | Frames |
|----------|--------|--------|
| Hamlet's Dilemma | Shakespeare | 12 |
| Oedipus Rex | Sophocles | 10 |
| Macbeth's Descent | Shakespeare | 11 |

Each scenario includes pre-analyzed trauma/entropy curves and character DISC profiles.

---

## Theoretical Foundation

MPN Conductor implements the **McKenney-Lacan Theory** of Musical Psychometric Notation:

- **Trauma (τ)** → Riemann Curvature → Dynamic intensity
- **Entropy (H)** → Shannon Entropy → Rhythmic stability
- **RSI Registers** → Lacanian topology → Modal selection
- **Neo-Riemannian Operations** → P/L/R chord transformations
- **Borromean Stability** → Topological clinical assessment

See [Theory Documentation](public/docs/theory.html) for complete specification.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm run test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- **McKenney-Lacan Theory** - Theoretical framework
- **AEON Cyber** - Original research and development
- **Tone.js** - Web audio synthesis
- **Three.js** - 3D visualization

---

<div align="center">

**MPN Conductor v3.0** | Canon v3.0 | 116 Entries | Built with ♪ and ψ

</div>
