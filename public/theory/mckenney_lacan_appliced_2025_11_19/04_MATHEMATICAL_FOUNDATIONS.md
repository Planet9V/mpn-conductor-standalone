# 04. Mathematical Foundations
## Core Equations and Calculations

---

## Overview

This document specifies all mathematical transformations used in the
McKenney-Lacan Applied Theory MPN system.

---

## 1. Core Transformation Functions

### 1.1 Trauma to Dynamics

Converts trauma level (0-1) to MIDI velocity (0-127).

```typescript
function traumaToDynamics(trauma: number): { velocity: number; label: string } {
    // Lookup thresholds from reference dictionary
    if (trauma < 0.2) return { velocity: 30, label: 'pp' };
    if (trauma < 0.4) return { velocity: 50, label: 'mp' };
    if (trauma < 0.6) return { velocity: 72, label: 'mf' };
    if (trauma < 0.8) return { velocity: 95, label: 'f' };
    return { velocity: 118, label: 'fff' };
}
```

**Formula**:
```
velocity = velocityRange.min + ((velocityRange.max - velocityRange.min) × trauma)
```

---

### 1.2 Entropy to Rhythm

Converts entropy (0-1) to tempo and time signature.

```typescript
function entropyToRhythm(entropy: number): { tempo: number; timeSignature: string } {
    // Determine stability band
    let stability: 'strategic' | 'operational' | 'crisis' = 'strategic';
    if (entropy > 0.4) stability = 'operational';
    if (entropy > 0.7) stability = 'crisis';

    // Get tempo range from reference
    const range = lookupTempoRange(stability);
    
    // Calculate tempo within range
    const tempo = range.min + (entropy × (range.max - range.min));
    
    // Determine time signature
    const timeSignature = lookupTimeSignature(entropy);
    
    return { tempo: Math.round(tempo), timeSignature };
}
```

**Tempo Bands**:

| Stability | Entropy Range | Tempo (BPM) |
|-----------|---------------|-------------|
| Strategic | 0.0 - 0.4 | 40 - 60 |
| Operational | 0.4 - 0.7 | 80 - 100 |
| Crisis | 0.7 - 1.0 | 120 - 180 |

---

### 1.3 RSI to Mode

Maps Lacanian register dominance to musical mode.

```typescript
function rsiToMode(rsi: RSIProfile): string {
    const dominant = getDominantRegister(rsi);
    
    switch (dominant) {
        case 'symbolic': return 'Ionian';    // Major
        case 'imaginary': return 'Lydian';   // Bright
        case 'real': return 'Phrygian';      // Dark
        default: return 'Dorian';            // Neutral
    }
}

function getDominantRegister(rsi: RSIProfile): string {
    if (rsi.real > rsi.symbolic && rsi.real > rsi.imaginary) return 'real';
    if (rsi.symbolic > rsi.imaginary) return 'symbolic';
    return 'imaginary';
}
```

---

### 1.4 DISC to Instrument

Maps DISC profile to instrument family.

```typescript
function discToInstrument(disc: DISCProfile): string {
    const dominant = getDominantDISC(disc);
    
    switch (dominant) {
        case 'D': return 'Brass';
        case 'I': return 'Woodwind';
        case 'S': return 'Strings';
        case 'C': return 'Keyboard';
        default: return 'Strings';
    }
}
```

---

## 2. Stability Calculations

### 2.1 Lyapunov Exponent

Measures system stability/chaos tendency.

```typescript
function calculateLyapunov(trauma: number, entropy: number): number {
    return (trauma + entropy - 0.5) × 0.5;
}
```

**Interpretation**:

| λ Value | State | Description |
|---------|-------|-------------|
| λ < 0 | Stable | System converges |
| 0 ≤ λ < 0.1 | Edge | Critical boundary |
| λ ≥ 0.1 | Chaotic | System diverges |

---

### 2.2 Borromean Stability

Measures interlocking of RSI registers (Lacanian).

```typescript
function borromeanStability(rsi: RSIProfile): number {
    const min = Math.min(rsi.real, rsi.symbolic, rsi.imaginary);
    const max = Math.max(rsi.real, rsi.symbolic, rsi.imaginary);
    return min / max;  // 0-1, higher = more stable
}
```

---

## 3. Relationship Calculations

### 3.1 Interval Selection

Maps relationship quality to harmonic interval.

```typescript
function relationshipToInterval(
    relationship: number  // -1 to +1
): string {
    if (relationship > 0.7) return 'P5';      // Perfect 5th
    if (relationship > 0.3) return 'M3';      // Major 3rd
    if (relationship > -0.3) return 'unison'; // Neutral
    if (relationship > -0.7) return 'm2';     // Minor 2nd
    return 'tritone';                          // Maximum conflict
}
```

---

### 3.2 Tension to Chord Type

Maps tension level to harmonic vocabulary.

```typescript
function tensionToChordType(tension: number): string {
    if (tension < 0.2) return 'major';
    if (tension < 0.4) return 'major7';
    if (tension < 0.6) return 'minor7';
    if (tension < 0.8) return 'dominant7';
    return 'diminished';
}
```

---

## 4. Neo-Riemannian Operations

### 4.1 Parallel (P)

Modal change keeping root.

```
C Major → C minor (lower 3rd by semitone)
```

**Psychological Mapping**: Real register intrusion (trauma)

---

### 4.2 Relative (R)

Move to relative key.

```
C Major → A minor (down minor 3rd)
```

**Psychological Mapping**: Symbolic order maintained

---

### 4.3 Leading-tone (L)

Move by leading-tone exchange.

```
C Major → E minor (up major 3rd)
```

**Psychological Mapping**: Imaginary register shift

---

### 4.4 Compound Operations

| Operation | Path | Key Change | Crisis Level |
|-----------|------|------------|--------------|
| PL | P+L | C → C♯m | Medium |
| PR | P+R | C → A | Low-Medium |
| RP | R+P | C → A♭ | Medium |
| PLP | P+L+P | C → D♭ | Maximum (Seldon) |

---

## 5. Leitmotif Transformations

### 5.1 Inversion

All intervals mirrored around pivot.

```typescript
function invertMotif(notes: number[], pivot: number): number[] {
    return notes.map(n => pivot - (n - pivot));
}
```

**Example**: [C4, E4, G4] around E4 → [G4, E4, C4]

---

### 5.2 Retrograde

Notes played in reverse order.

```typescript
function retrogradeMotif(notes: number[]): number[] {
    return [...notes].reverse();
}
```

---

### 5.3 Fragmentation

Random notes omitted based on entropy.

```typescript
function fragmentMotif(notes: number[], entropy: number): number[] {
    return notes.filter(() => Math.random() > entropy × 0.5);
}
```

---

### 5.4 Augmentation/Diminution

Time stretching/compression.

```typescript
function augmentMotif(durations: number[], factor: number): number[] {
    return durations.map(d => d × factor);
}
```

---

## 6. ADSR Envelopes

### 6.1 Standard Envelopes by Trait

| Trait | Attack | Decay | Sustain | Release |
|-------|--------|-------|---------|---------|
| Normal | 0.1 | 0.2 | 0.7 | 0.3 |
| Machiavellian | 0.3 | 0.2 | 0.8 | 0.5 |
| Narcissistic | 0.0 | 0.1 | 1.0 | 0.0 |
| Psychopathic | 0.0 | 0.5 | 0.0 | 0.1 |

---

## 7. Complete Psychometric Calculus

### Full Transformation Pipeline

```typescript
function psychometricToMusical(state: PsychometricState): MusicalParams {
    const dynamics = traumaToDynamics(state.trauma);
    const rhythm = entropyToRhythm(state.entropy);
    const mode = rsiToMode(state.rsi);
    const instrument = discToInstrument(state.disc);
    const tension = calculateTension(state);
    const chordType = tensionToChordType(tension);
    
    return {
        tempo: rhythm.tempo,
        timeSignature: rhythm.timeSignature,
        key: `${getRoot(state)} ${mode}`,
        dynamics: dynamics.label,
        velocity: dynamics.velocity,
        instrument: instrument,
        chordType: chordType,
        articulation: getArticulation(state.disc)
    };
}
```

---

## 8. Constants and Reference Values

### 8.1 MIDI Ranges

| Parameter | Min | Max |
|-----------|-----|-----|
| Velocity | 0 | 127 |
| Note | 0 | 127 |
| Controller | 0 | 127 |

### 8.2 Frequency Ranges

| Register | Min Hz | Max Hz |
|----------|--------|--------|
| Sub-bass | 16 | 60 |
| Bass | 60 | 250 |
| Low-mid | 250 | 500 |
| Mid | 500 | 2000 |
| High-mid | 2000 | 4000 |
| High | 4000 | 8000 |

### 8.3 Tempo Ranges

| Category | Min BPM | Max BPM |
|----------|---------|---------|
| Largo | 40 | 60 |
| Adagio | 60 | 80 |
| Andante | 80 | 100 |
| Moderato | 100 | 120 |
| Allegro | 120 | 160 |
| Presto | 160 | 200 |

---

## Next: [05_REFERENCE_TIMBRE](./05_REFERENCE_TIMBRE.md)
