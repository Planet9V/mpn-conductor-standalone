# 26. Reference: Mode (Detailed)
## Scales and Modal Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-26  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [25_REF_TEXTURE_DETAILED](./25_REF_TEXTURE_DETAILED.md) | 
[Next: 27_REF_INTERVALS_DETAILED →](./27_REF_INTERVALS_DETAILED.md)

**Related Documents**:
- [01_LACANIAN_FRAMEWORK](./01_LACANIAN_FRAMEWORK.md) - RSI registers
- [15_SCALE_THEORY](./15_SCALE_THEORY.md) - Scale mathematics

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `mode` |
| Total Entries | 4 |
| Primary Dimension | Lacanian, Stability |

---

## 2. Entry Reference Table

| ID | Display | Subcategory | RSI |
|----|---------|-------------|-----|
| mode-001 | Ionian | scale_mode | Symbolic |
| mode-002 | Phrygian/Locrian | scale_mode | Real |
| mode-003 | Lydian/Whole-tone | scale_mode | Imaginary |
| mode-004 | Chromatic | chromaticism | Transitional |

---

## 3. Mode Formulas

### mode-001: Ionian (Major)

**Intervals**: W-W-H-W-W-W-H

**Scale**: [0, 2, 4, 5, 7, 9, 11]

**RSI**: Symbolic dominant

**Character**: Bright, ordered, lawful

### mode-002: Phrygian

**Intervals**: H-W-W-W-H-W-W

**Scale**: [0, 1, 3, 5, 7, 8, 10]

**RSI**: Real dominant

**Character**: Dark, traumatic

### mode-003: Lydian

**Intervals**: W-W-W-H-W-W-H

**Scale**: [0, 2, 4, 6, 7, 9, 11]

**RSI**: Imaginary dominant

**Character**: Dreamy, ethereal

### mode-004: Chromatic

**Intervals**: All semitones

**Scale**: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

**Character**: No tonal center, transitional

---

## 4. RSI → Mode Selection

$$
M(r, s, i) = \begin{cases}
\text{Phrygian} & r > s \land r > i \\
\text{Ionian} & s \geq r \land s \geq i \\
\text{Lydian} & i > r \land i > s
\end{cases}
$$

---

## References

McKenney, J. (2025). RSI-mode correspondence. *OXOT Research*, RSCH-13.

---

← [25_REF_TEXTURE_DETAILED](./25_REF_TEXTURE_DETAILED.md) | 
[Next: 27_REF_INTERVALS_DETAILED →](./27_REF_INTERVALS_DETAILED.md)
