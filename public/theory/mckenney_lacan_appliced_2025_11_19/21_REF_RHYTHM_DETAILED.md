# 21. Reference: Rhythm (Detailed)
## Comprehensive Tempo and Meter Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-21  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md) | 
[Next: 22_REF_HARMONY_DETAILED →](./22_REF_HARMONY_DETAILED.md)

**Related Documents**:
- [11_ENTROPY_CALCULUS](./11_ENTROPY_CALCULUS.md) - Entropy math
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - Tempo equations

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `rhythm` |
| Total Entries | 9 |
| Primary Dimension | Entropy, Stability |

---

## 2. Entry Reference Table

| ID | Display | Subcategory | Condition | Output |
|----|---------|-------------|-----------|--------|
| rhythm-001 | 4/4 Time | time_signature | H < 0.3 | "4/4" |
| rhythm-002 | 3/4 Time | time_signature | 0.3 ≤ H < 0.5 | "3/4" |
| rhythm-003 | Irregular | time_signature | 0.6 ≤ H < 0.8 | "5/4","7/8" |
| rhythm-004 | Free | time_signature | H ≥ 0.85 | "free" |
| rhythm-005 | Slow | tempo | σ = strategic | 40-60 BPM |
| rhythm-006 | Normal | tempo | σ = operational | 80-100 BPM |
| rhythm-007 | Fast | tempo | σ = crisis | 120-180 BPM |
| rhythm-008 | Accelerando | tempo_change | τ increasing | +BPM/bar |
| rhythm-009 | Ritardando | tempo_change | τ decreasing | -BPM/bar |

---

## 3. Entropy → Time Signature

### 3.1 Mathematical Definition

$$
\mu(H) = \begin{cases}
\frac{4}{4} & H \in [0, 0.30) \\
\frac{3}{4} & H \in [0.30, 0.50) \\
\frac{6}{8} & H \in [0.50, 0.60) \\
\frac{5}{4} & H \in [0.60, 0.70) \\
\frac{7}{8} & H \in [0.70, 0.85) \\
\text{free} & H \in [0.85, 1.0]
\end{cases}
$$

### 3.2 Detailed Entries

#### rhythm-001: 4/4 Time

**Condition**: $H < 0.3$

**Characteristics**:
- Most stable Western meter
- Strong downbeat on beat 1
- Secondary accent on beat 3
- Maximum predictability

**Citation**: McKenney, J. (2025). Entropy-rhythm correlation. 
*OXOT Research*, RSCH-05.

#### rhythm-002: 3/4 Time

**Condition**: $0.3 \leq H < 0.5$

**Characteristics**:
- Waltz feel
- Slight asymmetry
- Dance-like motion

#### rhythm-003: Irregular Meters

**Condition**: $0.6 \leq H < 0.85$

**Options**: 5/4, 7/8, 11/8

**Characteristics**:
- Cognitive disruption
- Uneven groupings
- Anxiety-inducing

#### rhythm-004: Free Meter

**Condition**: $H \geq 0.85$

**Characteristics**:
- No regular pulse
- Aleatoric timing
- Maximum uncertainty

---

## 4. Stability → Tempo Bands

### 4.1 Mathematical Definition

$$
T(H, \sigma) = T_{min}(\sigma) + H \cdot (T_{max}(\sigma) - T_{min}(\sigma))
$$

### 4.2 Band Parameters

| Band | $T_{min}$ | $T_{max}$ | $\Delta T$ | Character |
|------|----------|----------|------------|-----------|
| Strategic | 40 | 60 | 20 | Largo-Adagio |
| Operational | 80 | 100 | 20 | Andante-Moderato |
| Crisis | 120 | 180 | 60 | Allegro-Presto |

### 4.3 Adjustable Entry: rhythm-006 (Normal Tempo)

**Default**: 90 BPM  
**Range**: 80-100 BPM (step: 2)  
**Adjustable**: Yes

```typescript
interface TempoAdjustment {
    entryId: 'rhythm-006';
    tempo: number;  // 80-100
}
```

---

## 5. Implementation

```typescript
function entropyToTimeSignature(entropy: number): string {
    if (entropy < 0.30) return '4/4';
    if (entropy < 0.50) return '3/4';
    if (entropy < 0.60) return '6/8';
    if (entropy < 0.70) return '5/4';
    if (entropy < 0.85) return '7/8';
    return 'free';
}

function entropyToTempo(
    entropy: number,
    stability: 'strategic' | 'operational' | 'crisis',
    adjustments?: Record<string, ParameterAdjustment>
): number {
    // Check for adjustment
    if (adjustments?.['rhythm-006']?.tempo) {
        return adjustments['rhythm-006'].tempo;
    }
    
    const ranges = {
        strategic: { min: 40, max: 60 },
        operational: { min: 80, max: 100 },
        crisis: { min: 120, max: 180 }
    };
    
    const range = ranges[stability];
    return Math.round(range.min + entropy * (range.max - range.min));
}
```

---

## References

McKenney, J. (2025). Entropy-based rhythm generation. *OXOT Research*, 
RSCH-05.

Shannon, C.E. (1948). A mathematical theory of communication. *Bell 
System Technical Journal*, 27(3), 379-423.

---

← [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md) | 
[Next: 22_REF_HARMONY_DETAILED →](./22_REF_HARMONY_DETAILED.md)
