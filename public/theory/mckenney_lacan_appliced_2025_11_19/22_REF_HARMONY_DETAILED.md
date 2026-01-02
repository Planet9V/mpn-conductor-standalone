# 22. Reference: Harmony (Detailed)
## Neo-Riemannian Operations and Chord Mappings

**Author**: McKenney, J.  
**Document ID**: MPN-REF-22  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [21_REF_RHYTHM_DETAILED](./21_REF_RHYTHM_DETAILED.md) | 
[Next: 23_REF_DYNAMICS_DETAILED →](./23_REF_DYNAMICS_DETAILED.md)

**Related Documents**:
- [13_NEO_RIEMANNIAN_MATH](./13_NEO_RIEMANNIAN_MATH.md) - PLR math
- [01_LACANIAN_FRAMEWORK](./01_LACANIAN_FRAMEWORK.md) - RSI mappings

---

## 1. Category Overview

| Property | Value |
|----------|-------|
| Category ID | `harmony` |
| Total Entries | 9 |
| Primary Dimension | Emotion, RSI, Stability |

---

## 2. Entry Reference Table

| ID | Display | Subcategory | Mapping |
|----|---------|-------------|---------|
| harmony-001 | Major | chord_type | Joy, Peace |
| harmony-002 | Minor | chord_type | Sadness |
| harmony-003 | Dom7 | chord_type | Anticipation |
| harmony-004 | Diminished | chord_type | Anxiety |
| harmony-005 | Tritone | chord_type | Crisis |
| harmony-006 | P Transform | neo_riemannian | Real |
| harmony-007 | R Transform | neo_riemannian | Symbolic |
| harmony-008 | L Transform | neo_riemannian | Imaginary |
| harmony-009 | PLP | neo_riemannian | Seldon Crisis |

---

## 3. Chord Type Entries

### harmony-001: Major Chord

**Formula**: [0, 4, 7] (root, M3, P5)

**Emotional Mapping**: Joy, Peace, Resolution

**Tension**: 0.1 (minimal)

### harmony-002: Minor Chord

**Formula**: [0, 3, 7] (root, m3, P5)

**Emotional Mapping**: Sadness, Introspection

**Tension**: 0.3

### harmony-003: Dominant 7th

**Formula**: [0, 4, 7, 10] (root, M3, P5, m7)

**Emotional Mapping**: Anticipation, Desire

**Tension**: 0.5 (objet a representation)

**Citation**: McKenney, J. (2025). Object petit a harmonic expression. 
*OXOT Research*, RSCH-10.

### harmony-004: Diminished

**Formula**: [0, 3, 6] (root, m3, dim5)

**Emotional Mapping**: Anxiety, Fear

**Tension**: 0.8

### harmony-005: Tritone/Augmented

**Formula**: [0, 4, 8] or direct tritone interval

**Emotional Mapping**: Crisis, Rupture

**Tension**: 1.0 (maximum)

---

## 4. Neo-Riemannian Entries

### harmony-006: P (Parallel)

**Operation**: Major ↔ Minor

**RSI Mapping**: Real register dominance

**Musical Result**: C major → C minor

$$
P: (0, 4, 7) \leftrightarrow (0, 3, 7)
$$

### harmony-007: R (Relative)

**Operation**: Move to relative key

**RSI Mapping**: Symbolic register dominance

**Musical Result**: C major → A minor

$$
R: (0, 4, 7) \leftrightarrow (9, 0, 4)
$$

### harmony-008: L (Leading-tone)

**Operation**: Leading-tone exchange

**RSI Mapping**: Imaginary register dominance

**Musical Result**: C major → E minor

$$
L: (0, 4, 7) \leftrightarrow (4, 7, 11)
$$

### harmony-009: PLP (Seldon Crisis)

**Operation**: Compound tritone shift

**Condition**: Seldon Crisis detected

**Musical Result**: C → C♯ → E → D♭

**Total Distance**: 6 semitones (tritone)

---

## 5. Tension → Chord Selection

$$
C(T) = \begin{cases}
\text{major} & T < 0.2 \\
\text{major7} & 0.2 \leq T < 0.4 \\
\text{minor7} & 0.4 \leq T < 0.6 \\
\text{dominant7} & 0.6 \leq T < 0.8 \\
\text{diminished} & T \geq 0.8
\end{cases}
$$

---

## References

Cohn, R. (1998). Introduction to Neo-Riemannian theory. *Journal 
of Music Theory*, 42(2), 167-180.

McKenney, J. (2025). RSI-harmony correspondence. *OXOT Research*, 
RSCH-39.

---

← [21_REF_RHYTHM_DETAILED](./21_REF_RHYTHM_DETAILED.md) | 
[Next: 23_REF_DYNAMICS_DETAILED →](./23_REF_DYNAMICS_DETAILED.md)
