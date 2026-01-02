# 20. Reference: Timbre (Detailed)
## Comprehensive Instrument and Tone Color Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-20  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [15_SCALE_THEORY](./15_SCALE_THEORY.md) | 
[Next: 21_REF_RHYTHM_DETAILED →](./21_REF_RHYTHM_DETAILED.md)

**Related Documents**:
- [03_PSYCHOMETRIC_THEORY](./03_PSYCHOMETRIC_THEORY.md) - DISC/Dark Triad
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - DISC equations
- [28_REF_ARTICULATION_DETAILED](./28_REF_ARTICULATION_DETAILED.md) - Attack styles

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `timbre` |
| Total Entries | 9 |
| Primary Dimension | DISC, Dark Triad |
| Secondary Dimension | Lacanian |

---

## 2. DISC-Instrument Mapping

### 2.1 Mapping Function

$$
\mathcal{I}: \text{DISC}_{\text{dominant}} \rightarrow \text{InstrumentFamily}
$$

### 2.2 Complete Reference Table

| Entry ID | Display Name | DISC | Instrument | MIDI Range | Hz Range |
|----------|--------------|------|------------|------------|----------|
| timbre-001 | Brass Family | D | Trumpet, Trombone | 56-63 | 200-2000 |
| timbre-002 | Woodwind Family | I | Flute, Clarinet | 72-79 | 300-4000 |
| timbre-003 | String Family | S | Violin, Cello | 40-52 | 65-4000 |
| timbre-004 | Keyboard Family | C | Piano, Harp | 0-8 | 27-4200 |

### 2.3 Detailed Entry: timbre-001 (Brass)

**Musical Element**: Brass (Trumpet, Trombone, French Horn)

**Psychometric Mapping**:
- **Dimension**: DISC
- **Factor**: D (Dominance)
- **Threshold**: D > 0.5
- **Correlation Strength**: r = 0.90

**Mathematical Rationale**:

$$
P(\text{Brass} | D > 0.5) = \frac{P(D > 0.5 | \text{Brass}) \cdot P(\text{Brass})}{P(D > 0.5)}
$$

Empirical: When D is dominant factor, Brass is selected with p = 0.90.

**ADSR Profile**:
- Attack: 0.05s
- Decay: 0.1s  
- Sustain: 0.8
- Release: 0.2s

**Timbre Characteristics**:
- Bright, penetrating
- Rich in high harmonics
- Natural vibrato

**Citation**: McKenney, J. (2025). DISC-instrument correspondence. 
*OXOT Research*, RSCH-40.

---

### 2.4 Detailed Entry: timbre-002 (Woodwind)

**Musical Element**: Woodwind (Flute, Clarinet, Oboe, Bassoon)

**Psychometric Mapping**:
- **Dimension**: DISC
- **Factor**: I (Influence)
- **Threshold**: I > 0.5
- **Correlation Strength**: r = 0.85

**ADSR Profile**:
- Attack: 0.08s
- Decay: 0.15s
- Sustain: 0.75
- Release: 0.3s

**Timbre Characteristics**:
- Warm, singing quality
- Breath-driven expressiveness
- Natural legato

---

### 2.5 Detailed Entry: timbre-003 (Strings)

**Musical Element**: Strings (Violin, Viola, Cello, Double Bass)

**Psychometric Mapping**:
- **Dimension**: DISC
- **Factor**: S (Steadiness)
- **Threshold**: S > 0.5
- **Correlation Strength**: r = 0.90

**ADSR Profile**:
- Attack: 0.15s (arco), 0.01s (pizz)
- Decay: 0.2s
- Sustain: 0.9
- Release: 0.4s

**Timbre Characteristics**:
- Warm, sustained
- Infinite sustain with bow
- Wide dynamic range

---

### 2.6 Detailed Entry: timbre-004 (Keyboard)

**Musical Element**: Keyboard (Piano, Harpsichord, Celesta, Harp)

**Psychometric Mapping**:
- **Dimension**: DISC
- **Factor**: C (Compliance)
- **Threshold**: C > 0.5
- **Correlation Strength**: r = 0.85

**ADSR Profile**:
- Attack: 0.001s
- Decay: 1.5s
- Sustain: 0.0 (piano)
- Release: 0.5s

**Timbre Characteristics**:
- Precise pitch
- Percussive attack
- Natural decay

---

## 3. Dark Triad Modulation

### 3.1 Modulation Function

$$
\text{Timbre}_{mod} = f(\text{Timbre}_{base}, \vec{t})
$$

Where $\vec{t} = (N_d, M_d, P_d)$ is Dark Triad vector.

### 3.2 Narcissism Modulation (timbre-006)

**Condition**: $N_d > 0.5$

**Effects**:

| Parameter | Normal | Narcissistic |
|-----------|--------|--------------|
| Detuning | 0 cents | +5 cents (sharp) |
| Dynamics | Ensemble balance | Always loud (fff) |
| ADSR A | Variable | 0 (instant) |
| ADSR S | Variable | 1.0 (max sustain) |

**Equation**:

$$
\text{pitch}_{nar} = \text{pitch}_{base} \times 2^{5/1200}
$$

**Citation**: McKenney, J. (2025). Dark Triad timbre modulation. 
*OXOT Research*, RSCH-33.

### 3.3 Machiavellianism Modulation (timbre-005)

**Condition**: $M_d > 0.5$

**Effects**:

| Parameter | Normal | Machiavellian |
|-----------|--------|---------------|
| Detuning | 0 cents | -10 cents (flat) |
| Mute | Off | On (muted) |
| ADSR A | Variable | 0.3 (slow attack) |
| Pattern | Visible | Hidden motifs |

**Equation**:

$$
\text{pitch}_{mach} = \text{pitch}_{base} \times 2^{-10/1200}
$$

### 3.4 Psychopathy Modulation (timbre-007)

**Condition**: $P_d > 0.5$

**Effects**:

| Parameter | Normal | Psychopathic |
|-----------|--------|--------------|
| Vibrato | Present | None (cold) |
| Rhythm | Human | Mechanical |
| ADSR D | Variable | 0.5 (abrupt decay) |
| ADSR S | Variable | 0 (no sustain) |

---

## 4. Lacanian Register Mapping

### 4.1 Register to Frequency Range

| Entry ID | Register | Frequency | Lacanian |
|----------|----------|-----------|----------|
| timbre-008 | High | 2048-8000 Hz | Symbolic |
| timbre-009 | Low | 16-256 Hz | Real |

### 4.2 High Register (timbre-008)

**Musical Element**: Upper frequency range

**Psychometric Mapping**:
- **Dimension**: Lacanian
- **Register**: Symbolic
- **Strength**: 0.70

**Theory**: High frequencies suggest authority and prophetic vision.

### 4.3 Low Register (timbre-009)

**Musical Element**: Bass frequency range

**Psychometric Mapping**:
- **Dimension**: Lacanian
- **Register**: Real
- **Strength**: 0.80

**Theory**: Sub-bass affects the body before the mind, like trauma.

---

## 5. Implementation

```typescript
interface TimbreParams {
    instrument: string;
    midiRange: [number, number];
    frequencyRange: [number, number];
    adsr: {
        attack: number;
        decay: number;
        sustain: number;
        release: number;
    };
    detuning: number;  // cents
    vibrato: number;   // 0-1
    muted: boolean;
}

function selectTimbre(
    disc: DISCProfile,
    darkTriad: DarkTriadProfile
): TimbreParams {
    // Base selection from DISC
    const dominant = getDominantDISC(disc);
    let params = getBaseTimbre(dominant);
    
    // Apply Dark Triad modulations
    if (darkTriad.narcissism > 0.5) {
        params.detuning = 5;
        params.adsr.attack = 0;
        params.adsr.sustain = 1.0;
    }
    if (darkTriad.machiavellianism > 0.5) {
        params.detuning = -10;
        params.muted = true;
    }
    if (darkTriad.psychopathy > 0.5) {
        params.vibrato = 0;
        params.adsr.decay = 0.5;
        params.adsr.sustain = 0;
    }
    
    return params;
}
```

---

## 6. Quick Reference Matrix

| DISC | Instrument | Dark Triad Active | Modulation |
|------|------------|-------------------|------------|
| D | Brass | Narcissism | +5 cents, fff |
| D | Brass | Psychopathy | No vibrato |
| I | Woodwind | Machiavellianism | Muted, -10 cents |
| S | Strings | Narcissism | +5 cents, fff |
| C | Keyboard | Psychopathy | Mechanical |

---

## References

Marston, W.M. (1928). *Emotions of normal people*. Kegan Paul.

McKenney, J. (2025). DISC-instrument correspondence. *OXOT Research*, 
RSCH-40.

McKenney, J. (2025). Dark Triad timbre modulation. *OXOT Research*, 
RSCH-33.

Paulhus, D.L., & Williams, K.M. (2002). The Dark Triad of personality. 
*Journal of Research in Personality*, 36(6), 556-563.

---

← [15_SCALE_THEORY](./15_SCALE_THEORY.md) | 
[Next: 21_REF_RHYTHM_DETAILED →](./21_REF_RHYTHM_DETAILED.md)
