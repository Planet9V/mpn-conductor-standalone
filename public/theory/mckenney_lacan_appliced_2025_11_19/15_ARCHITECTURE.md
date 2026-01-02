# 15. Architecture

## System Architecture Diagram and Component Overview

**Document ID**: MPN-DOC-15
**Version**: 3.1.0 (AI-Integrated)
**Last Updated**: December 31, 2025

---

## High-Level Architecture

The MPN System v3.1 architecture introduces a **Hybrid Composition Layer**, where algorithmic psychometric calculus is augmented by a **Generative AI Copilot**.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                   MPN SYSTEM v3.1                                │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         ┌──────────────┐  │
│  │   INPUT     │    │  CALCULUS   │    │  AI HYBRID  │         │   OUTPUT     │  │
│  │   LAYER     │───▶│   ENGINE    │───▶│  COMPOSER   │────────▶│   OUTPUT     │  │
│  └─────────────┘    └──────┬──────┘    └──────┬──────┘         └──────┬───────┘  │
│        │                   │                  │                       │          │
│        ▼                   ▼                  ▼                       ▼          │
│  ┌───────────┐       ┌───────────┐      ┌─────────────┐         ┌───────────┐    │
│  │Psychometric│      │ Reference │      │  LLM Local  │         │Conductor  │    │
│  │  State    │       │Dictionary │      │  Inference  │         │  Score    │    │
│  └───────────┘       └───────────┘      └─────────────┘         └───────────┘    │
│                                           (LM Studio)                            │
└──────────────────────────────────────────────────────────────────────────────────┘
```

The system now operates in two modes:
1.  **Algorithmic Mode**: Pure deterministic mapping of psychometric state to musical parameters.
2.  **AI-Enhanced Mode**: The calculus engine provides a "prompt context" (trauma, entropy, RSI) to a local LLM (`scrapegoat-music-stage2`), which generates novel melodic and harmonic tokens.

---

## Component Diagram

The component structure has been expanded to include the `GeniusComposer` engine and `AIMusicClient`.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                PRESENTATION LAYER                                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐          │
│  │   /mpn-conductor     │  │    /mpn-reference    │  │      /mpn-lab        │          │
│  │                      │  │                      │  │                      │          │
│  │  - Score Canvas      │  │  - Reference Lookup  │  │  - Digital Twin      │          │
│  │  - AI Controls       │  │  - Data Browser      │  │  - AI Playground     │          │
│  │    (Temp/Enabled)    │  │                      │  │                      │          │
│  └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘          │
│             │                         │                         │                      │
├─────────────┼─────────────────────────┼─────────────────────────┼──────────────────────┤
│             │               BUSINESS LOGIC LAYER                │                      │
├─────────────┼─────────────────────────┼─────────────────────────┼──────────────────────┤
│             ▼                         ▼                         ▼                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          score_orchestrator.ts                                   │  │
│  │  ─ processFrame(async) : Orchestrates actor interactions                         │  │
│  │  ─ Manages global tempo, key, and environmental dynamics                         │  │
│  └────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                       │                                                │
│                                       ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                         psychometric_calculus.ts                                 │  │
│  │  ─ Transforms raw psychometrics (Trauma, Entropy) into Musical Params            │  │
│  │  ─ rsiToMode(R, S, I) -> Musical Scale/Mode                                      │  │
│  └────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                       │                                                │
│                                       ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          GeniusComposer.ts (NEW)                                 │  │
│  │  ─ Hybrid Composition Engine                                                     │  │
│  │  ─ composeMelody(leitmotif, params) -> NoteEvents[]                              │  │
│  │  ─ orchestrateChord(root, type) -> Harmonic Texture                              │  │
│  └────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                       │                                                │
│                                       ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          ai_music_client.ts (NEW)                                │  │
│  │  ─ Interfaces with Local LLM (LM Studio)                                         │  │
│  │  ─ Endpoint: http://100.113.4.39:1234/v1/chat/completions                        │  │
│  │  ─ Model: scrapegoat-music-stage2                                                │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
├───────────────────────────────────────┼────────────────────────────────────────────────┤
│                                 DATA LAYER                                             │
├───────────────────────────────────────┼────────────────────────────────────────────────┤
│                                       ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        mpn_reference_lookup.ts                                   │  │
│  │  ─ lookupTempoRange()          ─ lookupDynamics()                                │  │
│  │  ─ lookupModeScale()           ─ lookupArticulation()                            │  │
│  └────────────────────────────────────┬─────────────────────────────────────────────┘  │
│                                       │                                                │
│                                       ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                        mpn_reference_data.ts                                     │  │
│  │  ─ MPN_REFERENCE_DICTIONARY (55 psychometric mappings)                           │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

The data flow now includes an asynchronous branch for AI generation.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ User Input   │     │ Adjustment   │     │ Preset       │
│ (Script,     │     │ Dials        │     │ Selection    │
│  Agent State)│     │              │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│                  PsychometricState                      │
│  { trauma, entropy, rsi, disc, ocean, darkTriad, ... }  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               psychometricToMusical()                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ traumaToDynamics() → velocity, label            │   │
│  │ entropyToRhythm() → tempo, timeSignature        │   │
│  │ rsiToMode() → key, mode                         │   │
│  │ discToInstrument() → instrument family          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     MusicalParams                       │
│  { tempo, timeSignature, key, dynamics, velocity,       │
│    instrument, chordType, articulation, ... }           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               ScoreOrchestrator.processFrame()          │
│  (Asynchronous Execution)                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 1. Transform Leitmotifs based on RSI            │   │
│  │ 2. Determine Activation Levels                  │   │
│  │ 3. Call GeniusComposer (Melody/Harmony)         │   │
│  └───────────────────┬─────────────────────────────┘   │
└──────────────────────┼──────────────────────────────────┘
                       ▼
           ┌──────────────────────────────┐
           │     GeniusComposer           │
           │  (AI Enabled Check)          │
           └───────────┬──────────────────┘
          ┌────────────┴────────────┐
          ▼                         ▼
  [Algorithmic Fallback]      [AI Generation]
  (Rule-based counterpoint)   (AIMusicClient)
                              │
                              ▼
                      [LM Studio API]
                      (100.113.4.39:1234)
                              │
                              ▼
                      [Music Tokens]
                       <xcodec/...>
                              │
  ┌───────────────────────────┴───────────────────────────┐
  │                 PsychometricScoreFrame                │
  │  { frameIndex, speaker, global, staves[], harmony,    │
  │    environment, leitmotifs[], ... }                   │
  └───────────────────────────┬───────────────────────────┘
                              │
                              ▼
  ┌───────────────────────────────────────────────────────┐
  │                   ConductorScore                      │
  │             (Visualization & Playback)                │
  └───────────────────────────────────────────────────────┘
```

---

## File Structure

The project structure has evolved to support the new logic:

```
src/components/mpn-lab/
├── __tests__/
│   └── mpn_calculus.test.ts         # Vitest suite for calculus logic
├── AdjustmentDial.tsx               # UI Component: Parameter slider
├── ConductorScore.tsx               # UI Component: Canvas score renderer
├── GeniusComposer.ts                # [NEW] Core Logic: Hybrid composition engine
├── MPNExperiment_NeuralPropagation.tsx
├── ParameterAdjustmentPanel.tsx     # UI Component: Adjustment panel
├── PresetManager.tsx                # UI Component: Preset save/load
├── mpn_preset_api.ts                # Data: LocalStorage persistence
├── mpn_reference_data.ts            # Data: 55 reference entries
├── mpn_reference_lookup.ts          # Logic: Lookup functions
├── mpn_reference_types.ts           # Types: Interfaces
├── psychometric_calculus.ts         # Logic: Core transformation
├── score_orchestrator.ts            # Logic: Frame processing & Orchestration
└── score_types.ts                   # Types: Score data types

src/lib/
└── ai_music_client.ts               # [NEW] Integration: LM Studio API Client
```

---

## Technology Stack

| Layer | Technology | Details |
|-------|------------|---------|
| **Frontend** | Next.js 16, React 19 | Server Components + Client Hooks |
| **UI Components** | Framer Motion, Lucide Icons | smooth animations, modern iconography |
| **Authentication** | None (Local/Internal) | - |
| **Audio Engine** | Tone.js v15 | Web Audio API wrapper for synthesis |
| **AI / LLM** | **LM Studio (Local)** | Running `scrapegoat-music-stage2` |
| **API Standard** | OpenAI-compatible | Chat Completions endpoint |
| **Calculus** | TypeScript (Custom) | Dictionary-based psychometric mapping |
| **Visualization** | HTML5 Canvas | High-performance score rendering |
| **State** | React useState/useEffect | Local component state |
| **Persistence** | LocalStorage API | User preferences & presets |
| **Testing** | Vitest | Unit testing for calculus |
| **Styling** | Tailwind CSS | Utility-first styling |

---

## Next: [16_SPECIFICATION](./16_SPECIFICATION.md)
