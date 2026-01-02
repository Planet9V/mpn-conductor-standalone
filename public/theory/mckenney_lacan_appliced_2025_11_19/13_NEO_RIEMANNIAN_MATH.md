# 13. Neo-Riemannian Mathematics
## PLR Transformations and Chord Operations

**Author**: McKenney, J.  
**Document ID**: MPN-DOC-13  
**Version**: 3.0.0  
**Date**: December 31, 2025

---

## Navigation

← [12_LYAPUNOV_STABILITY](./12_LYAPUNOV_STABILITY.md) | 
[Next: 14_TENSOR_OPERATIONS →](./14_TENSOR_OPERATIONS.md)

**Related Documents**:
- [01_LACANIAN_FRAMEWORK](./01_LACANIAN_FRAMEWORK.md) - RSI mappings
- [22_REF_HARMONY_DETAILED](./22_REF_HARMONY_DETAILED.md) - Chord types
- [10_CORE_EQUATIONS](./10_CORE_EQUATIONS.md) - Core transformations

---

## 1. Neo-Riemannian Theory Overview

### 1.1 Historical Context

Hugo Riemann (1849-1919) developed the foundations of harmonic 
transformation theory. Neo-Riemannian theory, revived by David Lewin 
and Richard Cohn, formalizes how chords transform through minimal 
voice-leading operations.

**Citations**:
- Riemann, H. (1880). *Skizze einer neuen Methode der Harmonielehre*. 
  Breitkopf & Härtel.
- Lewin, D. (1987). *Generalized musical intervals and transformations*. 
  Yale University Press.
- Cohn, R. (1998). Introduction to Neo-Riemannian theory. *Journal of 
  Music Theory*, 42(2), 167-180.

---

## 2. Primary Operations (PLR)

### 2.1 Parallel (P)

Changes mode while preserving root.

**Operation**: Major ↔ Minor (move 3rd by semitone)

$$
P: C\text{-}E\text{-}G \leftrightarrow C\text{-}E\flat\text{-}G
$$

**Formal definition**:

$$
P(T) = \begin{cases}
(r, r+3, r+7) & \text{if } T = (r, r+4, r+7) \text{ (major → minor)} \\
(r, r+4, r+7) & \text{if } T = (r, r+3, r+7) \text{ (minor → major)}
\end{cases}
$$

**Voice leading**: One voice moves by semitone.

### 2.2 Relative (R)

Moves to relative major/minor (common tones preserved).

**Operation**: C major ↔ A minor

$$
R: C\text{-}E\text{-}G \leftrightarrow A\text{-}C\text{-}E
$$

**Formal definition**:

$$
R(T) = \begin{cases}
(r-3, r, r+4) \mod 12 & \text{if major} \\
(r+3, r+7, r+10) \mod 12 & \text{if minor}
\end{cases}
$$

**Voice leading**: One voice moves by whole tone.

### 2.3 Leading-tone Exchange (L)

Moves by leading-tone relationship.

**Operation**: C major ↔ E minor

$$
L: C\text{-}E\text{-}G \leftrightarrow B\text{-}E\text{-}G
$$

**Formal definition**:

$$
L(T) = \begin{cases}
(r-1, r+4, r+7) \mod 12 & \text{if major} \\
(r+3, r+7, r+8) \mod 12 & \text{if minor}
\end{cases}
$$

**Voice leading**: One voice moves by semitone.

---

## 3. PLR Properties

### 3.1 Involutions

Each operation is its own inverse:

$$
P \circ P = R \circ R = L \circ L = I
$$

Where $I$ is the identity transformation.

### 3.2 Group Structure

The PLR operations generate a group isomorphic to the dihedral group 
$D_{24}$:

$$
\langle P, L, R \rangle \cong D_{24}
$$

### 3.3 Tonnetz Navigation

On the Tonnetz (pitch-space lattice):

| Operation | Movement | Axis |
|-----------|----------|------|
| P | Vertical flip | 3rd axis |
| R | Horizontal flip | 5th axis |
| L | Diagonal slip | Leading-tone |

---

## 4. Compound Operations

### 4.1 Two-Step Compounds

| Operation | Path | Result (from C major) | Semitones |
|-----------|------|----------------------|-----------|
| PR | P then R | A♭ major | -4 |
| PL | P then L | E major | +4 |
| RP | R then P | A major | -3 |
| RL | R then L | E minor | +4 |
| LP | L then P | E♭ major | +3 |
| LR | L then R | C minor | 0 (mode change) |

### 4.2 Three-Step Compound: PLP

**Seldon Crisis Operation**:

$$
PLP: C \rightarrow C\text{m} \rightarrow E\flat \rightarrow D\flat
$$

**Total distance**: Tritone (6 semitones)

This is the maximum harmonic distance within the triadic system, 
representing complete psychological rupture.

$$
|PLP| = \frac{12}{2} = 6 \text{ semitones (tritone)}
$$

---

## 5. RSI-PLR Correspondence

### 5.1 Lacanian Mapping

| Register | Operation | Psychological Meaning |
|----------|-----------|----------------------|
| Real | P | Trauma intrusion (mode darkening) |
| Symbolic | R | Lawful transition (related key) |
| Imaginary | L | Mirror shift (surface change) |

**Reference**: [01_LACANIAN_FRAMEWORK](./01_LACANIAN_FRAMEWORK.md)

### 5.2 Mathematical Formulation

Given dominant register $D(\vec{r})$:

$$
\text{NRO}(D) = \begin{cases}
P & D = \text{real} \\
R & D = \text{symbolic} \\
L & D = \text{imaginary}
\end{cases}
$$

### 5.3 Crisis Compound Selection

For crisis states:

$$
\text{CrisisOp}(\text{severity}) = \begin{cases}
PL & \text{severity} < 0.5 \\
RP & 0.5 \leq \text{severity} < 0.8 \\
PLP & \text{severity} \geq 0.8
\end{cases}
$$

---

## 6. Transformation Tables

### 6.1 P Transform Table

| Input | Output | Semitone Change |
|-------|--------|-----------------|
| C major | C minor | 3rd: E→E♭ (-1) |
| D major | D minor | 3rd: F♯→F (-1) |
| E major | E minor | 3rd: G♯→G (-1) |
| F major | F minor | 3rd: A→A♭ (-1) |
| G major | G minor | 3rd: B→B♭ (-1) |
| A major | A minor | 3rd: C♯→C (-1) |
| B major | B minor | 3rd: D♯→D (-1) |

### 6.2 R Transform Table

| Input | Output | Root Change |
|-------|--------|-------------|
| C major | A minor | -3 (m3 down) |
| D major | B minor | -3 |
| E major | C♯ minor | -3 |
| F major | D minor | -3 |
| G major | E minor | -3 |
| A major | F♯ minor | -3 |
| B major | G♯ minor | -3 |

### 6.3 L Transform Table

| Input | Output | Root Change |
|-------|--------|-------------|
| C major | E minor | +4 (M3 up) |
| D major | F♯ minor | +4 |
| E major | G♯ minor | +4 |
| F major | A minor | +4 |
| G major | B minor | +4 |
| A major | C♯ minor | +4 |
| B major | D♯ minor | +4 |

---

## 7. Tonnetz Visualization

```
         E - - - B - - - F♯- - - C♯
        /\     / \     / \     / \
       /  \   /   \   /   \   /   \
      C - - -G - - - D - - - A - - -
       \  / \ \  / \ \  / \ \  / \
        \/   \ \/   \ \/   \ \/   \
     A♭- - - E♭- - - B♭- - - F - - - C
        \   / \   / \   / \   / \   /
         \ /   \ /   \ /   \ /   \ /
          C - - - G - - - D - - - A
```

**Navigation**:
- Horizontal: Perfect 5th
- Diagonal (↗): Major 3rd
- Diagonal (↘): Minor 3rd

---

## 8. Implementation

```typescript
type Chord = {
    root: number;        // 0-11 (C=0, C#=1, ...)
    quality: 'major' | 'minor';
};

function applyP(chord: Chord): Chord {
    return {
        root: chord.root,
        quality: chord.quality === 'major' ? 'minor' : 'major'
    };
}

function applyR(chord: Chord): Chord {
    if (chord.quality === 'major') {
        // Major → relative minor (down m3)
        return { root: (chord.root - 3 + 12) % 12, quality: 'minor' };
    } else {
        // Minor → relative major (up m3)
        return { root: (chord.root + 3) % 12, quality: 'major' };
    }
}

function applyL(chord: Chord): Chord {
    if (chord.quality === 'major') {
        // Major → leading-tone minor (up M3)
        return { root: (chord.root + 4) % 12, quality: 'minor' };
    } else {
        // Minor → leading-tone major (down M3)
        return { root: (chord.root - 4 + 12) % 12, quality: 'major' };
    }
}

function applyPLP(chord: Chord): Chord {
    return applyP(applyL(applyP(chord)));
}

function selectOperation(rsi: RSIProfile): 'P' | 'R' | 'L' {
    const { real, symbolic, imaginary } = rsi;
    if (real >= symbolic && real >= imaginary) return 'P';
    if (symbolic >= imaginary) return 'R';
    return 'L';
}
```

---

## 9. Distance Metrics

### 9.1 Transformation Distance

The number of PLR operations between two chords:

$$
d(C_1, C_2) = \min \{ n : \exists \text{ sequence } T_1, \ldots, T_n \text{ s.t. } T_n \circ \cdots \circ T_1(C_1) = C_2 \}
$$

### 9.2 Maximum Distances

| Relation | Distance | Example Path |
|----------|----------|--------------|
| Same chord | 0 | C → C |
| Parallel | 1 | C → Cm |
| Relative | 1 | C → Am |
| Leading-tone | 1 | C → Em |
| Tritone | 3+ | C → F♯ (via PLP) |

---

## References

Cohn, R. (1998). Introduction to Neo-Riemannian theory: A survey and 
historical perspective. *Journal of Music Theory*, 42(2), 167-180.

Lewin, D. (1987). *Generalized musical intervals and transformations*. 
Yale University Press.

McKenney, J. (2025). Neo-Riemannian operations in psychometric harmony. 
*OXOT Research*, RSCH-39.

Riemann, H. (1880). *Skizze einer neuen Methode der Harmonielehre*. 
Breitkopf & Härtel.

---

← [12_LYAPUNOV_STABILITY](./12_LYAPUNOV_STABILITY.md) | 
[Next: 14_TENSOR_OPERATIONS →](./14_TENSOR_OPERATIONS.md)
