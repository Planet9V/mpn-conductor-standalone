# 23. Reference: Dynamics (Detailed)
## Volume and Intensity Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-23  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [22_REF_HARMONY_DETAILED](./22_REF_HARMONY_DETAILED.md) | 
[Next: 24_REF_MELODY_DETAILED →](./24_REF_MELODY_DETAILED.md)

**Related Documents**:
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - Trauma equations

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `dynamics` |
| Total Entries | 6 |
| Primary Dimension | Trauma |

---

## 2. Master Formula

$$
v(\tau) = 20 + 107\tau
$$

Where:
- $v$ = MIDI velocity [0, 127]
- $\tau$ = trauma level [0, 1]

---

## 3. Entry Reference Table

| ID | Display | τ Range | Velocity | Marking |
|----|---------|---------|----------|---------|
| dynamics-001 | Very Soft | [0, 0.2) | 20-42 | ppp/pp |
| dynamics-002 | Medium | [0.4, 0.6) | 63-84 | mf |
| dynamics-003 | Very Loud | [0.8, 1.0] | 106-127 | ff/fff |
| dynamics-004 | Crescendo | τ↑ | — | < |
| dynamics-005 | Decrescendo | τ↓ | — | > |
| dynamics-006 | Sforzando | Shock | 127 | sfz |

---

## 4. Complete Trauma-Velocity Table

| τ Range | v Range | Marking | Italian |
|---------|---------|---------|---------|
| [0.00, 0.10) | 20-31 | ppp | pianississimo |
| [0.10, 0.20) | 31-42 | pp | pianissimo |
| [0.20, 0.35) | 42-58 | p | piano |
| [0.35, 0.50) | 58-74 | mp | mezzo-piano |
| [0.50, 0.65) | 74-90 | mf | mezzo-forte |
| [0.65, 0.80) | 90-106 | f | forte |
| [0.80, 0.90) | 106-117 | ff | fortissimo |
| [0.90, 1.00] | 117-127 | fff | fortississimo |

---

## 5. Adjustable Entry: dynamics-002

**Default**: velocity = 72  
**Range**: 60-85  
**Adjustable**: Yes

---

## References

McKenney, J. (2025). Trauma-dynamics correlation. *OXOT Research*, 
RSCH-07.

---

← [22_REF_HARMONY_DETAILED](./22_REF_HARMONY_DETAILED.md) | 
[Next: 24_REF_MELODY_DETAILED →](./24_REF_MELODY_DETAILED.md)
