# 53. Appendix: Quick Reference Tables
## Comprehensive Lookup Tables

**Author**: McKenney, J.  
**Document ID**: MPN-REF-53  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [52_RSCH_INDEX](./52_RSCH_INDEX.md) | [Back to README →](./README.md)

---

## 1. Master Equation Reference

| Equation | Formula | Input | Output | Reference |
|----------|---------|-------|--------|-----------|
| Trauma→Velocity | $v = 20 + 107\tau$ | τ ∈ [0,1] | v ∈ [20,127] | [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) |
| Entropy→Tempo | $T = T_{min} + H \cdot \Delta T$ | H, σ | BPM | [11_ENTROPY_CALCULUS](./11_ENTROPY_CALCULUS.md) |
| Lyapunov | $\lambda = (\tau + H - 0.5)/2$ | τ, H | λ ∈ [-0.25, 0.75] | [12_LYAPUNOV_STABILITY](./12_LYAPUNOV_STABILITY.md) |
| BSI | $\text{BSI} = \min(r,s,i)/\max(r,s,i)$ | RSI | [0,1] | [02_BORROMEAN_TOPOLOGY](./02_BORROMEAN_TOPOLOGY.md) |
| Shannon | $H = -\sum p_i \log_2 p_i$ | probs | bits | [11_ENTROPY_CALCULUS](./11_ENTROPY_CALCULUS.md) |

---

## 2. Trauma → Dynamics Table

| τ Range | Velocity | Marking | Description |
|---------|----------|---------|-------------|
| [0.00, 0.10) | 20-31 | ppp | Very very soft |
| [0.10, 0.20) | 31-42 | pp | Very soft |
| [0.20, 0.35) | 42-58 | p | Soft |
| [0.35, 0.50) | 58-74 | mp | Medium soft |
| [0.50, 0.65) | 74-90 | mf | Medium loud |
| [0.65, 0.80) | 90-106 | f | Loud |
| [0.80, 0.90) | 106-117 | ff | Very loud |
| [0.90, 1.00] | 117-127 | fff | Very very loud |

**Reference**: [23_REF_DYNAMICS_DETAILED](./23_REF_DYNAMICS_DETAILED.md)

---

## 3. Entropy → Rhythm Table

| H Range | Time Sig | Stability | Tempo Band |
|---------|----------|-----------|------------|
| [0.00, 0.30) | 4/4 | Strategic | 40-60 BPM |
| [0.30, 0.50) | 3/4 | Strategic | 40-60 BPM |
| [0.50, 0.60) | 6/8 | Operational | 80-100 BPM |
| [0.60, 0.70) | 5/4 | Operational | 80-100 BPM |
| [0.70, 0.85) | 7/8 | Crisis | 120-180 BPM |
| [0.85, 1.00] | free | Crisis | 120-180 BPM |

**Reference**: [21_REF_RHYTHM_DETAILED](./21_REF_RHYTHM_DETAILED.md)

---

## 4. RSI → Mode Table

| Dominant | Mode | Scale | Character |
|----------|------|-------|-----------|
| Real | Phrygian | [0,1,3,5,7,8,10] | Dark, traumatic |
| Real | Locrian | [0,1,3,5,6,8,10] | Very dark |
| Symbolic | Ionian | [0,2,4,5,7,9,11] | Bright, ordered |
| Symbolic | Mixolydian | [0,2,4,5,7,9,10] | Slightly darker |
| Imaginary | Lydian | [0,2,4,6,7,9,11] | Ethereal, bright |
| Imaginary | Whole-tone | [0,2,4,6,8,10] | Floating |

**Reference**: [26_REF_MODE_DETAILED](./26_REF_MODE_DETAILED.md)

---

## 5. DISC → Instrument Table

| Dominant | Instrument | MIDI | Character |
|----------|------------|------|-----------|
| D | Brass | 56-63 | Bold, commanding |
| I | Woodwind | 72-79 | Expressive, warm |
| S | Strings | 40-52 | Sustained, supportive |
| C | Keyboard | 0-8 | Precise, measured |

**Reference**: [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md)

---

## 6. Relationship → Interval Table

| ρ Range | Interval | Cents | Character |
|---------|----------|-------|-----------|
| [+0.7, +1.0] | P5, Octave | 700, 1200 | Alliance |
| [+0.3, +0.7) | M3, M6 | 400, 900 | Cooperation |
| [-0.3, +0.3) | Unison | 0 | Neutral |
| [-0.7, -0.3) | m2, M7 | 100, 1100 | Tension |
| [-1.0, -0.7) | Tritone | 600 | Conflict |

**Reference**: [27_REF_INTERVALS_DETAILED](./27_REF_INTERVALS_DETAILED.md)

---

## 7. Neo-Riemannian Operations Table

| Op | From | To | Distance | Meaning |
|----|------|-----|----------|---------|
| P | C Major | C minor | 0 (mode) | Real intrusion |
| R | C Major | A minor | m3 down | Symbolic order |
| L | C Major | E minor | M3 up | Imaginary shift |
| PR | C Major | A♭ Major | M3 down | — |
| PL | C Major | E Major | M3 up | — |
| PLP | C Major | D♭ Major | Tritone | Seldon Crisis |

**Reference**: [13_NEO_RIEMANNIAN_MATH](./13_NEO_RIEMANNIAN_MATH.md)

---

## 8. Stability Zones Table

| λ Range | Zone | BSI | Action |
|---------|------|-----|--------|
| < 0 | Stable | > 0.7 | Maintain |
| [0, 0.1) | Edge | 0.5-0.7 | Monitor |
| [0.1, 0.3) | Chaotic | 0.3-0.5 | Concern |
| ≥ 0.3 | Hyper | < 0.3 | Crisis |

**Reference**: [12_LYAPUNOV_STABILITY](./12_LYAPUNOV_STABILITY.md)

---

## 9. Dark Triad Modulation Table

| Trait | Threshold | Detuning | ADSR | Effect |
|-------|-----------|----------|------|--------|
| Narc | > 0.5 | +5 cents | A=0, S=1 | Loud, sharp |
| Mach | > 0.5 | -10 cents | A=0.3 | Muted, flat |
| Psych | > 0.5 | 0 | D=0.5, S=0 | Cold, mechanical |

**Reference**: [20_REF_TIMBRE_DETAILED](./20_REF_TIMBRE_DETAILED.md)

---

## 10. Complete Entry ID Reference

### Timbre (timbre-001 to timbre-009)
| ID | Name | Mapping |
|----|------|---------|
| timbre-001 | Brass | DISC:D |
| timbre-002 | Woodwind | DISC:I |
| timbre-003 | Strings | DISC:S |
| timbre-004 | Keyboard | DISC:C |
| timbre-005 | Machiavellian | DT:Mach |
| timbre-006 | Narcissistic | DT:Narc |
| timbre-007 | Psychopathic | DT:Psych |
| timbre-008 | High Register | Symbolic |
| timbre-009 | Low Register | Real |

### Rhythm (rhythm-001 to rhythm-009)
| ID | Name | Mapping |
|----|------|---------|
| rhythm-001 | 4/4 Time | H < 0.3 |
| rhythm-002 | 3/4 Time | H 0.3-0.5 |
| rhythm-003 | Irregular | H 0.6-0.8 |
| rhythm-004 | Free | H > 0.8 |
| rhythm-005 | Slow | Strategic |
| rhythm-006 | Normal | Operational |
| rhythm-007 | Fast | Crisis |
| rhythm-008 | Accelerando | τ increasing |
| rhythm-009 | Ritardando | τ decreasing |

### Harmony (harmony-001 to harmony-009)
| ID | Name | Mapping |
|----|------|---------|
| harmony-001 | Major | Joy |
| harmony-002 | Minor | Sadness |
| harmony-003 | Dom7 | Anticipation |
| harmony-004 | Dim | Anxiety |
| harmony-005 | Tritone | Crisis |
| harmony-006 | P Transform | Real |
| harmony-007 | R Transform | Symbolic |
| harmony-008 | L Transform | Imaginary |
| harmony-009 | PLP | Seldon |

### Dynamics (dynamics-001 to dynamics-006)
| ID | Name | Mapping |
|----|------|---------|
| dynamics-001 | Very Soft | τ 0-0.2 |
| dynamics-002 | Medium | τ 0.4-0.6 |
| dynamics-003 | Very Loud | τ > 0.8 |
| dynamics-004 | Crescendo | τ↑ |
| dynamics-005 | Decrescendo | τ↓ |
| dynamics-006 | Sforzando | Shock |

---

## 11. MIDI Reference

| Parameter | Range | Notes |
|-----------|-------|-------|
| Note Number | 0-127 | 60 = Middle C |
| Velocity | 0-127 | Volume |
| Program Change | 0-127 | Instrument |
| Control Change | 0-127 | Various |

---

← [52_RSCH_INDEX](./52_RSCH_INDEX.md) | [Back to README →](./README.md)
