# 08. Reference: Dynamics
## Volume and Intensity Mappings

---

## Category Overview

| Property | Value |
|----------|-------|
| Category ID | `dynamics` |
| Entry Count | 6 |
| Primary Dimension | Trauma, Emotion |

---

## Entry Table

| ID | Display Name | Subcategory | Psychometric Mapping |
|----|--------------|-------------|---------------------|
| dynamics-001 | Very Soft | volume_level | Trauma 0.0-0.2 (0.9) |
| dynamics-002 | Medium | volume_level | Trauma 0.4-0.6 (0.85) |
| dynamics-003 | Very Loud | volume_level | Trauma > 0.8 (0.95) |
| dynamics-004 | Crescendo | dynamic_change | Trauma:increasing (0.9) |
| dynamics-005 | Decrescendo | dynamic_change | Trauma:decreasing (0.85) |
| dynamics-006 | Sforzando | accent | Emotion:Shock (0.95) |

---

## Volume Level Entries

### dynamics-001: Very Soft

**Musical Element**: ppp/pp (pianissimo)

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: 0.0-0.2
- Strength: 0.9
- Description: Low trauma, peace, rest

**Implementation**:
- Velocity Range: 20-45

**Adjustable**: Yes
- Default: 30
- Range: 1-45 (step: 1)

**Theory**:
> Very soft dynamics indicate peace and minimal disturbance. 
> Low energy state mirrors low trauma activation.

**Reference**: Canon Section 5

---

### dynamics-002: Medium

**Musical Element**: mf (mezzo-forte)

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: 0.4-0.6
- Strength: 0.85
- Description: Normal engagement, medium trauma

**Implementation**:
- Velocity Range: 60-85

**Adjustable**: Yes
- Default: 72
- Range: 60-85 (step: 1)

**Theory**:
> Medium dynamics for normal conversational engagement. 
> Standard activation level for dialogue.

**Reference**: Canon Section 5

---

### dynamics-003: Very Loud

**Musical Element**: fff (fortissimo)

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: > 0.8
- Strength: 0.95
- Description: Extreme trauma, crisis, explosion

**Implementation**:
- Velocity Range: 110-127

**Adjustable**: Yes
- Default: 118
- Range: 110-127 (step: 1)

**Theory**:
> Maximum dynamics indicate peak emotional/crisis state. 
> Fight-or-flight activation at maximum.

**Reference**: Canon Section 5

---

## Dynamic Change Entries

### dynamics-004: Crescendo

**Musical Element**: Crescendo (< )

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: increasing
- Strength: 0.9
- Description: Rising tension, building threat

**Theory**:
> Gradual volume increase creates mounting tension. 
> Escalation pattern mirrors threat approach.

**Reference**: Canon Section 5

---

### dynamics-005: Decrescendo

**Musical Element**: Decrescendo (> )

**Psychometric Mapping**:
- Dimension: Trauma
- Condition: decreasing
- Strength: 0.85
- Description: Fading tension, withdrawal

**Theory**:
> Gradual volume decrease indicates resolution or retreat. 
> De-escalation pattern.

**Reference**: Canon Section 5

---

## Accent Entries

### dynamics-006: Sforzando

**Musical Element**: Sforzando (sfz)

**Psychometric Mapping**:
- Dimension: Emotion
- Trait: Shock/Trigger
- Strength: 0.95
- Description: Sudden impact, traumatic trigger

**Theory**:
> Sudden loud accent creates startle response. 
> Mimics sudden trauma activation.

**Reference**: Canon Section 5

---

## Complete Trauma-Dynamics Mapping

| Trauma Range | Marking | Velocity | Label |
|--------------|---------|----------|-------|
| 0.0 - 0.1 | ppp | 20 | pianississimo |
| 0.1 - 0.2 | pp | 30-45 | pianissimo |
| 0.2 - 0.3 | p | 45-55 | piano |
| 0.3 - 0.5 | mp | 55-70 | mezzo-piano |
| 0.5 - 0.6 | mf | 70-85 | mezzo-forte |
| 0.6 - 0.7 | f | 85-95 | forte |
| 0.7 - 0.85 | ff | 95-110 | fortissimo |
| 0.85 - 1.0 | fff | 110-127 | fortississimo |

---

## Next: [09_REFERENCE_MELODY](./09_REFERENCE_MELODY.md)
