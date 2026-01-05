# MPN Conductor Application: Comprehensive Analysis

**Document ID:** MPN-ANALYSIS-2026-01-01  
**Date:** 2026-01-01  
**Classification:** AEON Internal Research  
**Author:** AI Research Assistant  

---

## Executive Summary

The **MPN Conductor** (v3.0) is an advanced Musical Psychometric Notation web application that transforms psychological states into real-time musical scores. It represents the "Version 2" evolution of the MPN system, building upon extensive McKenney-Lacan theory documentation and implementing a sophisticated multi-stave orchestration system.

This analysis provides a comprehensive review of current capabilities, identifies architectural gaps, and proposes AI enhancement pathways aligned with [RSCH-42-AI_MODEL_FRAMEWORK.md](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mckenney-lacan_theory/mckenney_lacan_appliced_2025_11_19/RSCH-42-AI_MODEL_FRAMEWORK.md).

---

## 1. Application Architecture Overview

### 1.1 Core Application Files

| Component | Location | Purpose |
|-----------|----------|---------|
| **Conductor Page** | [page.tsx](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/src/app/mpn-conductor/page.tsx) (673 lines) | Main orchestration UI with scenario playback, psychometric dashboard, and visualizations |
| **Reference Dictionary** | [page.tsx](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/src/app/mpn-reference/page.tsx) (676 lines) | Interactive musical↔psychometric mapping reference with AI model catalog |
| **Score Orchestrator** | [score_orchestrator.ts](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/src/components/mpn-lab/score_orchestrator.ts) (406 lines) | Actor stave management, counterpoint rules, global harmony |
| **Genius Composer** | [GeniusComposer.ts](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/src/components/mpn-lab/GeniusComposer.ts) (287 lines) | AI-enabled melody generation with orchestration modes |
| **Psychometric Calculus** | [psychometric_calculus.ts](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/src/components/mpn-lab/psychometric_calculus.ts) | Trauma→Musical parameter transformation engine |

### 1.2 Python Engine (Offline/Research)

| Component | Location | Purpose |
|-----------|----------|---------|
| **MPN Calculus** | [mpn_calculus.py](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mpn_engine/core/mpn_calculus.py) (310 lines) | Core metric calculations (Trauma R, Entropy H, Baseline B, Arrhythmia α) |
| **Tonnetz Engine** | [tonnetz.py](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mpn_engine/core/tonnetz.py) (240 lines) | Neo-Riemannian harmonic transformations (P, L, R, PLP) |
| **Dynamics Mapper** | [dynamics_mapper.py](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mpn_engine/core/dynamics_mapper.py) | OCEAN traits → musical dynamics |
| **Instrument Mapper** | [instrument_mapper.py](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mpn_engine/core/instrument_mapper.py) | DISC profiles → instrument families |

### 1.3 Database Infrastructure

| System | Host | Database | Purpose |
|--------|------|----------|---------|
| **PostgreSQL** | 172.30.253.47:5432 | `oxot_mpn` | MPN scores, actor profiles, parameter presets |
| **Neo4j** | *(documented)* | *(graph)* | Relationship topology between actors |
| **Qdrant** | *(documented)* | *(vectors)* | Semantic search for leitmotif matching |

---

## 2. Current Capabilities

### 2.1 Conductor Score Features

1. **Multi-Stave Visualization**
   - Dynamic actor staves with instrument assignment (DISC → Brass/Woodwind/Strings/Percussion)
   - Visual note representation with activation highlighting
   - Global harmony stave for background texture

2. **Scenario Playback System**
   - Pre-loaded literary scenarios (Hamlet, Oedipus Rex, Macbeth)
   - Frame-by-frame progression with auto-play
   - Speed control (ms between frames)

3. **Psychometric Dashboard**
   - Real-time trauma (τ), entropy (H), velocity, tempo, Lyapunov (λ), BSI metrics
   - Crisis detection with visual alert when τ > 0.8
   - Chord progression display

4. **Phase Space Visualizations**
   - **Lorenz Attractor**: 3D chaos visualization driven by trauma/entropy
   - **Tonnetz Grid**: Neo-Riemannian torus showing harmonic transformations
   - **Leitmotif Registry**: Actor activation status

5. **Audio Synthesis**
   - Tone.js-based audio playback via `useMPNSynthesizer` hook
   - Volume control, crisis alert sounds
   - Instrument-specific timbres

### 2.2 Orchestration Modes

| Mode | Description |
|------|-------------|
| `FULL_ORCHESTRA` | Wide voicing with bass/tenor/alto/soprano distribution |
| `CHAMBER_DEATH` | Intimate, mortality-focused texture |
| `JAZZ_NOIR` | Cluster voicing with 9th/11th extensions |
| `WAGNERIAN` | Leitmotif-intensive with chromatic transformations |
| `MINIMALIST_VOID` | Sparse root/fifth only |
| `CYBER_GLITCH` | Digital interference aesthetic |

### 2.3 AI Integration (Current State)

The `GeniusComposer` includes preliminary AI integration:

```typescript
setAIEnabled(enabled: boolean, temperature: number = 0.7) {
    this.useAI = enabled;
    this.aiTemperature = temperature;
    if (enabled) this.aiClient.checkConnection();
}
```

When AI is enabled:
- Melodies are generated via `AIMusicClient.generateMelody()`
- Falls back to algorithmic generation if AI unavailable
- Temperature-controlled creativity parameter

---

## 3. Theoretical Foundation

### 3.1 McKenney-Lacan Theory Documentation

The application is grounded in a comprehensive 34-document wiki:

| Section | Documents | Key Content |
|---------|-----------|-------------|
| **Theoretical Foundations** | 6 docs | Lacanian RSI registers, Borromean topology, DISC/OCEAN/Dark Triad |
| **Mathematical Foundations** | 6 docs | Core equations, entropy calculus, Lyapunov stability, Neo-Riemannian math |
| **Reference Dictionary** | 10 docs | Timbre, rhythm, harmony, dynamics, melody, texture, mode, intervals, articulation, silence mappings |
| **Process Flows** | 4 docs | Input processing, calculus engine, score generation, adjustment system |
| **Architecture** | 4 docs | System architecture, data architecture, API specification, deployment |
| **References** | 4 docs | Bibliography (89 citations), glossary, research index, appendix tables |

### 3.2 Core Transformation Pipeline

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Psychometric   │ ──→ │   MPN Calculus  │ ──→ │    Musical      │
│     Input       │     │     Engine      │     │    Parameters   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
   DISC, OCEAN,            Trauma R(t)             Tempo, Key,
   Dark Triad,            Entropy H(t)            Dynamics,
   Cognitive Bias,        Baseline B(t)           Timbre,
   Lacanian RSI           Arrhythmia α(t)         Chord Progression
```

### 3.3 Neo-Riemannian Transformation Mapping

| Trauma Level | Operation | Musical Effect | Psychological Meaning |
|--------------|-----------|----------------|----------------------|
| τ < 0.3 | R (Relative) | C Major → a minor | Stable, lawful behavior |
| 0.3 ≤ τ < 0.6 | L (Leading-tone) | Chromatic mediant motion | Emotional tension, anticipation |
| 0.6 ≤ τ < 0.8 | P (Parallel) | Major ↔ Parallel Minor | Darkening, trauma intrusion |
| τ ≥ 0.8 | PLP (Compound) | C Major → D♭ Major | Seldon Crisis, catastrophic shift |

---

## 4. Gap Analysis

### 4.1 AI Integration Gaps

| Gap | Current State | Required State | Priority |
|-----|---------------|----------------|----------|
| **Audio Generation** | Tone.js synthesis only | HuggingFace MusicGen integration for ambient audio | HIGH |
| **MIDI Generation** | Algorithmic pitch selection | Local MIDI transformer for symbolic composition | MEDIUM |
| **Psychometric Prompting** | Basic trauma/entropy passthrough | Structured prompt engineering per RSCH-42 | HIGH |
| **Model Selection** | Single AI endpoint | Multi-model routing based on task/register | MEDIUM |
| **Leitmotif Matching** | Static generation | Embedding-based similarity search | LOW |

### 4.2 Functional Gaps

| Gap | Description | Impact |
|-----|-------------|--------|
| **Real-Time Input** | No live psychometric input stream | Limited to pre-scripted scenarios |
| **Export Functionality** | No MIDI/MusicXML export | Cannot integrate with DAWs |
| **Multi-User Sessions** | Single-user local only | No collaborative scoring |
| **Persistence** | Limited DB integration | Scores not saved to PostgreSQL |
| **Actor Profiles** | Hardcoded archetypes | No dynamic profile ingestion |

### 4.3 UX/UI Gaps

| Gap | Description |
|-----|-------------|
| **Mobile Responsiveness** | 3D visualizations not optimized for mobile |
| **Accessibility** | No screen reader support for score representation |
| **Keyboard Navigation** | Playback controls not keyboard-accessible |

---

## 5. AI Enhancement Roadmap

### 5.1 Phase 1: Audio Generation Integration (Q1 2026)

Integrate HuggingFace MusicGen models for ambient audio generation:

```typescript
// Proposed integration pattern
async generateAmbientAudio(trauma: number, entropy: number): Promise<Blob> {
    const prompt = this.buildMusicGenPrompt(trauma, entropy);
    const response = await fetch(
        'https://api-inference.huggingface.co/models/facebook/musicgen-large',
        {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${HF_API_KEY}` },
            body: JSON.stringify({ inputs: prompt })
        }
    );
    return response.blob();
}

private buildMusicGenPrompt(trauma: number, entropy: number): string {
    if (trauma > 0.8) {
        return "chaotic dissonant strings, sudden dynamic shifts, tritone tension";
    } else if (entropy > 0.7) {
        return "unpredictable melodic fragments, tempo rubato, aleatory textures";
    } else {
        return "gentle orchestral strings, consonant harmonies, flowing melody";
    }
}
```

### 5.2 Phase 2: LLM-Driven Score Analysis (Q2 2026)

Use OpenRouter's `google/gemini-3-flash-preview` for real-time psychometric interpretation:

```typescript
interface ScoreAnalysisRequest {
    scriptText: string;
    actorProfiles: ActorProfile[];
    currentHarmony: HarmonyState;
}

async analyzeScoreIntent(request: ScoreAnalysisRequest): Promise<ScoreDirective> {
    const response = await openRouterClient.createCompletion({
        model: 'google/gemini-3-flash-preview',
        messages: [
            { role: 'system', content: MPN_SYSTEM_PROMPT },
            { role: 'user', content: JSON.stringify(request) }
        ]
    });
    return parseScoreDirective(response);
}
```

### 5.3 Phase 3: Local MIDI Transformer (Q3 2026)

Deploy symbolic music generation for conductor-quality MIDI output:

| Model | Use Case | Integration |
|-------|----------|-------------|
| `loubb/aria-medium-base` | Solo piano Symbolic register | Local Docker service |
| `asigalov61/Giant-Music-Transformer` | Full orchestral scores | GPU inference endpoint |
| `brianflakes/rwkv-midi-piano` | Real register raw expression | Lightweight container |

### 5.4 Phase 4: Multimodal Integration (Q4 2026)

- Audio input analysis via `openai/gpt-4o-audio-preview`
- Transcription + psychometric extraction from recorded meetings
- Real-time organizational sonification during live events

---

## 6. Recommended Next Steps

### Immediate Actions (Week 1-2)

1. **Add HuggingFace API Key to Environment**
   ```bash
   # .env.local
   HUGGINGFACE_API_KEY=hf_...
   ```

2. **Implement MusicGen Audio Generation**
   - Create `src/lib/musicgen_client.ts`
   - Add ambient audio layer to conductor output

3. **Enhance Psychometric→Prompt Mapping**
   - Expand `RSCH-42` prompt templates
   - Create comprehensive prompt library per register

### Short-Term Actions (Weeks 3-6)

4. **PostgreSQL Integration**
   - Save generated scores to `oxot_mpn.scores` table
   - Persist actor profiles and presets

5. **MIDI Export**
   - Integrate `jsmidgen` or `midi-writer-js`
   - Add export button to conductor controls

6. **Improved Actor Profiles**
   - API endpoint to ingest new actor psychometrics
   - Dynamic registration during scenario playback

### Medium-Term Actions (Months 2-3)

7. **Local MIDI Model Deployment**
   - Docker container for `aria-medium-base`
   - WebSocket interface for real-time generation

8. **Leitmotif Embedding Search**
   - Use `gemini-embedding-001` for motif vectors
   - Qdrant collection for similarity matching

9. **Real-Time Input Stream**
   - WebSocket endpoint for live psychometric feed
   - Integration with SIEM/OODA loop data sources

---

## 7. Integration Architecture (Proposed)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MPN CONDUCTOR v4.0                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐         │
│  │   Live Input  │   │  Scenario     │   │  SIEM Events  │         │
│  │   (WebSocket) │   │  Playback     │   │  (REST API)   │         │
│  └───────┬───────┘   └───────┬───────┘   └───────┬───────┘         │
│          │                   │                   │                  │
│          └───────────────────┼───────────────────┘                  │
│                              ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 PSYCHOMETRIC ANALYSIS LAYER                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │ Gemini 3    │  │ Claude      │  │ GPT-4o      │          │   │
│  │  │ Flash       │  │ Sonnet 4    │  │ Audio       │          │   │
│  │  │ (Primary)   │  │ (Deep)      │  │ (Input)     │          │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MPN CALCULUS ENGINE                       │   │
│  │  Trauma R(t) │ Entropy H(t) │ Baseline B(t) │ Arrhythmia α  │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SCORE ORCHESTRATOR                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │ GeniusComp │  │ Counterpoint│  │ Leitmotif   │          │   │
│  │  │ (Melody)   │  │ Engine      │  │ Transform   │          │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                   AI MUSIC GENERATION LAYER                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │ MusicGen   │  │ Aria MIDI   │  │ Giant Music │          │   │
│  │  │ (Audio)    │  │ (Symbolic)  │  │ Transformer │          │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │
│  └─────────────────────────┬───────────────────────────────────┘   │
│                            ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                      OUTPUT LAYER                            │   │
│  │  Tone.js Audio │ MIDI Export │ Score Visualization │ API    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. References

1. [RSCH-42-AI_MODEL_FRAMEWORK.md](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mckenney-lacan_theory/mckenney_lacan_appliced_2025_11_19/RSCH-42-AI_MODEL_FRAMEWORK.md) - AI infrastructure framework
2. [RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mckenney-lacan_theory/RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md) - MPN formal specification
3. [McKenney-Lacan Applied Theory Wiki](file:///home/jim/AEON%20Cyber%20Digital%20Twin%20Website/Site-OXOT_v2/mckenney-lacan_theory/mckenney_lacan_appliced_2025_11_19/README.md) - Complete documentation (34 documents)
4. Cohn, R. (1998). *Introduction to Neo-Riemannian Theory*. Journal of Music Theory.
5. Lacan, J. (1966). *Écrits* - Real/Symbolic/Imaginary topology.

---

**Document Status:** ACTIVE  
**Last Updated:** 2026-01-01  
**Next Review:** 2026-03-01
