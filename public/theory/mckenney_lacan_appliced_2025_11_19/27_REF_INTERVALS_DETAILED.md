# 27. Reference: Intervals (Detailed)
## Consonance and Dissonance Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-27  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [26_REF_MODE_DETAILED](./26_REF_MODE_DETAILED.md) | 
[Next: 28_REF_ARTICULATION_DETAILED →](./28_REF_ARTICULATION_DETAILED.md)

**Related Documents**:
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - Relationship equations

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `intervals` |
| Total Entries | 4 |
| Primary Dimension | Relationship |

---

## 2. Entry Reference Table

| ID | Display | Subcategory | ρ Range |
|----|---------|-------------|---------|
| intervals-001 | Perfect | consonance | [+0.7, +1.0] |
| intervals-002 | Imperfect | consonance | [+0.3, +0.7) |
| intervals-003 | Mild Dissonance | dissonance | [-0.7, -0.3) |
| intervals-004 | Tritone | dissonance | [-1.0, -0.7) |

---

## 3. Complete Interval Table

| Interval | Semitones | Ratio | Cents | Quality |
|----------|-----------|-------|-------|---------|
| Unison | 0 | 1:1 | 0 | Perfect |
| m2 | 1 | 16:15 | 100 | Dissonant |
| M2 | 2 | 9:8 | 200 | Mild |
| m3 | 3 | 6:5 | 300 | Imperfect |
| M3 | 4 | 5:4 | 400 | Imperfect |
| P4 | 5 | 4:3 | 500 | Perfect* |
| TT | 6 | √2:1 | 600 | Dissonant |
| P5 | 7 | 3:2 | 700 | Perfect |
| m6 | 8 | 8:5 | 800 | Imperfect |
| M6 | 9 | 5:3 | 900 | Imperfect |
| m7 | 10 | 16:9 | 1000 | Dissonant |
| M7 | 11 | 15:8 | 1100 | Dissonant |
| Octave | 12 | 2:1 | 1200 | Perfect |

---

## 4. Relationship → Interval

$$
I(\rho) = \begin{cases}
\text{P5/Octave} & \rho > 0.7 \\
\text{M3/M6} & 0.3 < \rho \leq 0.7 \\
\text{Unison} & -0.3 \leq \rho \leq 0.3 \\
\text{m2/M7} & -0.7 \leq \rho < -0.3 \\
\text{Tritone} & \rho < -0.7
\end{cases}
$$

---

## References

McKenney, J. (2025). Interval psychology. *OXOT Research*, RSCH-17.

---

← [26_REF_MODE_DETAILED](./26_REF_MODE_DETAILED.md) | 
[Next: 28_REF_ARTICULATION_DETAILED →](./28_REF_ARTICULATION_DETAILED.md)
