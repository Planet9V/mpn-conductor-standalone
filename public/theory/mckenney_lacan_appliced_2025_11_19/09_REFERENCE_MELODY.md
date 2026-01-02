# 09. Reference: Melody
## Leitmotif and Contour Mappings

---

## Category Overview

| Property | Value |
|----------|-------|
| Category ID | `melody` |
| Entry Count | 5 |
| Primary Dimension | Trauma, Entropy, Emotion |

---

## Entry Table

| ID | Display Name | Subcategory | Psychometric Mapping |
|----|--------------|-------------|---------------------|
| melody-001 | Ascending Melody | contour | Emotion:Hope (0.85) |
| melody-002 | Descending Melody | contour | Emotion:Sadness (0.85) |
| melody-003 | Original Leitmotif | leitmotif_transformation | Trauma < 0.3 (0.9) |
| melody-004 | Inverted Leitmotif | leitmotif_transformation | Trauma > 0.6 (0.9) |
| melody-005 | Fragmented Leitmotif | leitmotif_transformation | Entropy > 0.6 (0.9) |

---

## Detailed Entries

### melody-001: Ascending Melody

**Musical Element**: Ascending Contour

**Psychometric Mapping**:
- Dimension: Emotion
- Trait: Hope/Ambition
- Strength: 0.85
- Description: Rising pitch indicates hope, growth, ambition

**Theory**:
> Ascending melodic lines create sense of aspiration and positive energy. 
> Physical metaphor: rising = improving, growing, ascending.

**Examples**: Character revelation, Victory moment, Epiphany

**Reference**: Canon Section 8

---

### melody-002: Descending Melody

**Musical Element**: Descending Contour

**Psychometric Mapping**:
- Dimension: Emotion
- Trait: Sadness/Resignation
- Strength: 0.85
- Description: Falling pitch indicates decline, sadness, resignation

**Theory**:
> Descending lines create sense of loss, decline, or resolution. 
> Physical metaphor: falling = declining, ending, gravity.

**Examples**: Loss, Death, Farewell, Defeat

**Reference**: Canon Section 8

---

### melody-003: Original Leitmotif

**Musical Element**: Original Motif

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: < 0.3
- Strength: 0.9
- Description: Normal state - motif in pure form

**Theory**:
> Actor motif presented in original form indicates stable state. 
> No transformation = no disturbance.

**Examples**: Character introduction, Normal dialogue

**Reference**: Canon Section 8

---

### melody-004: Inverted Leitmotif

**Musical Element**: Inverted Motif (mirror)

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: > 0.6
- Strength: 0.9
- Description: High trauma - mirror intervals

**Algorithm**:
```
inverted_interval = pivot_pitch - (original_pitch - pivot_pitch)
```

**Theory**:
> Motif with all intervals inverted (up becomes down). 
> Inversion represents distorted self-perception under trauma.

**Examples**: Trauma surfacing, Identity crisis, Revelation

**Reference**: Canon Section 8

---

### melody-005: Fragmented Leitmotif

**Musical Element**: Fragmented Motif (gaps)

**Psychometric Mapping**:
- Dimension: Entropy
- Condition: > 0.6
- Strength: 0.9
- Description: High entropy - notes omitted randomly

**Algorithm**:
```
keep_probability = 1 - (entropy × 0.5)
```

**Theory**:
> Motif with random notes omitted and rests inserted. 
> Fragmentation represents breakdown of coherent identity.

**Examples**: Dissociation, Chaos, Mental breakdown

**Reference**: Canon Section 8

---

## Complete Leitmotif Transformation Table

| State | Trauma | Entropy | Transformation |
|-------|--------|---------|----------------|
| Original | < 0.3 | < 0.4 | None |
| Inverted | > 0.6 | any | Mirror intervals |
| Retrograde | any | > 0.5 | Reverse note order |
| Fragmented | > 0.5 | > 0.6 | Random omission |
| Augmented | any | < 0.3 | Stretch durations |
| Diminished | > 0.4 | > 0.5 | Compress durations |

---

## Next: [10_REFERENCE_TEXTURE](./10_REFERENCE_TEXTURE.md)
