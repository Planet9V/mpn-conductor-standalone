# MPN Conductor - AI Integration & Features
**Version:** 3.1.0  
**Updated:** 2026-01-03 17:15 CST  
**Status:** PRODUCTION READY

## AI Integration Framework

### Overview

MPN Conductor integrates multiple AI systems for intelligent music generation, script parsing, and psychometric analysis:

1. **OpenRouter API** - Text-based AI (GPT-4, Claude, Gemini)
2. **HuggingFace API** - Audio generation (MusicGen)
3. **Local LM Studio** - Offline fallback
4. **ElevenLabs TTS** - Voice narration (optional)
5. **Whisper** - Audio transcription (future)

### 1. OpenRouter Integration

**Purpose:** Intelligent melody generation, psychometric analysis, script validation

**Primary Models:**
- `google/gemini-3-flash-preview` - Real-time analysis (~200ms)
- `google/gemini-2.5-flash-lite` - Lightweight fallback
- `anthropic/claude-sonnet-4` - Deep reasoning
- `open ai/gpt-4-turbo` - Script analysis

**Implementation:** `src/lib/ai/openrouter_client.ts`

```typescript
export class OpenRouterClient {
    private apiKey: string;
    private baseURL = 'https://openrouter.ai/api/v1';
    
    // Primary model with fallback chain
    private modelPriority = [
        'google/gemini-3-flash-preview',
        'google/gemini-2.5-flash-lite',
        'openai/gpt-4-turbo'
    ];
    
    async createCompletion(request: CompletionRequest): Promise<CompletionResponse> {
        // Try primary model first, fallback on failure
        for (const model of this.modelPriority) {
            try {
                const response = await this.callAPI(model, request);
                return response;
            } catch (error) {
                console.warn(`Model ${model} failed, trying fallback`);
                continue;
            }
        }
        throw new Error('All models failed');
    }
}
```

**Use Cases:**
- Generate melodies from psychometric states
- Analyze script dialogue for character traits
- Extract Dark Triad indicators from text
- Suggest harmonic progressions

### 2. AI Script Validator

**NEW in v3.1.0**

**Component:** `src/components/mpn-lab/AIScriptValidator.tsx`  
**API Endpoint:** `src/app/api/analyze-script/route.ts`

**Features:**
- **Format Detection:** Shakespeare, Modern Play, Screenplay
- **Structure Extraction:** Acts, Scenes, Characters
- **Dialogue Parsing:** Speaker identification, stage directions
- **Human Review:** Visual UI for validation before processing
- **Fallback Parser:** Regex-based backup when API unavailable

**Workflow:**
1. User uploads/pastes script text
2. Click "Validate with AI" button
3. GPT-4 analyzes structure (5-10 seconds)
4. AI extracts:
   - Format type with confidence score
   - Act and scene breakdown
   - Character list with line counts
   - Stage directions vs dialogue
5. Human reviews in split-screen UI
6. User confirms or edits
7. Script saved with validated structure

**Example AI Prompt:**
```
Analyze this theatrical script and extract its structure. Return ONLY valid JSON:
{
  "format": "shakespeare" | "modern_play" | "screenplay",
  "confidence": 0.0-1.0,
  "acts": [...],
  "characters": [...]
}
```

**Fallback Regex Patterns:**
- Character names: `^[A-Z\s]{2,40}$`
- Stage directions: `^\(.*\)$` or `^\[.*\]$`
- Act headers: `^ACT\s+[IVXLCDM]+`
- Scene headers: `^SCENE\s+[IVXLCDM]+`

### 3. HuggingFace Music Generation

**Models Available:**

| Model | Parameters | API | Output | MPN Use Case |
|-------|------------|-----|---------|--------------|
| facebook/musicgen-large | 1.5B | ✅ Yes | Audio WAV | Crisis sonification, ambient background |
| facebook/musicgen-small | 300M | ✅ Yes | Audio WAV | Quick previews, real-time |
| facebook/musicgen-melody | 1.5B | ✅ Yes | Audio WAV | Leitmotif variations |

**Implementation:**
```typescript
const response = await fetch(
    'https://api-inference.huggingface.co/models/facebook/musicgen-large',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            inputs: 'tense orchestral buildup, minor key, brass crescendo'
        })
    }
);
const audioBlob = await response.blob();
```

**Psychometric → Audio Prompt Mapping:**
- **High Trauma (τ > 0.8):** "chaotic dissonant strings, sudden dynamic shifts, tritone tension"
- **High Entropy (H > 0.7):** "unpredictable melodic fragments, tempo rubato, aleatory textures"
- **Seldon Crisis (λ > 0.1):** "building orchestral catastrophe, brass fanfares, timpani rolls"

### 4. AI Melody Generation

**Component:** `src/lib/ai/ai_music_client.ts`

**Features:**
- Generates melodies based on psychometric input
- McKenney-Lacan theory embedded in prompts
- OpenRouter primary, LM Studio fallback
- Caches responses for performance

**Example Request:**
```typescript
const client = new AIMusicClient();
const melody = await client.generateMelody({
    trauma: 0.9,
    entropy: 0.3,
    rsi: { real: 0.8, symbolic: 0.1, imaginary: 0.1 },
    actorName: 'HAMLET',
    context: 'contemplating mortality'
});
// Returns: array of MIDI note numbers
```

**Prompt Template:**
```
You are a music composition AI specializing in McKenney-Lacan psychometric sonification.

Generate a melody representing:
- CHARACTER: {actorName}
- TRAUMA LEVEL: {trauma} (0-1, higher = more dissonant)
- ENTROPY: {entropy} (0-1, higher = more chaotic)
- LACANIAN REGISTER: Real={real}, Symbolic={symbolic}, Imaginary={imaginary}

Guidelines:
- High trauma → tritones, augmented intervals, wide leaps
- High entropy → irregular rhythms, unpredictable patterns
- Real register dominance → minor keys, dissonance
- Symbolic dominance → structured, predictable
- Imaginary dominance → major keys, consonance

Output ONLY a JSON array of MIDI note numbers (0-127).
Example: [60, 64, 67, 72, 70, 64]
```

### 5. Voice Generation (Optional)

**Provider:** ElevenLabs TTS  
**Status:** Planned for v3.2

**Use Case:** Character dialogue narration during score playback

**Planned Implementation:**
```typescript
const voice = await elevenlabs.textToSpeech({
    text: frame.script.text,
    voiceId: CHARACTER_VOICE_MAP[frame.script.speaker],
    modelId: 'eleven_monolingual_v1'
});
```

### 6. Named Entity Recognition (Future)

**Purpose:** Extract psychometric indicators from unstructured text

**Pipeline:**
1. **Whisper** - Transcribe audio meetings
2. **spaCy/Transformer NER** - Extract entities
3. **Sentiment Analysis** - Detect Dark Triad markers
4. **OpenRouter GPT-4** - Infer OCEAN/DISC traits
5. **Feed to MPN** - Generate real-time organizational score

**Example:**
```
INPUT: "The CEO aggressively dismissed concerns, showing no empathy."

NER EXTRACTION:
- Entity: "CEO" (person)
- Emotion: "aggressively" (dominance)
- Trait: "no empathy" (low agreeableness, potential dark triad)

PSYCHOMETRIC INFERENCE:
- DISC: High D (dominance)
- OCEAN: Low A (agreeableness)
- Dark Triad: Possible narcissism

MUSICAL OUTPUT:
- Instrument: Brass (dominance)
- Dynamics: Forte (loud)
- Harmony: Dissonant (conflict)
```

## Feature Specifications

### Complete Feature List

#### Core Features (v1.0 - v3.1)
- ✅ Psychometric calculus engine (trauma, entropy, Lyapunov)
- ✅ Multi-stave score orchestrator (7 staves)
- ✅ Leitmotif generation system (per-actor themes)
- ✅ 15 orchestration modes
- ✅ Tone.js audio synthesis (50+ instruments)
- ✅ 3D visualizations (Tonnetz, Lorenz, RSI Triangle)
- ✅ 3 literary scenarios (Hamlet, etc.)
- ✅ 151-entry psychometric dictionary
- ✅ 200+ tests (Vitest + Playwright)
- ✅ Docker deployment
- ✅ PostgreSQL + pgvector
- ✅ AI Script Validator with GPT-4
- ✅ Multi-measure conductor view (4-frame look-ahead)

#### AI Features
- ✅ OpenRouter integration (GPT-4, Claude, Gemini)
- ✅ HuggingFace model catalog
- ✅ Local LM Studio fallback
- ✅ Intelligent script parsing
- ✅ Psychometric text analysis
- ⏳ Voice generation (ElevenLabs)
- ⏳ Audio transcription (Whisper)
- ⏳ NER for psychometric extraction

#### Database Features
- ✅ PostgreSQL relational storage
- ✅ pgvector for embeddings
- ✅ Play script library
- ✅ Semantic search functions
- ✅ Psychometric clustering
- ⏳ Embedding generation API
- ⏳ Vector similarity search UI

#### Visualization Features
- ✅ Conductor score (VexFlow multi-measure)
- ✅ Tonnetz neo-Riemannian grid (Three.js)
- ✅ Lorenz attractor (phase space)
- ✅ RSI triangle (register balance)
- ✅ Actor network graph (XYFlow)
- ✅ Real-time psychometric dashboard (3-tier)

#### UI/UX Features
- ✅ Collapsible hero section
- ✅ Modern controls bar (pill-style, glass-morphism)
- ✅ Responsive design
- ✅ Dark mode (default)
- ✅ Volume control
- ✅ Playback controls
- ✅ Crisis alert system

### Orchestration Modes (Detailed)

Each mode affects instrument selection, density, and dynamics:

1. **FULL_ORCHESTRA** - All instrument families, rich harmony
2. **CHAMBER_QUARTET** - 4 instruments, intimate
3. **SOLO_PIANO** - Piano only, simplified texture
4. **BRASS_ENSEMBLE** - Brass section, powerful
5. **STRINGS_ONLY** - String quartet, emotional
6. **LEITMOTIF_WAGNERIAN** - Thematic development, evolving motifs
7. **MINIMALIST_GLASS** - Repetitive arpeggios, additive process
8. **MINIMALIST_REICH** - Phase shifting patterns
9. **CHAMBER_DEATH** - Sparse strings, high trauma sensitivity, darkness
10. **JAZZ_NOIR** - Muted brass, diminished 7ths, smoke-filled atmosphere
11. **WAGNERIAN** - Leitmotif mutations, thematic transformation
12. **MINIMALIST_VOID** - Extreme sparsity, vast silences, glacial
13. **CYBER_GLITCH** - Digital stutters, microtonal clusters, chaos
14. **STRINGS_PURE** - Pure quartet emotionality
15. **SOLO_PIANO_REDUCTION** - All parts reduced to piano

### Psychometric Dictionary (151 Entries)

**Categories:**
- OCEAN (Big Five): 15 entries
- Cognitive Biases: 30 entries
- Dark Triad: 12 entries
- DISC Profile: 4 entries
- Lacanian: 6 entries
- Borromean RSI: 4 entries
- Supporting Dimensions: 80 entries

**Use:** Real-time lookup during score generation for instrument/harmony selection

---

**For installation instructions, see /docs/quickstart.html**
**For API reference, see /docs/api-reference.html**
**For troubleshooting, see /docs/troubleshooting.html**
