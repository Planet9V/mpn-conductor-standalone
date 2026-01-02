# 10. Core Equations
## Primary Mathematical Transformations

**Author**: McKenney, J.  
**Document ID**: MPN-DOC-10  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [05_LEITMOTIF_THEORY](./05_LEITMOTIF_THEORY.md) | 
[Next: 11_ENTROPY_CALCULUS →](./11_ENTROPY_CALCULUS.md)

**Related Documents**:
- [11_ENTROPY_CALCULUS](./11_ENTROPY_CALCULUS.md) - Entropy mathematics
- [12_LYAPUNOV_STABILITY](./12_LYAPUNOV_STABILITY.md) - Stability metrics
- [42_API_SPECIFICATION](./42_API_SPECIFICATION.md) - Implementation
- [31_FLOW_CALCULUS_ENGINE](./31_FLOW_CALCULUS_ENGINE.md) - Process flow

---

## 1. Fundamental Transformation

### 1.1 Master Function

The complete psychometric-to-musical transformation:

$$
\Phi: \mathcal{P} \rightarrow \mathcal{M}
$$

Where:
- $\mathcal{P}$ = Psychometric state space $\subseteq \mathbb{R}^{n}$
- $\mathcal{M}$ = Musical parameter manifold

Explicitly:

$$
\Phi(\vec{p}) = \begin{pmatrix}
f_\text{tempo}(\vec{p}) \\
f_\text{dynamics}(\vec{p}) \\
f_\text{mode}(\vec{p}) \\
f_\text{timbre}(\vec{p}) \\
f_\text{harmony}(\vec{p})
\end{pmatrix}
$$

### 1.2 State Vector

The psychometric state vector:

$$
\vec{p} = \begin{pmatrix}
\tau & \text{(trauma)} \\
H & \text{(entropy)} \\
r & \text{(real)} \\
s & \text{(symbolic)} \\
i & \text{(imaginary)} \\
D & \text{(dominance)} \\
I_d & \text{(influence)} \\
S_d & \text{(steadiness)} \\
C & \text{(compliance)}
\end{pmatrix}
\in [0,1]^9
$$

---

## 2. Trauma Equations

### 2.1 Trauma to Dynamics

**Definition**: Maps trauma level to MIDI velocity.

$$
v(\tau) = v_{\min} + \tau \cdot (v_{\max} - v_{\min})
$$

With standard parameters:
- $v_{\min} = 20$ (ppp)
- $v_{\max} = 127$ (fff)

**Expanded form**:

$$
v(\tau) = 20 + 107\tau
$$

### 2.2 Trauma to Dynamic Marking

**Definition**: Discretizes velocity to musical notation.

$$
\delta(\tau) = \begin{cases}
\text{ppp} & \tau < 0.1 \\
\text{pp} & 0.1 \leq \tau < 0.2 \\
\text{p} & 0.2 \leq \tau < 0.35 \\
\text{mp} & 0.35 \leq \tau < 0.5 \\
\text{mf} & 0.5 \leq \tau < 0.65 \\
\text{f} & 0.65 \leq \tau < 0.8 \\
\text{ff} & 0.8 \leq \tau < 0.9 \\
\text{fff} & \tau \geq 0.9
\end{cases}
$$

### 2.3 Velocity-Dynamic Reference Table

| τ Range | v Range | Marking | Description |
|---------|---------|---------|-------------|
| [0.00, 0.10) | [20, 31) | ppp | pianississimo |
| [0.10, 0.20) | [31, 42) | pp | pianissimo |
| [0.20, 0.35) | [42, 58) | p | piano |
| [0.35, 0.50) | [58, 74) | mp | mezzo-piano |
| [0.50, 0.65) | [74, 90) | mf | mezzo-forte |
| [0.65, 0.80) | [90, 106) | f | forte |
| [0.80, 0.90) | [106, 117) | ff | fortissimo |
| [0.90, 1.00] | [117, 127] | fff | fortississimo |

**Reference**: [23_REF_DYNAMICS_DETAILED](./23_REF_DYNAMICS_DETAILED.md)

---

## 3. Entropy Equations

### 3.1 Entropy to Tempo

**Definition**: Maps entropy to tempo within stability bands.

Given stability level $\sigma \in \{\text{strategic}, \text{operational}, \text{crisis}\}$:

$$
T(H, \sigma) = T_{\min}(\sigma) + H \cdot (T_{\max}(\sigma) - T_{\min}(\sigma))
$$

**Stability band parameters**:

| σ | $T_{\min}$ | $T_{\max}$ | Character |
|---|-----------|-----------|-----------|
| strategic | 40 | 60 | Largo-Adagio |
| operational | 80 | 100 | Andante |
| crisis | 120 | 180 | Allegro-Presto |

### 3.2 Entropy to Time Signature

**Definition**: Selects meter based on entropy.

$$
\mu(H) = \begin{cases}
\text{4/4} & H < 0.3 \\
\text{3/4} & 0.3 \leq H < 0.5 \\
\text{6/8} & 0.5 \leq H < 0.6 \\
\text{5/4} & 0.6 \leq H < 0.7 \\
\text{7/8} & 0.7 \leq H < 0.85 \\
\text{free} & H \geq 0.85
\end{cases}
$$

**Reference**: [21_REF_RHYTHM_DETAILED](./21_REF_RHYTHM_DETAILED.md)

See also: [11_ENTROPY_CALCULUS](./11_ENTROPY_CALCULUS.md) for Shannon 
entropy derivation.

---

## 4. RSI Equations

### 4.1 RSI to Mode

**Definition**: Maps dominant Lacanian register to scale.

$$
M(r, s, i) = \begin{cases}
\text{Phrygian} & r > s \land r > i \\
\text{Ionian} & s \geq r \land s \geq i \\
\text{Lydian} & i > r \land i > s
\end{cases}
$$

### 4.2 RSI to Neo-Riemannian Operation

$$
\text{NRO}(r, s, i) = \begin{cases}
P & r = \max(r, s, i) \\
R & s = \max(r, s, i) \\
L & i = \max(r, s, i)
\end{cases}
$$

**Reference**: [13_NEO_RIEMANNIAN_MATH](./13_NEO_RIEMANNIAN_MATH.md)

---

## 5. DISC Equations

### 5.1 DISC to Instrument Family

**Definition**: Maps dominant DISC factor to instrument.

$$
\mathcal{I}(D, I_d, S_d, C) = \begin{cases}
\text{Brass} & D = \max \\
\text{Woodwind} & I_d = \max \\
\text{Strings} & S_d = \max \\
\text{Keyboard} & C = \max
\end{cases}
$$

### 5.2 DISC to Articulation

$$
\mathcal{A}(D, I_d, S_d, C) = \begin{cases}
\text{staccato} & D = \max \\
\text{legato} & I_d = \max \\
\text{tenuto} & S_d = \max \\
\text{precise} & C = \max
\end{cases}
$$

**Reference**: [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md), 
[28_REF_ARTICULATION_DETAILED](./28_REF_ARTICULATION_DETAILED.md)

---

## 6. Relationship Equations

### 6.1 Relationship to Interval

**Definition**: Maps relationship quality to harmonic interval.

$$
I(\rho) = \begin{cases}
\text{octave/P5} & \rho > 0.7 \\
\text{M3/M6} & 0.3 < \rho \leq 0.7 \\
\text{unison} & -0.3 \leq \rho \leq 0.3 \\
\text{m2/M7} & -0.7 \leq \rho < -0.3 \\
\text{tritone} & \rho < -0.7
\end{cases}
$$

Where $\rho \in [-1, 1]$ is relationship quality.

### 6.2 Interval to Cents

| Interval | Ratio | Cents |
|----------|-------|-------|
| Unison | 1:1 | 0 |
| m2 | 16:15 | 100 |
| M3 | 5:4 | 400 |
| P5 | 3:2 | 700 |
| Tritone | √2:1 | 600 |
| Octave | 2:1 | 1200 |

**Reference**: [27_REF_INTERVALS_DETAILED](./27_REF_INTERVALS_DETAILED.md)

---

## 7. Composite Functions

### 7.1 Tension Calculation

**Definition**: Overall harmonic tension.

$$
T = \alpha\tau + \beta H + \gamma(1 - \text{BSI})
$$

With weights:
- $\alpha = 0.4$ (trauma weight)
- $\beta = 0.3$ (entropy weight)
- $\gamma = 0.3$ (stability weight)

### 7.2 Lyapunov Exponent

$$
\lambda = (\tau + H - 0.5) \times 0.5
$$

**See**: [12_LYAPUNOV_STABILITY](./12_LYAPUNOV_STABILITY.md)

### 7.3 Crisis Detection

$$
\text{Crisis} = (\lambda > 0.1) \land (\text{BSI} < 0.3)
$$

---

## 8. Implementation

### 8.1 TypeScript: traumaToDynamics

```typescript
function traumaToDynamics(
    trauma: number, 
    adjustments?: Record<string, ParameterAdjustment>
): { velocity: number; label: string } {
    
    // Check for user override
    if (adjustments?.['dynamics-002']?.dynamics) {
        return { 
            velocity: adjustments['dynamics-002'].dynamics, 
            label: velocityToLabel(adjustments['dynamics-002'].dynamics) 
        };
    }
    
    // Standard calculation: v = 20 + 107τ
    const velocity = Math.round(20 + trauma * 107);
    
    // Determine dynamic label
    let label = 'mf';
    if (trauma < 0.1) label = 'ppp';
    else if (trauma < 0.2) label = 'pp';
    else if (trauma < 0.35) label = 'p';
    else if (trauma < 0.5) label = 'mp';
    else if (trauma < 0.65) label = 'mf';
    else if (trauma < 0.8) label = 'f';
    else if (trauma < 0.9) label = 'ff';
    else label = 'fff';
    
    return { velocity, label };
}
```

### 8.2 TypeScript: entropyToRhythm

```typescript
function entropyToRhythm(
    entropy: number,
    adjustments?: Record<string, ParameterAdjustment>
): { tempo: number; timeSignature: string } {
    
    // Determine stability band
    let stability: 'strategic' | 'operational' | 'crisis' = 'operational';
    if (entropy < 0.4) stability = 'strategic';
    else if (entropy > 0.7) stability = 'crisis';
    
    // Get tempo range (with possible adjustment)
    const range = lookupTempoRange(stability, adjustments);
    
    // Calculate tempo: T = T_min + H × (T_max - T_min)
    const tempo = Math.round(
        range.min + entropy * (range.max - range.min)
    );
    
    // Determine time signature
    const timeSignature = lookupTimeSignature(entropy);
    
    return { tempo, timeSignature };
}
```

**Full API**: [42_API_SPECIFICATION](./42_API_SPECIFICATION.md)

---

## 9. Equation Summary Table

| Equation | Input | Output | Reference |
|----------|-------|--------|-----------|
| $v(\tau)$ | τ ∈ [0,1] | v ∈ [20,127] | §2.1 |
| $T(H,σ)$ | H, stability | BPM | §3.1 |
| $μ(H)$ | H ∈ [0,1] | time sig | §3.2 |
| $M(r,s,i)$ | RSI vector | mode | §4.1 |
| $\mathcal{I}(DISC)$ | DISC vector | instrument | §5.1 |
| $I(ρ)$ | ρ ∈ [-1,1] | interval | §6.1 |
| $λ$ | τ, H | ℝ | §7.2 |

---

## References

McKenney, J. (2025). Psychometric calculus: Core transformations. 
*OXOT Research*, RSCH-43.

McKenney, J. (2025). Musical psychometric notation system. 
*OXOT Research*, RSCH-39.

McKenney, J. (2025). DISC-instrument correspondence. 
*OXOT Research*, RSCH-40.

---

← [05_LEITMOTIF_THEORY](./05_LEITMOTIF_THEORY.md) | 
[Next: 11_ENTROPY_CALCULUS →](./11_ENTROPY_CALCULUS.md)
