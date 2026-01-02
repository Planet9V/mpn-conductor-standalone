# 05. Reference: Timbre
## Instrument and Tone Color Mappings

---

## Category Overview

| Property | Value |
|----------|-------|
| Category ID | `timbre` |
| Entry Count | 9 |
| Primary Dimension | DISC, Dark Triad |

---

## Entry Table

| ID | Display Name | Subcategory | Psychometric Mapping |
|----|--------------|-------------|---------------------|
| timbre-001 | Brass Family | instrument_family | DISC:D (0.9) |
| timbre-002 | Woodwind Family | instrument_family | DISC:I (0.85) |
| timbre-003 | String Family | instrument_family | DISC:S (0.9) |
| timbre-004 | Keyboard Family | instrument_family | DISC:C (0.85) |
| timbre-005 | Machiavellian Timbre | timbre_modulation | DarkTriad:Mach (0.95) |
| timbre-006 | Narcissistic Timbre | timbre_modulation | DarkTriad:Narc (0.9) |
| timbre-007 | Psychopathic Timbre | timbre_modulation | DarkTriad:Psych (0.95) |
| timbre-008 | High Register | register | Lacanian:Symbolic (0.7) |
| timbre-009 | Low Register | register | Lacanian:Real (0.8) |

---

## Detailed Entries

### timbre-001: Brass Family

**Musical Element**: Brass (Trumpet, Trombone, Horn)

**Psychometric Mapping**:
- Dimension: DISC
- Trait: D (Dominance)
- Strength: 0.9
- Description: Bold, commanding, penetrating sound reflects Dominance

**Implementation**:
- MIDI Range: 56-63 (GM Brass)
- Frequency Range: 200-2000 Hz

**Theory**:
> Brass instruments produce bold, penetrating tones that naturally 
> command attention. The physical properties of brass vibration create 
> sound waves that cut through orchestral texture, mirroring assertive 
> personality traits.

**Reference**: RSCH-40

---

### timbre-002: Woodwind Family

**Musical Element**: Woodwinds (Flute, Clarinet, Oboe)

**Psychometric Mapping**:
- Dimension: DISC
- Trait: I (Influence)
- Strength: 0.85
- Description: Expressive, soaring melodies reflect Influence

**Implementation**:
- MIDI Range: 72-79

**Theory**:
> Woodwinds produce warm, singing tones ideal for expressive melodies. 
> The breath-driven nature creates human-like phrasing that connects 
> emotionally.

**Reference**: RSCH-40

---

### timbre-003: String Family

**Musical Element**: Strings (Violin, Viola, Cello)

**Psychometric Mapping**:
- Dimension: DISC
- Trait: S (Steadiness)
- Strength: 0.9
- Description: Warm, sustained tones reflect Steadiness

**Implementation**:
- MIDI Range: 40-52

**Theory**:
> Strings provide the emotional foundation of the orchestra. 
> Continuous bow technique allows infinite sustain, representing stability.

**Reference**: RSCH-40

---

### timbre-004: Keyboard Family

**Musical Element**: Keyboard (Piano, Harp, Celesta)

**Psychometric Mapping**:
- Dimension: DISC
- Trait: C (Compliance)
- Strength: 0.85
- Description: Precise, measured tones reflect Compliance

**Implementation**:
- MIDI Range: 0-8

**Theory**:
> Keyboard instruments offer precise pitch and dynamic control. 
> Equal temperament and mechanical action provide analytical clarity.

**Reference**: RSCH-40

---

### timbre-005: Machiavellian Timbre

**Musical Element**: Muted/Subversive (-10 cents)

**Psychometric Mapping**:
- Dimension: Dark Triad
- Trait: Machiavellianism
- Condition: > 0.5
- Strength: 0.95
- Description: Slightly flat, muted sound suggests hidden agenda

**Implementation**:
- ADSR: A=0.3, D=0.2, S=0.8, R=0.5

**Adjustable**: Yes
- Default: -10 cents
- Range: -25 to 0 cents

**Theory**:
> Detuning and muting create an unsettling, manipulative quality. 
> The subtle wrongness mirrors psychological manipulation.

**Reference**: RSCH-40

---

### timbre-006: Narcissistic Timbre

**Musical Element**: Overpowering/Brittle (+5 cents)

**Psychometric Mapping**:
- Dimension: Dark Triad
- Trait: Narcissism
- Condition: > 0.5
- Strength: 0.9
- Description: Loud, ignores ensemble, slightly sharp

**Implementation**:
- ADSR: A=0.0, D=0.1, S=1.0, R=0.0
- Velocity Range: 100-127

**Adjustable**: Yes
- Default: +5 cents
- Range: 0 to +25 cents

**Theory**:
> Narcissism manifests as dominating the sonic space without regard 
> for others. Self-aggrandizement expressed through volume and pitch 
> elevation.

**Reference**: RSCH-40

---

### timbre-007: Psychopathic Timbre

**Musical Element**: Cold/Mechanical (no vibrato)

**Psychometric Mapping**:
- Dimension: Dark Triad
- Trait: Psychopathy
- Condition: > 0.5
- Strength: 0.95
- Description: Staccato, no vibrato, instant attack/decay

**Implementation**:
- ADSR: A=0.0, D=0.5, S=0.0, R=0.1

**Theory**:
> Absence of musical expression mirrors emotional flatness. 
> Lack of vibrato and legato suggests absence of empathy.

**Reference**: RSCH-40

---

### timbre-008: High Register

**Musical Element**: High Register (2048-4096+ Hz)

**Psychometric Mapping**:
- Dimension: Lacanian
- Trait: Symbolic
- Strength: 0.7
- Description: Upper frequencies suggest authority and vision

**Implementation**:
- Frequency Range: 2048-8000 Hz

**Theory**:
> High register carries symbolic authority and prophetic voice. 
> Physically higher = socially higher in many cultures.

**Reference**: RSCH-41

---

### timbre-009: Low Register

**Musical Element**: Low Register (16-256 Hz)

**Psychometric Mapping**:
- Dimension: Lacanian
- Trait: Real
- Strength: 0.8
- Description: Bass frequencies suggest the unconscious, threat, foundation

**Implementation**:
- Frequency Range: 16-256 Hz

**Theory**:
> Low register represents the Real - what lies beneath consciousness. 
> Infrasound affects body before mind, like trauma.

**Reference**: RSCH-41

---

## Next: [06_REFERENCE_RHYTHM](./06_REFERENCE_RHYTHM.md)
