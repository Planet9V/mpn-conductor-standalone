# 03. Psychometric Theory
## DISC, OCEAN, and Dark Triad Frameworks

**Author**: McKenney, J.  
**Document ID**: MPN-DOC-03  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [02_BORROMEAN_TOPOLOGY](./02_BORROMEAN_TOPOLOGY.md) | 
[Next: 04_MUSICAL_SEMIOTICS →](./04_MUSICAL_SEMIOTICS.md)

**Related Documents**:
- [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md) - DISC→Instrument
- [28_REF_ARTICULATION_DETAILED](./28_REF_ARTICULATION_DETAILED.md) - DISC→Style
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - Mathematical transforms

---

## 1. DISC Theory

### 1.1 Historical Background

William Moulton Marston developed DISC theory in 1928, identifying 
four primary behavioral dimensions based on perceived environmental 
power and responsiveness.

**Citation**: Marston, W.M. (1928). *Emotions of normal people*. 
Kegan Paul, Trench, Trübner & Co.

### 1.2 The Four Factors

#### Dominance (D)

**Definition**: Task-oriented drive for results and control.

$$
D = f(\text{assertiveness}, \text{competitiveness}, \text{decisiveness})
$$

**Musical Expression**:

| D Level | Instrument | Articulation | Dynamics |
|---------|------------|--------------|----------|
| High (>0.7) | Brass (trumpet) | Staccato, marcato | f-fff |
| Medium (0.4-0.7) | Mixed | Accented | mf |
| Low (<0.4) | Soft ensemble | Legato | p-mp |

**Reference**: [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md)

#### Influence (I)

**Definition**: People-oriented enthusiasm and expressiveness.

$$
I = f(\text{enthusiasm}, \text{optimism}, \text{collaboration})
$$

**Musical Expression**:

| I Level | Instrument | Character | Register |
|---------|------------|-----------|----------|
| High | Woodwind (flute, clarinet) | Soaring, lyrical | High |
| Medium | Mixed | Moderate expression | Middle |
| Low | Muted | Reserved | Mid-low |

#### Steadiness (S)

**Definition**: Patient, supportive, team-oriented stability.

$$
S = f(\text{patience}, \text{persistence}, \text{reliability})
$$

**Musical Expression**:

| S Level | Instrument | Texture | Duration |
|---------|------------|---------|----------|
| High | Strings (violin, cello) | Sustained | Long tones |
| Medium | Mixed ensemble | Balanced | Moderate |
| Low | Rhythmic | Punctuated | Short |

#### Compliance (C)

**Definition**: Analytical, quality-focused, systematic behavior.

$$
C = f(\text{accuracy}, \text{analysis}, \text{diplomacy})
$$

**Musical Expression**:

| C Level | Instrument | Rhythm | Pattern |
|---------|------------|--------|---------|
| High | Keyboard (piano) | Precise, measured | Structured |
| Medium | Mixed | Semi-regular | Varied |
| Low | Free | Irregular | Spontaneous |

### 1.3 DISC Vector Notation

$$
\vec{d} = \begin{pmatrix} D \\ I \\ S \\ C \end{pmatrix} \in [0,1]^4
$$

**Dominant factor**:

$$
D_{dom}(\vec{d}) = \arg\max\{D, I, S, C\}
$$

---

## 2. Big Five (OCEAN) Model

### 2.1 Overview

The Five Factor Model identifies five core personality dimensions.

**Citation**: Costa, P.T., & McCrae, R.R. (1992). *NEO-PI-R professional 
manual*. Psychological Assessment Resources.

### 2.2 Factor Definitions

| Factor | Full Name | High | Low |
|--------|-----------|------|-----|
| O | Openness | Creative, curious | Conventional |
| C | Conscientiousness | Organized | Impulsive |
| E | Extraversion | Outgoing | Reserved |
| A | Agreeableness | Trusting | Competitive |
| N | Neuroticism | Anxious | Calm |

### 2.3 Musical Mappings

#### Openness (O)

$$
H_{complexity}(O) = \begin{cases}
\text{chromatic, complex} & O > 0.7 \\
\text{modal variety} & 0.4 \leq O \leq 0.7 \\
\text{diatonic, simple} & O < 0.4
\end{cases}
$$

#### Conscientiousness (C)

$$
R_{regularity}(C) = \begin{cases}
\text{strict tempo, regular} & C > 0.7 \\
\text{mild rubato} & 0.4 \leq C \leq 0.7 \\
\text{free, syncopated} & C < 0.4
\end{cases}
$$

#### Extraversion (E)

$$
\delta_{volume}(E) = v_{min} + E \cdot (v_{max} - v_{min})
$$

| E Level | Dynamic | Velocity Range |
|---------|---------|----------------|
| High | f-fff | 90-127 |
| Medium | mf | 60-90 |
| Low | pp-mp | 20-60 |

#### Agreeableness (A)

$$
I_{consonance}(A) = \begin{cases}
\text{consonant (P5, M3)} & A > 0.7 \\
\text{mixed} & 0.4 \leq A \leq 0.7 \\
\text{dissonant (m2, TT)} & A < 0.4
\end{cases}
$$

**Reference**: [27_REF_INTERVALS_DETAILED](./27_REF_INTERVALS_DETAILED.md)

#### Neuroticism (N)

$$
T_{stability}(N) = \sigma_T^{-1}(1 - N)
$$

Where $\sigma_T$ is tempo standard deviation:

| N Level | Tempo Stability | σ_T |
|---------|-----------------|-----|
| High | Unstable | >10 BPM |
| Medium | Moderate | 5-10 BPM |
| Low | Very stable | <5 BPM |

---

## 3. Dark Triad

### 3.1 Overview

The Dark Triad comprises three subclinical personality traits.

**Citation**: Paulhus, D.L., & Williams, K.M. (2002). The Dark Triad 
of personality. *Journal of Research in Personality*, 36(6), 556-563.

### 3.2 Trait Definitions

#### Narcissism (N_d)

**Musical expression when $N_d > 0.5$**:

$$
\text{Narcissism} \rightarrow \begin{cases}
\text{Dynamics}: & \text{ignores ensemble, always loud} \\
\text{Tuning}: & +5 \text{ cents (sharp)} \\
\text{ADSR}: & A=0, D=0.1, S=1.0, R=0
\end{cases}
$$

#### Machiavellianism (M_d)

**Musical expression when $M_d > 0.5$**:

$$
\text{Machiavellianism} \rightarrow \begin{cases}
\text{Timbre}: & \text{muted, concealed} \\
\text{Tuning}: & -10 \text{ cents (flat)} \\
\text{Pattern}: & \text{hidden motifs}
\end{cases}
$$

#### Psychopathy (P_d)

**Musical expression when $P_d > 0.5$**:

$$
\text{Psychopathy} \rightarrow \begin{cases}
\text{Vibrato}: & \text{none (cold)} \\
\text{Rhythm}: & \text{mechanical precision} \\
\text{ADSR}: & A=0, D=0.5, S=0, R=0.1
\end{cases}
$$

### 3.3 Dark Triad Vector

$$
\vec{t} = \begin{pmatrix} N_d \\ M_d \\ P_d \end{pmatrix} \in [0,1]^3
$$

**Activation threshold**: Any $t_i > 0.5$ triggers modulation.

### 3.4 Combined Effects

When multiple Dark Triad traits are active:

$$
\text{Distortion}(\vec{t}) = \prod_{i: t_i > 0.5} \text{Effect}_i
$$

---

## 4. Cross-Framework Integration

### 4.1 DISC-OCEAN Correlations

| DISC | Primary OCEAN Correlation |
|------|---------------------------|
| D | Low A, Low N |
| I | High E, High A |
| S | High A, Low N |
| C | High C, High A |

### 4.2 Composite Psychometric Vector

Full state vector:

$$
\vec{p} = \begin{pmatrix}
\vec{d} & \text{(DISC)} \\
\vec{o} & \text{(OCEAN)} \\
\vec{t} & \text{(Dark Triad)}
\end{pmatrix} \in \mathbb{R}^{12}
$$

---

## 5. Implementation

```typescript
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

function getDominantDISC(disc: DISCProfile): 'D' | 'I' | 'S' | 'C' {
    const { D, I, S, C } = disc;
    const max = Math.max(D, I, S, C);
    if (D === max) return 'D';
    if (I === max) return 'I';
    if (S === max) return 'S';
    return 'C';
}

function applyDarkTriadModulation(
    baseTimbre: TimbreParams,
    darkTriad: DarkTriadProfile
): TimbreParams {
    let result = { ...baseTimbre };
    
    if (darkTriad.narcissism > 0.5) {
        result.detuning = 5; // cents
        result.dynamics = 'fff';
    }
    if (darkTriad.machiavellianism > 0.5) {
        result.detuning = -10;
        result.muted = true;
    }
    if (darkTriad.psychopathy > 0.5) {
        result.vibrato = 0;
        result.adsr = { A: 0, D: 0.5, S: 0, R: 0.1 };
    }
    
    return result;
}
```

---

## References

Costa, P.T., & McCrae, R.R. (1992). *Revised NEO personality inventory 
(NEO-PI-R) and NEO five-factor inventory (NEO-FFI) professional manual*. 
Psychological Assessment Resources.

Marston, W.M. (1928). *Emotions of normal people*. Kegan Paul.

McKenney, J. (2025). DISC-instrument correspondence theory. 
*OXOT Research*, RSCH-40.

McKenney, J. (2025). Dark Triad timbre modulation. 
*OXOT Research*, RSCH-33.

Paulhus, D.L., & Williams, K.M. (2002). The Dark Triad of personality. 
*Journal of Research in Personality*, 36(6), 556-563.

---

← [02_BORROMEAN_TOPOLOGY](./02_BORROMEAN_TOPOLOGY.md) | 
[Next: 04_MUSICAL_SEMIOTICS →](./04_MUSICAL_SEMIOTICS.md)
