# 16. Specification
## Technical API and Data Specification

---

## 1. Core Types

### 1.1 PsychometricState

The input state from which all musical parameters are derived.

```typescript
interface PsychometricState {
    // Core dimensions (all 0.0 - 1.0)
    trauma: number;
    entropy: number;
    arrhythmia: number;
    
    // Profile objects
    rsi: {
        real: number;
        symbolic: number;
        imaginary: number;
    };
    
    disc: {
        D: number;
        I: number;
        S: number;
        C: number;
    };
    
    ocean: {
        O: number;  // Openness
        C: number;  // Conscientiousness
        E: number;  // Extraversion
        A: number;  // Agreeableness
        N: number;  // Neuroticism
    };
    
    darkTriad: {
        narcissism: number;
        machiavellianism: number;
        psychopathy: number;
    };
}
```

---

### 1.2 MusicalParams

The output of the psychometric-to-musical transformation.

```typescript
interface MusicalParams {
    tempo: number;              // BPM (40-200)
    timeSignature: string;      // e.g., "4/4", "5/4"
    key: string;                // e.g., "C Ionian", "A Phrygian"
    dynamics: string;           // e.g., "mf", "ff"
    velocity: number;           // MIDI velocity (0-127)
    instrument: string;         // e.g., "Brass", "Strings"
    chordType: string;          // e.g., "major7", "diminished"
    articulation: string;       // e.g., "legato", "staccato"
}
```

---

### 1.3 MPNReferenceEntry

A single entry in the reference dictionary.

```typescript
interface MPNReferenceEntry {
    id: string;                           // e.g., "rhythm-006"
    category: MPNCategory;                // enum value
    subcategory: string;                  // e.g., "tempo"
    musicalElement: string;               // e.g., "80-100 BPM"
    displayName: string;                  // e.g., "Normal Tempo"
    
    psychometricMappings: PsychometricMapping[];
    implementation: ImplementationDetails;
    theory: TheoryDocumentation;
    
    adjustable: boolean;
    defaultValue?: number | string;
    range?: { min: number; max: number; step?: number };
}
```

---

### 1.4 PsychometricScoreFrame

A single frame of the musical score output.

```typescript
interface PsychometricScoreFrame {
    frameIndex: number;
    timestamp: number;
    speaker: string | null;
    
    global: {
        tempo: number;
        timeSignature: string;
        key: string;
        dynamics: string;
        tension: number;
    };
    
    staves: ActorStaveData[];
    
    harmony: {
        chord: string;
        neoRiemannian: string;
    };
    
    environment: {
        type: string;
        instrument: string;
        mood: string;
    };
}
```

---

## 2. Enumerations

### 2.1 MPNCategory

```typescript
enum MPNCategory {
    TIMBRE = 'timbre',
    RHYTHM = 'rhythm',
    HARMONY = 'harmony',
    DYNAMICS = 'dynamics',
    MELODY = 'melody',
    TEXTURE = 'texture',
    MODE = 'mode',
    INTERVALS = 'intervals',
    ARTICULATION = 'articulation',
    SILENCE = 'silence'
}
```

### 2.2 PsychometricDimension

```typescript
enum PsychometricDimension {
    DISC = 'disc',
    BIG_FIVE = 'bigFive',
    DARK_TRIAD = 'darkTriad',
    LACANIAN = 'lacanian',
    COGNITIVE_BIAS = 'cognitiveBias',
    EMOTION = 'emotion',
    TRAUMA = 'trauma',
    ENTROPY = 'entropy',
    RELATIONSHIP = 'relationship',
    STABILITY = 'stability'
}
```

---

## 3. API Endpoints

### 3.1 MPNPresetAPI

```typescript
const MPNPresetAPI = {
    // Get all saved presets
    getPresets(): MPNPreset[];
    
    // Save a new preset
    savePreset(name: string, adjustments: Record<string, any>): void;
    
    // Delete a preset
    deletePreset(name: string): void;
    
    // Get active adjustments (current session)
    getActiveAdjustments(): Record<string, ParameterAdjustment>;
    
    // Save active adjustments (auto-save on dial change)
    saveActiveAdjustments(adjustments: Record<string, any>): void;
};
```

---

### 3.2 Lookup Functions

```typescript
// Get tempo range for stability level
function lookupTempoRange(
    stability: 'strategic' | 'operational' | 'crisis',
    adjustments?: Record<string, ParameterAdjustment>
): { min: number; max: number };

// Get dynamics for trauma level
function lookupDynamics(
    trauma: number,
    adjustments?: Record<string, ParameterAdjustment>
): { velocity: number; label: string };

// Get time signature for entropy level
function lookupTimeSignature(entropy: number): string;

// Get mode for Lacanian register
function lookupMode(
    dominantRegister: 'real' | 'symbolic' | 'imaginary'
): string;

// Get all parameters at once
function lookupAllParams(
    trauma: number,
    entropy: number,
    dominantRegister: 'real' | 'symbolic' | 'imaginary',
    stability?: 'strategic' | 'operational' | 'crisis',
    adjustments?: Record<string, ParameterAdjustment>
): ReferenceBasedParams;
```

---

## 4. LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `oxot_mpn_presets` | `MPNPreset[]` | Saved user presets |
| `oxot_mpn_active_adjustments` | `Record<string, any>` | Current session adjustments |

---

## 5. MIDI Specifications

### 5.1 Velocity Ranges

| Dynamic | Min | Max |
|---------|-----|-----|
| ppp | 1 | 20 |
| pp | 21 | 40 |
| p | 41 | 55 |
| mp | 56 | 70 |
| mf | 71 | 85 |
| f | 86 | 100 |
| ff | 101 | 115 |
| fff | 116 | 127 |

### 5.2 Program Numbers (GM)

| Instrument Family | Range | Example |
|-------------------|-------|---------|
| Piano | 0-7 | 0 = Acoustic Grand |
| Strings | 40-51 | 40 = Violin |
| Brass | 56-63 | 56 = Trumpet |
| Woodwinds | 72-79 | 72 = Flute |

---

## 6. Configuration Defaults

```typescript
const DEFAULT_CONFIG = {
    tempo: {
        strategic: { min: 40, max: 60 },
        operational: { min: 80, max: 100 },
        crisis: { min: 120, max: 180 }
    },
    dynamics: {
        ppp: 20,
        pp: 35,
        p: 50,
        mp: 62,
        mf: 72,
        f: 90,
        ff: 105,
        fff: 118
    },
    detuning: {
        machiavellian: -10,  // cents
        narcissistic: +5     // cents
    }
};
```

---

## Next: [17_ACADEMIC_REFERENCES](./17_ACADEMIC_REFERENCES.md)
