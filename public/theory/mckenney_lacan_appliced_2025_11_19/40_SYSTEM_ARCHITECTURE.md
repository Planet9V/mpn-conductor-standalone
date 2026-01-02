# 40. System Architecture
## Complete Component and Data Flow Diagrams

**Author**: McKenney, J.  
**Document ID**: MPN-DOC-40  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [33_FLOW_ADJUSTMENT_SYSTEM](./33_FLOW_ADJUSTMENT_SYSTEM.md) | 
[Next: 41_DATA_ARCHITECTURE →](./41_DATA_ARCHITECTURE.md)

**Related Documents**:
- [30_FLOW_PSYCHOMETRIC_INPUT](./30_FLOW_PSYCHOMETRIC_INPUT.md) - Input flow
- [31_FLOW_CALCULUS_ENGINE](./31_FLOW_CALCULUS_ENGINE.md) - Transform flow
- [42_API_SPECIFICATION](./42_API_SPECIFICATION.md) - API details

---

## 1. High-Level Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        A1["/mpn-conductor"]
        A2["/mpn-reference"]
        A3["/mpn-lab"]
    end
    
    subgraph "Application Layer"
        B1["ScoreOrchestrator"]
        B2["PsychometricCalc"]
        B3["ReferenceLookup"]
    end
    
    subgraph "Data Layer"
        C1["MPNReferenceData"]
        C2["PresetAPI"]
        C3["LocalStorage"]
    end
    
    A1 --> B1
    A2 --> B3
    A3 --> B2
    
    B1 --> B2
    B2 --> B3
    B3 --> C1
    B1 --> C2
    C2 --> C3
```

---

## 2. Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              MPN SYSTEM v3.0                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         PRESENTATION LAYER                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                       │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐        │   │
│  │  │  ConductorPage  │ │  ReferencePage  │ │    LabPage      │        │   │
│  │  │  - Canvas score │ │  - Filter/Cards │ │  - Digital twin │        │   │
│  │  │  - Playback     │ │  - Categories   │ │  - Experiments  │        │   │
│  │  └────────┬────────┘ └────────┬────────┘ └────────┬────────┘        │   │
│  │           │                   │                   │                   │   │
│  │  ┌────────┴───────────────────┴───────────────────┴────────┐        │   │
│  │  │                  UI Components                           │        │   │
│  │  │  - ConductorScore.tsx    - AdjustmentDial.tsx           │        │   │
│  │  │  - ParameterAdjustmentPanel.tsx  - PresetManager.tsx    │        │   │
│  │  └──────────────────────────┬──────────────────────────────┘        │   │
│  │                              │                                        │   │
│  └──────────────────────────────┼────────────────────────────────────────┘   │
│                                 │                                            │
│  ┌──────────────────────────────┼────────────────────────────────────────┐   │
│  │                         APPLICATION LAYER                             │   │
│  ├──────────────────────────────┼────────────────────────────────────────┤   │
│  │                              ▼                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │   │
│  │  │                     ScoreOrchestrator.ts                         │  │   │
│  │  │  - processFrame(state) → PsychometricScoreFrame                  │  │   │
│  │  │  - updateAdjustments(adj)                                        │  │   │
│  │  │  - generateScore(script)                                         │  │   │
│  │  └────────────────────────────┬────────────────────────────────────┘  │   │
│  │                               │                                        │   │
│  │  ┌────────────────────────────▼────────────────────────────────────┐  │   │
│  │  │                  psychometric_calculus.ts                        │  │   │
│  │  │  - psychometricToMusical(state, adj) → MusicalParams             │  │   │
│  │  │  - traumaToDynamics(τ, adj)                                      │  │   │
│  │  │  - entropyToRhythm(H, adj)                                       │  │   │
│  │  │  - rsiToMode(r, s, i)                                            │  │   │
│  │  └────────────────────────────┬────────────────────────────────────┘  │   │
│  │                               │                                        │   │
│  │  ┌────────────────────────────▼────────────────────────────────────┐  │   │
│  │  │                   mpn_reference_lookup.ts                        │  │   │
│  │  │  - lookupTempoRange(stability, adj)                              │  │   │
│  │  │  - lookupDynamics(trauma, adj)                                   │  │   │
│  │  │  - lookupMode(register)                                          │  │   │
│  │  │  - lookupAllParams(...)                                          │  │   │
│  │  └────────────────────────────┬────────────────────────────────────┘  │   │
│  │                               │                                        │   │
│  └───────────────────────────────┼────────────────────────────────────────┘   │
│                                  │                                            │
│  ┌───────────────────────────────┼────────────────────────────────────────┐   │
│  │                          DATA LAYER                                    │   │
│  ├───────────────────────────────┼────────────────────────────────────────┤   │
│  │                               ▼                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    mpn_reference_data.ts                         │   │   │
│  │  │  - MPN_REFERENCE_DICTIONARY: MPNReferenceEntry[]                 │   │   │
│  │  │  - TIMBRE_ENTRIES, RHYTHM_ENTRIES, etc.                          │   │   │
│  │  │  - 55 total entries across 10 categories                         │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                      mpn_preset_api.ts                           │   │   │
│  │  │  - getActiveAdjustments() → Record<string, adj>                  │   │   │
│  │  │  - saveActiveAdjustments(adj)                                    │   │   │
│  │  │  - getPresets(), savePreset(), deletePreset()                    │   │   │
│  │  └────────────────────────────┬────────────────────────────────────┘   │   │
│  │                               │                                         │   │
│  │                               ▼                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                       localStorage                               │   │   │
│  │  │  - oxot_mpn_presets: MPNPreset[]                                 │   │   │
│  │  │  - oxot_mpn_active_adjustments: Record<string, any>              │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow Diagram

```mermaid
flowchart LR
    subgraph Input
        A[User Adjustment]
        B[Agent State]
        C[Script Parser]
    end
    
    subgraph Processing
        D[Validation]
        E[Normalization]
        F[Calculus Engine]
        G[Reference Lookup]
        H[Adjustment Apply]
    end
    
    subgraph Output
        I[MusicalParams]
        J[ScoreFrame]
        K[Canvas Render]
        L[Audio Preview]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    J --> L
```

---

## 4. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 15.x |
| UI Library | React | 19.x |
| Animation | Framer Motion | 11.x |
| Audio | Tone.js | 15.x |
| Canvas | HTML5 Canvas | — |
| State | React useState | — |
| Storage | localStorage | — |
| Testing | Vitest | — |
| Styling | Tailwind CSS | 3.x |

---

## 5. File Structure

```
src/components/mpn-lab/
├── __tests__/
│   └── mpn_calculus.test.ts
├── AdjustmentDial.tsx
├── ConductorScore.tsx
├── MPNExperiment_NeuralPropagation.tsx
├── ParameterAdjustmentPanel.tsx
├── PresetManager.tsx
├── mpn_preset_api.ts
├── mpn_reference_data.ts
├── mpn_reference_lookup.ts
├── mpn_reference_types.ts
├── psychometric_calculus.ts
├── score_orchestrator.ts
└── score_types.ts

src/app/
├── mpn-conductor/
│   └── page.tsx
├── mpn-reference/
│   └── page.tsx
└── mpn-lab/
    └── page.tsx
```

---

## 6. Sequence Diagrams

### 6.1 Score Generation Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant C as ConductorPage
    participant O as ScoreOrchestrator
    participant P as PsychometricCalc
    participant R as ReferenceLookup
    participant S as ConductorScore
    
    U->>C: Click Play
    C->>O: processFrame(state)
    O->>P: psychometricToMusical(state, adj)
    P->>R: lookupTempoRange(stability)
    R-->>P: {min, max}
    P->>R: lookupDynamics(trauma)
    R-->>P: {velocity, label}
    P-->>O: MusicalParams
    O-->>C: ScoreFrame
    C->>S: render(frame)
    S-->>U: Visual Score
```

### 6.2 Adjustment Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant D as AdjustmentDial
    participant A as PresetAPI
    participant L as localStorage
    participant O as Orchestrator
    
    U->>D: Drag dial
    D->>A: saveActiveAdjustments(adj)
    A->>L: setItem(key, value)
    D->>O: updateAdjustments(adj)
    O-->>U: Updated score preview
```

---

## 7. Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "framer-motion": "^11.0.0",
    "tone": "^15.0.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "vitest": "^1.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## References

McKenney, J. (2025). MPN system architecture. *OXOT Research*, 
RSCH-39.

McKenney, J. (2025). Score orchestration patterns. *OXOT Research*, 
RSCH-42.

---

← [33_FLOW_ADJUSTMENT_SYSTEM](./33_FLOW_ADJUSTMENT_SYSTEM.md) | 
[Next: 41_DATA_ARCHITECTURE →](./41_DATA_ARCHITECTURE.md)
