# 42. API Specification
## Function Signatures and Interfaces

**Author**: McKenney, J.  
**Document ID**: MPN-DOC-42  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [41_DATA_ARCHITECTURE](./41_DATA_ARCHITECTURE.md) | 
[Next: 43_DEPLOYMENT_GUIDE →](./43_DEPLOYMENT_GUIDE.md)

**Related Documents**:
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - Mathematical formulas
- [40_SYSTEM_ARCHITECTURE](./40_SYSTEM_ARCHITECTURE.md) - System design

---

## 1. Core Interfaces

### 1.1 PsychometricState

```typescript
interface PsychometricState {
    trauma: number;           // τ ∈ [0, 1]
    entropy: number;          // H ∈ [0, 1]
    arrhythmia: number;       // [0, 1]
    
    rsi: RSIProfile;
    disc: DISCProfile;
    ocean: OCEANProfile;
    darkTriad: DarkTriadProfile;
    
    timestamp: number;
    source: 'agent' | 'script' | 'user';
}

interface RSIProfile {
    real: number;       // r ∈ [0, 1]
    symbolic: number;   // s ∈ [0, 1]
    imaginary: number;  // i ∈ [0, 1]
}

interface DISCProfile {
    D: number;  // Dominance
    I: number;  // Influence
    S: number;  // Steadiness
    C: number;  // Compliance
}

interface OCEANProfile {
    O: number;  // Openness
    C: number;  // Conscientiousness
    E: number;  // Extraversion
    A: number;  // Agreeableness
    N: number;  // Neuroticism
}

interface DarkTriadProfile {
    narcissism: number;
    machiavellianism: number;
    psychopathy: number;
}
```

### 1.2 MusicalParams

```typescript
interface MusicalParams {
    tempo: number;              // BPM [40-200]
    timeSignature: string;      // "4/4", "5/4", etc.
    stability: 'strategic' | 'operational' | 'crisis';
    
    dynamics: string;           // "mf", "ff", etc.
    velocity: number;           // MIDI [0-127]
    
    key: string;                // "C Ionian"
    mode: string;               // "Ionian", "Phrygian"
    neoRiemannian: 'P' | 'R' | 'L';
    
    instrument: string;         // "Brass", "Strings"
    articulation: string;       // "legato", "staccato"
    
    lyapunov: number;
    bsi: number;
    seldonCrisis: boolean;
}
```

---

## 2. Core Functions

### 2.1 psychometricToMusical

```typescript
function psychometricToMusical(
    state: PsychometricState,
    adjustments?: Record<string, ParameterAdjustment>
): MusicalParams;
```

**Description**: Master transformation function.

**Parameters**:
- `state`: Complete psychometric state vector
- `adjustments`: Optional user overrides

**Returns**: Complete musical parameters

**Reference**: [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md)

### 2.2 traumaToDynamics

```typescript
function traumaToDynamics(
    trauma: number,
    adjustments?: Record<string, ParameterAdjustment>
): { velocity: number; label: string };
```

**Formula**: $v = 20 + 107\tau$

### 2.3 entropyToRhythm

```typescript
function entropyToRhythm(
    entropy: number,
    adjustments?: Record<string, ParameterAdjustment>
): { tempo: number; timeSignature: string };
```

**Reference**: [11_ENTROPY_CALCULUS](./11_ENTROPY_CALCULUS.md)

---

## 3. Lookup Functions

### 3.1 lookupTempoRange

```typescript
function lookupTempoRange(
    stability: 'strategic' | 'operational' | 'crisis',
    adjustments?: Record<string, ParameterAdjustment>
): { min: number; max: number };
```

### 3.2 lookupDynamics

```typescript
function lookupDynamics(
    trauma: number,
    adjustments?: Record<string, ParameterAdjustment>
): { velocity: number; label: string };
```

### 3.3 lookupMode

```typescript
function lookupMode(
    dominantRegister: 'real' | 'symbolic' | 'imaginary'
): string;
```

---

## 4. Preset API

```typescript
const MPNPresetAPI = {
    getPresets(): MPNPreset[];
    savePreset(name: string, adj: Record<string, any>): void;
    deletePreset(name: string): void;
    getActiveAdjustments(): Record<string, ParameterAdjustment>;
    saveActiveAdjustments(adj: Record<string, any>): void;
};
```

---

## 5. LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `oxot_mpn_presets` | `MPNPreset[]` | Saved presets |
| `oxot_mpn_active_adjustments` | `Record` | Current adjustments |

---

## References

McKenney, J. (2025). MPN API specification. *OXOT Research*, RSCH-39.

---

← [41_DATA_ARCHITECTURE](./41_DATA_ARCHITECTURE.md) | 
[Next: 43_DEPLOYMENT_GUIDE →](./43_DEPLOYMENT_GUIDE.md)
