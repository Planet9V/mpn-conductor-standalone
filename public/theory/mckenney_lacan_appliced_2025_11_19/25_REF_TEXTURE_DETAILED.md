# 25. Reference: Texture (Detailed)
## Orchestral Density Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-25  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [24_REF_MELODY_DETAILED](./24_REF_MELODY_DETAILED.md) | 
[Next: 26_REF_MODE_DETAILED →](./26_REF_MODE_DETAILED.md)

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `texture` |
| Total Entries | 3 |
| Primary Dimension | Relationship, Stability |

---

## 2. Entry Reference Table

| ID | Display | Subcategory | Mapping |
|----|---------|-------------|---------|
| texture-001 | Homophonic | density | Unity (BSI > 0.8) |
| texture-002 | Polyphonic | density | Complexity |
| texture-003 | Monophonic | density | Isolation |

---

## 3. Texture Types

### texture-001: Homophonic

**Definition**: Melody with chordal accompaniment

**Condition**: High BSI (> 0.8)

**Character**: Unified, consensus

### texture-002: Polyphonic

**Definition**: Multiple independent voices

**Condition**: Moderate stability

**Character**: Complex, competing

### texture-003: Monophonic

**Definition**: Single melodic line

**Condition**: Isolation state

**Character**: Solo, exposed

---

## 4. BSI → Texture

$$
T(\text{BSI}) = \begin{cases}
\text{homophonic} & \text{BSI} > 0.8 \\
\text{heterophonic} & 0.5 < \text{BSI} \leq 0.8 \\
\text{polyphonic} & 0.3 < \text{BSI} \leq 0.5 \\
\text{disintegrated} & \text{BSI} \leq 0.3
\end{cases}
$$

---

## References

McKenney, J. (2025). Texture mapping. *OXOT Research*, RSCH-18.

---

← [24_REF_MELODY_DETAILED](./24_REF_MELODY_DETAILED.md) | 
[Next: 26_REF_MODE_DETAILED →](./26_REF_MODE_DETAILED.md)
