# 02. Psychometric Dimensions
## Complete Reference of Psychometric State Variables

---

## Overview

The MPN system maps 10 psychometric dimensions to musical parameters.
Each dimension captures a distinct aspect of human psychology.

---

## 1. DISC Profile

### Definition
William Marston's behavioral assessment model measuring observable behavior.

### Dimensions

| Factor | Full Name | Range | Description |
|--------|-----------|-------|-------------|
| D | Dominance | 0.0-1.0 | Task-oriented, results-driven |
| I | Influence | 0.0-1.0 | People-oriented, enthusiastic |
| S | Steadiness | 0.0-1.0 | Patient, team-oriented |
| C | Compliance | 0.0-1.0 | Quality-focused, analytical |

### Musical Mappings

| DISC Factor | Instrument Family | Articulation |
|-------------|------------------|--------------|
| D (high) | Brass (trumpet, trombone) | Staccato, marcato |
| I (high) | Woodwinds (flute, clarinet) | Legato, expressive |
| S (high) | Strings (violin, cello) | Sustained, tenuto |
| C (high) | Keyboard (piano, harp) | Precise, measured |

### Implementation

```typescript
interface DISCProfile {
    D: number;  // 0.0 - 1.0
    I: number;  // 0.0 - 1.0
    S: number;  // 0.0 - 1.0
    C: number;  // 0.0 - 1.0
}
```

**Academic Reference**: 
Marston, W.M. (1928). *Emotions of Normal People*. Kegan Paul.

---

## 2. Big Five (OCEAN)

### Definition
The Five Factor Model of personality traits.

### Dimensions

| Factor | Full Name | High Score | Low Score |
|--------|-----------|------------|-----------|
| O | Openness | Curious, creative | Practical, conventional |
| C | Conscientiousness | Organized, dependable | Spontaneous, flexible |
| E | Extraversion | Outgoing, energetic | Reserved, solitary |
| A | Agreeableness | Trusting, helpful | Skeptical, competitive |
| N | Neuroticism | Sensitive, nervous | Secure, confident |

### Musical Mappings

| Factor | High Score Expression | Low Score Expression |
|--------|---------------------|---------------------|
| O | Complex harmonies, chromaticism | Simple triads, diatonic |
| C | Regular rhythm, strict tempo | Rubato, syncopation |
| E | Loud dynamics (ff) | Soft dynamics (pp) |
| A | Consonance, legato | Dissonance, staccato |
| N | Tempo fluctuation, tremolo | Stable tempo, steady |

### Implementation

```typescript
interface OCEANProfile {
    O: number;  // Openness
    C: number;  // Conscientiousness
    E: number;  // Extraversion
    A: number;  // Agreeableness
    N: number;  // Neuroticism
}
```

**Academic Reference**: 
Costa, P.T., & McCrae, R.R. (1992). NEO-PI-R Professional Manual. PAR.

---

## 3. Dark Triad

### Definition
Three subclinical personality traits with distinct behavioral patterns.

### Dimensions

| Trait | Description | Range |
|-------|-------------|-------|
| Narcissism | Grandiosity, need for admiration | 0.0-1.0 |
| Machiavellianism | Manipulation, strategic deception | 0.0-1.0 |
| Psychopathy | Callousness, impulsivity | 0.0-1.0 |

### Musical Mappings (when > 0.5)

| Trait | Musical Expression |
|-------|-------------------|
| **Narcissism** | Loud (ignores ensemble), sharp tuning (+5 cents) |
| **Machiavellianism** | Muted, flat tuning (-10 cents), hidden motifs |
| **Psychopathy** | No vibrato, mechanical, cold timbre |

### Implementation

```typescript
interface DarkTriadProfile {
    narcissism: number;        // 0.0 - 1.0
    machiavellianism: number;  // 0.0 - 1.0
    psychopathy: number;       // 0.0 - 1.0
}
```

**Academic Reference**: 
Paulhus, D.L., & Williams, K.M. (2002). The Dark Triad of personality.
*Journal of Research in Personality*, 36(6), 556-563.

---

## 4. Lacanian Registers (RSI)

### Definition
Jacques Lacan's three registers of human experience.

### Dimensions

| Register | Description | Psychological Content |
|----------|-------------|----------------------|
| Real | Unsymbolizable | Trauma, death, void |
| Symbolic | Language, law | Rules, order, meaning |
| Imaginary | Ego, image | Self-perception, fantasy |

### Musical Mappings

| Register | Mode/Scale | Chord Type | Transformation |
|----------|-----------|------------|----------------|
| Real | Phrygian, Locrian | Diminished, tritone | P (Parallel) |
| Symbolic | Ionian (Major) | Major 7th | R (Relative) |
| Imaginary | Lydian, Whole-tone | Augmented | L (Leading-tone) |

### Implementation

```typescript
interface RSIProfile {
    real: number;       // 0.0 - 1.0
    symbolic: number;   // 0.0 - 1.0
    imaginary: number;  // 0.0 - 1.0
}
```

**Academic Reference**: 
Lacan, J. (1977). *Écrits: A Selection*. W.W. Norton.

---

## 5. Trauma

### Definition
Continuous measure of psychological trauma activation.

### Range
- **Minimum**: 0.0 (no trauma activation)
- **Maximum**: 1.0 (severe trauma activation)

### Musical Mappings

| Trauma Level | Dynamics | Leitmotif State | Mode |
|--------------|----------|-----------------|------|
| 0.0 - 0.2 | ppp (very soft) | Original | Major |
| 0.2 - 0.4 | mp (medium soft) | Original | Major/minor |
| 0.4 - 0.6 | mf (medium) | Varied | Minor |
| 0.6 - 0.8 | f (loud) | Inverted | Phrygian |
| 0.8 - 1.0 | fff (very loud) | Fragmented | Locrian |

### Velocity Calculation

```
velocity = 20 + (trauma × 107)
```

Produces MIDI velocity range: 20 (ppp) to 127 (fff)

---

## 6. Entropy

### Definition
Shannon entropy measure of system unpredictability.

### Range
- **Minimum**: 0.0 (completely predictable)
- **Maximum**: 1.0 (maximum uncertainty)

### Musical Mappings

| Entropy Level | Time Signature | Tempo Character |
|---------------|---------------|-----------------|
| 0.0 - 0.3 | 4/4 (common time) | Stable, predictable |
| 0.3 - 0.5 | 3/4 (waltz time) | Slight irregularity |
| 0.5 - 0.7 | 5/4, 7/8 (odd meter) | Unsettled |
| 0.7 - 0.85 | Compound meters | Anxious |
| 0.85 - 1.0 | Free/aleatoric | Chaotic |

### Tempo Calculation

```
tempo = base_tempo + (entropy × tempo_variance)
```

Example: base=80, variance=100 → Range: 80-180 BPM

---

## 7. Stability

### Definition
Overall system stability derived from multiple factors.

### Calculation

```
stability = 1.0 - (lyapunov_exponent + 0.5) / 1.5
```

### Levels

| Stability | Description | Tempo Range |
|-----------|-------------|-------------|
| Strategic | Long-term thinking | 40-60 BPM |
| Operational | Normal operations | 80-100 BPM |
| Crisis | Immediate response | 120-180 BPM |

---

## 8. Relationship

### Definition
Inter-actor relationship quality and dynamics.

### Range
- **-1.0**: Complete conflict
- **0.0**: Neutral
- **+1.0**: Complete harmony

### Musical Mappings

| Relationship | Interval | Texture |
|--------------|----------|---------|
| Allied (+0.7 to +1.0) | Perfect 5th, octave | Homophonic |
| Cooperative (+0.3 to +0.7) | Major 3rd, 6th | Parallel motion |
| Neutral (-0.3 to +0.3) | Unison, shifting | Heterophonic |
| Tense (-0.7 to -0.3) | Minor 2nd, 7th | Counterpoint |
| Hostile (-1.0 to -0.7) | Tritone | Polyphonic conflict |

---

## 9. Emotion

### Definition
Primary emotional state affecting musical expression.

### Categories

| Emotion | Musical Expression |
|---------|-------------------|
| Joy | Major mode, ascending contour |
| Sadness | Minor mode, descending contour |
| Anger | Fast tempo, loud, staccato |
| Fear | Diminished chords, tremolo |
| Anticipation | Dominant 7th, accelerando |
| Surprise | Sudden dynamics, sforzando |

---

## 10. Cognitive Bias

### Definition
Active cognitive biases affecting perception and behavior.

### Common Biases and Mappings

| Bias | Musical Expression |
|------|-------------------|
| Confirmation | Ostinato (repetition) |
| Anchoring | Drone (fixed note) |
| Availability | Accent on recent notes |
| Sunk Cost | Sustained pedal tone |
| Groupthink | Unison, homophony |

### Implementation

```typescript
interface CognitiveBiasConfig {
    activeBiases: string[];
    biasStrengths: Record<string, number>;
}
```

**Academic Reference**: 
Kahneman, D. (2011). *Thinking, Fast and Slow*. FSG.

---

## Next: [03_MUSICAL_ELEMENTS](./03_MUSICAL_ELEMENTS.md)
