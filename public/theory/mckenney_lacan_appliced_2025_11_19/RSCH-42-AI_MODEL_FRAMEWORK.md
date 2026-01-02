# RSCH-42: AI Model Framework for Musical Psychometric Notation

**Document ID:** RSCH-42-AI_MODEL_FRAMEWORK  
**Version:** 1.0.0  
**Date:** 2026-01-01  
**Author:** AEON Core Research  
**Classification:** TIER 2 - INTERNAL RESEARCH

---

## Executive Summary

This document establishes the AI infrastructure framework for Musical Psychometric Notation (MPN) applications. It catalogs available models across OpenRouter and HuggingFace, providing selection criteria, integration patterns, and use-case mappings aligned with McKenney-Lacan theory.

MPN requires AI capabilities across three domains:
1. **Language Understanding** - Text analysis, psychometric interpretation, theory reasoning
2. **Audio Generation** - Sonification of psychological states
3. **Symbolic Music** - MIDI generation, notation synthesis

---

## 1. OpenRouter Model Configuration

### 1.1 Primary Model Stack

| Priority | Model ID | Purpose | Latency | Cost/1M tokens |
|----------|----------|---------|---------|----------------|
| **PRIMARY** | `google/gemini-3-flash-preview` | Real-time psychometric analysis, score interpretation | ~200ms | Low |
| **FALLBACK** | `google/gemini-2.5-flash-lite` | Lightweight backup when primary unavailable | ~150ms | Very Low |
| **EMBEDDING** | `google/gemini-embedding-001` | Vector similarity for leitmotif matching | ~100ms | Minimal |

### 1.2 Audio-Capable Models (for multimodal MPN)

| Model ID | Audio Input | Audio Output | Use Case |
|----------|-------------|--------------|----------|
| `openai/gpt-4o-audio-preview` | ✅ Yes | ❌ No | Analyze recorded organizational audio for psychometric signals |
| `google/gemini-2.5-flash-native-audio-preview` | ✅ Yes | ⚠️ Experimental | Multimodal crisis detection |

### 1.3 High-Capability Reasoning Models (for complex theory)

| Model ID | Context | Best For |
|----------|---------|----------|
| `anthropic/claude-sonnet-4-20250514` | 200K | Deep harmonic analysis, multi-actor score planning |
| `google/gemini-2.5-pro-preview-06-05` | 1M | Full scenario processing, long-form psychohistory |
| `mistralai/mistral-large-3` | 128K | Technical music theory, counterpoint analysis |
| `openai/gpt-4.1` | 128K | General composition assistance |

### 1.4 Selection Criteria for MPN Tasks

```
TASK: Real-time Score Generation
├── Latency Critical: YES
├── Complexity: Medium
└── SELECTION: google/gemini-3-flash-preview

TASK: Deep Psychometric Analysis
├── Latency Critical: NO
├── Complexity: High (multi-actor, Dark Triad)
└── SELECTION: anthropic/claude-sonnet-4 OR google/gemini-2.5-pro

TASK: Audio Pattern Recognition
├── Requires Audio Input: YES
└── SELECTION: openai/gpt-4o-audio-preview
```

---

## 2. HuggingFace Model Catalog

### 2.1 Audio Generation (API Accessible via HF Inference API)

These models can be called directly via POST to HuggingFace Inference endpoints.

#### facebook/musicgen-large
| Property | Value |
|----------|-------|
| **Model ID** | `facebook/musicgen-large` |
| **Parameters** | 1.5B |
| **API Accessible** | ✅ Yes |
| **Endpoint** | `https://api-inference.huggingface.co/models/facebook/musicgen-large` |
| **Input** | Text description (e.g., "dramatic orchestral tension building to crisis") |
| **Output** | Audio waveform (WAV/MP3) |
| **MPN Use Case** | Generate ambient background audio for MPN visualizations; crisis sonification |
| **McKenney-Lacan Mapping** | Real register → Dissonant, unstable audio textures |

**Example Request:**
```json
{
  "inputs": "tense orchestral strings building anxiety, minor key"
}
```

#### facebook/musicgen-small
| Property | Value |
|----------|-------|
| **Model ID** | `facebook/musicgen-small` |
| **Parameters** | 300M |
| **API Accessible** | ✅ Yes |
| **Endpoint** | `https://api-inference.huggingface.co/models/facebook/musicgen-small` |
| **MPN Use Case** | Quick audio previews for real-time score playback |
| **Latency** | Lower than musicgen-large, suitable for interactive applications |

#### facebook/musicgen-melody
| Property | Value |
|----------|-------|
| **Model ID** | `facebook/musicgen-melody` |
| **API Accessible** | ✅ Yes |
| **MPN Use Case** | Generate variations on detected leitmotifs from MPN analysis |
| **Special Feature** | Can condition on input audio/melody for complementary generation |

### 2.2 MIDI/Symbolic Generation (Requires Local Hosting)

These models output symbolic music (MIDI) rather than audio waveforms. They require local deployment with custom tokenizers.

#### loubb/aria-medium-base
| Property | Value |
|----------|-------|
| **Model ID** | `loubb/aria-medium-base` |
| **Architecture** | LLaMA 3.2 (1B parameters) |
| **API Accessible** | ❌ No - Local hosting required |
| **Output** | MIDI via custom tokenizer |
| **Requirements** | `pip install git+https://github.com/EleutherAI/aria-utils.git`, `trust_remote_code=True` |
| **MPN Use Case** | Generate piano MIDI continuations from psychometric state |
| **Best For** | Solo piano representations of Symbolic register |

**Integration Pattern:**
```python
from transformers import AutoModelForCausalLM, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("loubb/aria-medium-base", trust_remote_code=True)
model = AutoModelForCausalLM.from_pretrained("loubb/aria-medium-base", trust_remote_code=True)

# Generate MIDI from psychometric prompt
output = model.generate(input_ids, max_length=512)
midi_file = tokenizer.decode(output).to_midi()
midi_file.save("mpn_score.mid")
```

#### asigalov61/Giant-Music-Transformer
| Property | Value |
|----------|-------|
| **Model ID** | `asigalov61/Giant-Music-Transformer` |
| **Training Data** | Los Angeles MIDI Dataset |
| **API Accessible** | ❌ No |
| **MPN Use Case** | Complex multi-instrument MIDI score generation |
| **Best For** | Full orchestral representations of multi-actor psychometric states |

#### skytnt/midi-model
| Property | Value |
|----------|-------|
| **Model ID** | `skytnt/midi-model` |
| **API Accessible** | ❌ No |
| **MPN Use Case** | General-purpose symbolic music output for MPN conductor scores |
| **McKenney-Lacan Mapping** | Imaginary register → Balanced, ego-flattering melodies |

#### skytnt/midi-model-tv2o-medium
| Property | Value |
|----------|-------|
| **Model ID** | `skytnt/midi-model-tv2o-medium` |
| **API Accessible** | ❌ No |
| **MPN Use Case** | Balanced quality/speed MIDI generation |

#### brianflakes/rwkv-midi-piano
| Property | Value |
|----------|-------|
| **Model ID** | `brianflakes/rwkv-midi-piano` |
| **Architecture** | RWKV (0.1B parameters) |
| **API Accessible** | ❌ No |
| **MPN Use Case** | Lightweight piano-only MIDI for Real register expressions |
| **Best For** | Raw, unprocessed trauma sonification |

#### asigalov61/Heptabit-Music-Transformer
| Property | Value |
|----------|-------|
| **Model ID** | `asigalov61/Heptabit-Music-Transformer` |
| **API Accessible** | ❌ No |
| **MPN Use Case** | Low-latency MIDI generation for real-time MPN playback |
| **Best For** | Interactive conductor score updates |

### 2.3 Audio Understanding

#### openai/whisper-large-v3
| Property | Value |
|----------|-------|
| **Model ID** | `openai/whisper-large-v3` |
| **API Accessible** | ✅ Yes |
| **MPN Use Case** | Analyze recorded organizational meetings for psychometric signal extraction |
| **Output** | Transcription with timestamps |
| **Integration** | Feed transcripts to Gemini for Dark Triad / cognitive bias analysis |

---

## 3. McKenney-Lacan Model Mapping

### 3.1 Register → Model Assignment

| Lacanian Register | Psychometric Characteristic | Recommended Model | Output Type |
|-------------------|----------------------------|-------------------|-------------|
| **Real (R)** | Trauma, unprocessed disturbance | `brianflakes/rwkv-midi-piano` | Raw piano MIDI with dissonance |
| **Symbolic (S)** | Structure, law, protocol compliance | `loubb/aria-medium-base` | Structured contrapuntal MIDI |
| **Imaginary (I)** | Ego, interface, perceived state | `facebook/musicgen-melody` | Pleasant, consonant audio |

### 3.2 Psychometric → Prompt Mapping

```
HIGH TRAUMA (τ > 0.8):
  → MusicGen prompt: "chaotic dissonant strings, sudden dynamic shifts, tritone tension"
  → MIDI model: Enable augmented intervals, irregular rhythms

HIGH ENTROPY (H > 0.7):
  → MusicGen prompt: "unpredictable melodic fragments, tempo rubato, aleatory textures"
  → MIDI model: Increase note density variance, randomize articulation

SELDON CRISIS (λ > 0.1):
  → MusicGen prompt: "building orchestral catastrophe, brass fanfares, timpani rolls"
  → MIDI model: Full orchestration, fff dynamics, cluster chords
```

### 3.3 Neo-Riemannian Transformation → Audio Mapping

| Transformation | Musical Effect | Trigger Condition |
|----------------|---------------|-------------------|
| **R (Relative)** | Major ↔ Relative Minor | Symbolic stability compromise |
| **L (Leading-tone)** | Mediant motion | Imaginary register shift |
| **P (Parallel)** | Major ↔ Parallel Minor | Real register intrusion (trauma) |

---

## 4. Integration Architecture

### 4.1 Production Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      MPN Application                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │ OpenRouter API  │    │ HuggingFace API │                 │
│  │ (Text/Analysis) │    │ (Audio Gen)     │                 │
│  └────────┬────────┘    └────────┬────────┘                 │
│           │                      │                          │
│           ▼                      ▼                          │
│  ┌─────────────────────────────────────────┐                │
│  │         AI Orchestration Layer          │                │
│  │  - Model selection by task              │                │
│  │  - Fallback routing                     │                │
│  │  - Response caching                     │                │
│  └────────────────────┬────────────────────┘                │
│                       │                                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────┐                │
│  │         MPN Score Orchestrator          │                │
│  │  - Psychometric → Musical mapping       │                │
│  │  - Neo-Riemannian transformation        │                │
│  │  - Tone.js audio synthesis              │                │
│  └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Local Development Stack (with MIDI models)

```
┌─────────────────────────────────────────────────────────────┐
│                   Local Development                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   LM Studio     │    │  Local MIDI     │                 │
│  │ (scrapegoat)    │    │  Transformer    │                 │
│  └────────┬────────┘    └────────┬────────┘                 │
│           │                      │                          │
│           │    USE_LOCAL_LM=true │                          │
│           ▼                      ▼                          │
│  ┌─────────────────────────────────────────┐                │
│  │        AIMusicClient (hybrid)           │                │
│  │  - OpenRouter when available            │                │
│  │  - Local fallback for offline dev       │                │
│  └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. API Reference

### 5.1 OpenRouter Completion

```typescript
import { OpenRouterClient } from '@/lib/openrouter_client';

const client = new OpenRouterClient();

const response = await client.createCompletion({
    messages: [
        { role: 'system', content: 'You are an MPN composition AI...' },
        { role: 'user', content: 'Generate a melody for trauma=0.9, entropy=0.3' }
    ],
    temperature: 0.7,
    maxTokens: 500
});
```

### 5.2 HuggingFace Audio Generation

```typescript
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const response = await fetch(
    'https://api-inference.huggingface.co/models/facebook/musicgen-small',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: 'tense orchestral buildup, minor key, brass crescendo'
        })
    }
);

const audioBlob = await response.blob();
```

### 5.3 Model Selection Helper

```typescript
import { HUGGINGFACE_MUSIC_MODELS } from '@/lib/openrouter_client';

function selectModelForTask(task: 'audio' | 'midi' | 'analysis', register: 'R' | 'S' | 'I') {
    if (task === 'audio') {
        return register === 'R' 
            ? HUGGINGFACE_MUSIC_MODELS.musicGenLarge  // Dissonant crisis audio
            : HUGGINGFACE_MUSIC_MODELS.musicGenMelody; // Consonant themes
    }
    if (task === 'midi') {
        return register === 'S'
            ? HUGGINGFACE_MUSIC_MODELS.ariaMediumBase  // Structured piano
            : HUGGINGFACE_MUSIC_MODELS.rwkvMidiPiano;  // Raw expression
    }
    return 'google/gemini-3-flash-preview'; // Default analysis model
}
```

---

## 6. Future Roadmap

### 6.1 Planned Integrations

| Timeline | Integration | Purpose |
|----------|-------------|---------|
| Q1 2026 | Local MIDI transformer deployment | Offline symbolic music generation |
| Q2 2026 | Fine-tuned MPN composition model | Domain-specific training on MPN corpus |
| Q3 2026 | Real-time audio streaming | Live sonification of organizational state |
| Q4 2026 | HuggingFace Spaces deployment | Public MPN demo with audio output |

### 6.2 Model Fine-Tuning Datasets

| Dataset | Source | Size | Purpose |
|---------|--------|------|---------|
| GigaMIDI | Metacreation/GigaMIDI | 2.1M MIDI files | Multi-genre symbolic training |
| Los Angeles MIDI | projectlosangeles | 500K files | Classical/contemporary focus |
| MidiCaps | amaai-lab | 100K+ | Text-conditioned MIDI generation |

---

## 7. Environment Configuration

### 7.1 Required Environment Variables

```bash
# .env.local

# OpenRouter (Required)
OPENROUTER_API_KEY=sk-or-v1-...

# HuggingFace (Required for audio generation)
HUGGINGFACE_API_KEY=hf_...

# Optional: Local development
USE_LOCAL_LM=false
LOCAL_LM_ENDPOINT=http://localhost:1234/v1
```

### 7.2 Model Cost Estimation (per 1M tokens/requests)

| Provider | Model | Estimated Cost |
|----------|-------|----------------|
| OpenRouter | gemini-3-flash-preview | ~$0.10 |
| OpenRouter | gemini-2.5-flash-lite | ~$0.05 |
| OpenRouter | claude-sonnet-4 | ~$3.00 |
| HuggingFace | musicgen-large | Free (rate limited) |
| HuggingFace | musicgen-small | Free (rate limited) |

---

## 8. References

1. McKenney, J. (2025). *Symphonic Calculus: Mathematical Foundations of MPN*
2. Cohn, R. (1998). *Neo-Riemannian Operations, Parsimonious Trichords*
3. Lacan, J. (1966). *Écrits* - Real/Symbolic/Imaginary topology
4. OpenRouter Documentation: https://openrouter.ai/docs
5. HuggingFace MusicGen: https://huggingface.co/facebook/musicgen-large
6. aria-utils: https://github.com/EleutherAI/aria-utils
7. GigaMIDI Dataset: https://huggingface.co/datasets/Metacreation/GigaMIDI

---

**Document Status:** ACTIVE  
**Next Review:** 2026-04-01  
**Maintainer:** MPN Research Team
