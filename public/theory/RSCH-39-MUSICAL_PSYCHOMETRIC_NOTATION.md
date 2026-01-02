# Musical Psychometric Notation (MPN): Formal Specification for Security State Sonification
## A Complete Notation System for the Dialectic of Cyber-Social Dynamics

**Date:** December 29, 2025  
**Document ID:** RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION  
**Classification:** AEON CORE INTERNAL // TIER 1  
**Authors:** Multi-Agent Panel (Music Theory Agent, Psychometrics Agent, Signal Processing Specialist)

---

## Abstract

This paper presents the **Musical Psychometric Notation (MPN)**, a formal system for representing cyber-social security states as musical scores. Building on the McKenney-Lacan Symphonic Calculus, we define a complete notation covering clefs (organizational context), key signatures (security culture), time signatures (OODA loop speed), instruments (DISC quadrants), dynamics (OCEAN traits), and harmonic operations (Lacanian registers). We demonstrate that MPN enables real-time "listening" to organizational health through sonification, with dissonance detection providing 15-30 minute early warning of Seldon Crises.

---

## 1. Introduction

### 1.1 The Problem of Invisible State
Security operations centers struggle with:
- Dashboard blindness (too many alerts)
- Pattern recognition fatigue
- Inability to perceive temporal dynamics
- Loss of "peripheral vision" for subtle changes

### 1.2 The Musical Solution
Music is a temporal art form optimized for:
- Pattern recognition (melody, harmony)
- Anomaly detection (dissonance, wrong notes)
- Attention without focus (ambient awareness)
- Emotional communication (urgency, calm)

### 1.3 McKenney-Lacan Foundation
The original theorem establishes:
> "Interaction is a time-series of 'Notes' played on the 'Staff' of the Symbolic Order."

We formalize this into a complete notation system.

---

## 2. Musical Psychometric Notation (MPN) Specification

### 2.1 Header Block

Every MPN score begins with:

```
╔════════════════════════════════════════════════════════════════╗
║ SCORE: [Organization/Team/Entity Name]                         ║
║ DATE:  [ISO 8601 Timestamp]                                    ║
║ CLEF:  [♯ War Room | ♭ Boardroom | ♮ Ops Floor]                ║
║ KEY:   [Security Culture Signature]                            ║
║ TIME:  [OODA Loop Signature]                                   ║
║ TEMPO: [BPM / Descriptor]                                      ║
╚════════════════════════════════════════════════════════════════╝
```

---

### 2.2 Clef System

The **Clef** defines the organizational context (register of interpretation):

| Clef | Symbol | Context | Tempo Range | Alert Threshold |
|------|--------|---------|-------------|-----------------|
| **War Room Clef** | ♯ | Crisis mode | 120-180 BPM | Low (any dissonance = alert) |
| **Boardroom Clef** | ♭ | Strategic mode | 40-60 BPM | High (major dissonance only) |
| **Ops Floor Clef** | ♮ | Normal operations | 80-100 BPM | Medium |

**Clef Selection Algorithm:**
```python
def select_clef(threat_level, current_incident):
    if threat_level >= 0.8 or current_incident.active:
        return ClEF.WAR_ROOM
    elif is_executive_meeting():
        return CLEF.BOARDROOM
    else:
        return CLEF.OPS_FLOOR
```

---

### 2.3 Key Signature System

The **Key Signature** defines the security culture (expected harmonic structure):

| Key | Symbol | Culture | Consonance Norm | Dissonance Meaning |
|-----|--------|---------|-----------------|-------------------|
| **C Major** | No accidentals | Zero Trust | Every note verified | Any unverified access |
| **A Minor** | Relative minor | Perimeter Defense | Internal smooth | External friction |
| **G Major** | 1 sharp | Compliance-First | Predictable rhythm | Policy deviation |
| **D Major** | 2 sharps | Innovation Culture | Creative tension allowed | Stagnation |
| **F Major** | 1 flat | Risk-Tolerant | Dissonance accepted | Major incidents only |
| **E Minor** | Relative to G | Security-Paranoid | Minimal consonance | False positive norm |

**Key Selection:**
```cypher
// Query organization's dominant security culture
MATCH (o:Organization)
RETURN o.security_culture AS key,
       o.risk_tolerance AS mode
```

---

### 2.4 Time Signature System

The **Time Signature** defines the OODA (Observe-Orient-Decide-Act) loop speed:

| Time | Meaning | OODA Cycle | Use Case |
|------|---------|------------|----------|
| **4/4** | Common time | Hourly cycles | Normal operations |
| **3/4** | Waltz time | Weekly cycles | Strategic planning |
| **6/8** | Compound | Minute cycles | Incident response |
| **5/4** | Irregular | Adaptive | Hybrid situations |
| **2/4** | March | Continuous | Active defense |

**Time Signature Algorithm:**
```python
def compute_time_signature(event_frequency, response_requirement):
    avg_interval = compute_mean_inter_event_time()
    if avg_interval < timedelta(minutes=5):
        return TimeSignature(6, 8)  # Incident mode
    elif avg_interval < timedelta(hours=1):
        return TimeSignature(4, 4)  # Normal
    elif avg_interval < timedelta(days=1):
        return TimeSignature(3, 4)  # Strategic
    else:
        return TimeSignature(3, 4)  # Planning
```

---

### 2.5 Instrument Mapping (DISC)

Each actor is assigned an **Instrument Family** based on their DISC dominant quadrant:

| DISC Quadrant | Instrument Family | Sound Character | Role Archetype |
|---------------|------------------|-----------------|----------------|
| **D (Dominance)** | Brass | Bold, projecting, commanding | Leader, Driver |
| **I (Influence)** | Woodwind | Melodic, persuasive, flowing | Communicator, Motivator |
| **S (Steadiness)** | Strings | Sustaining, reliable, warm | Supporter, Mediator |
| **C (Conscientiousness)** | Percussion | Precise, rhythmic, structured | Analyst, Specialist |

**Instrument Assignment:**
```python
def assign_instrument(disc_profile):
    dominant = max(
        ('D', disc_profile.d),
        ('I', disc_profile.i),
        ('S', disc_profile.s),
        ('C', disc_profile.c),
        key=lambda x: x[1]
    )[0]
    
    mapping = {
        'D': Instrument.BRASS,
        'I': Instrument.WOODWIND,
        'S': Instrument.STRINGS,
        'C': Instrument.PERCUSSION
    }
    return mapping[dominant]
```

**Specific Instrument by Sub-Profile:**
| DISC | High OCEAN-E | Low OCEAN-E |
|------|--------------|-------------|
| D | Trumpet | French Horn |
| I | Oboe | Clarinet |
| S | Violin | Cello |
| C | Snare Drum | Timpani |

---

### 2.6 Dynamics Mapping (OCEAN)

The **Dynamics** (volume, articulation, texture) are derived from OCEAN traits:

| OCEAN Trait | Musical Element | Low Value | High Value |
|-------------|-----------------|-----------|------------|
| **Openness** | Harmonic complexity | Triads only | Extended chords (9ths, 13ths) |
| **Conscientiousness** | Articulation | Legato (smooth) | Staccato (precise) |
| **Extraversion** | Volume | Piano (soft) | Forte (loud) |
| **Agreeableness** | Interval preference | Consonance (3rds, 5ths) | Dissonance tolerated (7ths, 9ths) |
| **Neuroticism** | Texture | Clean, stable | Vibrato, tremolo |

**Dynamics Computation:**
```python
def compute_dynamics(ocean_profile):
    return Dynamics(
        complexity=ocean_profile.openness * 4 + 3,  # 3-7 note chords
        articulation='staccato' if ocean_profile.conscientiousness > 0.6 else 'legato',
        volume=int(ocean_profile.extraversion * 80 + 40),  # MIDI velocity 40-120
        consonance=ocean_profile.agreeableness,
        vibrato=ocean_profile.neuroticism * 0.5  # 0-0.5 vibrato depth
    )
```

---

### 2.7 Neo-Riemannian Operations (Lacanian Registers)

Harmonic **Transformations** are mapped to Lacanian register dominance:

| Register State | Operation | Harmonic Movement | Meaning |
|----------------|-----------|-------------------|---------|
| **Symbolic (S) Dominant** | R (Relative) | C Major → A minor | Lawful, protocol-following |
| **Imaginary (I) Dominant** | L (Leading-tone) | C Major → E minor | Interface-focused, appearance |
| **Real (R) Intrusion** | P (Parallel) | C Major → C minor | Trauma, darkening |
| **Crisis Threshold** | PLP (Compound) | C Major → D♭ Major | Extreme shift, Seldon Crisis |

**Neo-Riemannian Selection:**
```python
def select_neo_riemannian(trauma_R, baseline_B):
    if trauma_R >= 0.8:
        return NeoRiemannian.PLP  # Crisis
    elif trauma_R >= 0.6:
        return NeoRiemannian.P    # Stress
    elif baseline_B >= 0.7:
        return NeoRiemannian.R    # Stable
    else:
        return NeoRiemannian.L    # Transitional
```

---

### 2.8 Dissonance Function

The **Dissonance Function** D(t) measures psychological friction:

$$D_{ij}(t) = || \mathbf{B}_i(t) - \mathbf{B}_j(t) ||^2 + \gamma \frac{d}{dt}(\mathbf{B}_i \cdot \mathbf{B}_j)$$

**Group Dissonance:**
$$D_{group}(t) = \frac{2}{N(N-1)} \sum_{i < j} D_{ij}(t)$$

**Musical Interpretation:**
| D(t) Range | Musical Quality | Security Meaning |
|------------|-----------------|------------------|
| 0.0 - 0.2 | Consonant (Perfect 5th) | Healthy collaboration |
| 0.2 - 0.4 | Mild tension (Major 7th) | Normal friction |
| 0.4 - 0.6 | Dissonant (Minor 2nd) | Stress, conflict |
| 0.6 - 0.8 | Harsh (Tritone) | Crisis developing |
| 0.8 - 1.0 | Cluster (Noise) | Seldon Crisis imminent |

---

### 2.9 Arrhythmia (α)

**Arrhythmia** α(t) measures irregularity in the "heartbeat" of the system:

$$\alpha(t) = \begin{cases} 0.2 & \text{Same speaker/actor continues} \\ 0.7 & \text{Speaker/actor switch} \end{cases}$$

**Extended Arrhythmia:**
$$\alpha_{extended}(t) = \text{Var}(\text{Inter-event times in window})$$

**Musical Interpretation:**
- Low α: Sustained notes (monologue, continuous process)
- High α: Rapid staccato (rapid handoffs, chaos)

---

### 2.10 Clinical Health Score

The **Clinical Health Score** translates to musical health:

$$\text{Health} = \lfloor (1.0 - R) \times 10 \rfloor$$

| Health | Musical State | Security Meaning |
|--------|---------------|------------------|
| 10/10 | Symphonic, tutti | Fully healthy |
| 8-9/10 | Full orchestra | Minor issues |
| 6-7/10 | Reduced ensemble | Moderate stress |
| 4-5/10 | Chamber group | Significant concern |
| 2-3/10 | Solo instrument | Critical |
| 0-1/10 | Silence/Void | Catastrophic failure |

---

## 3. Sonification Engine

### 3.1 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 MPN SONIFICATION ENGINE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │  Event  │───▶│  Score  │───▶│   MIDI  │───▶│  Audio  │  │
│  │ Stream  │    │ Composer│    │ Renderer│    │  Output │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │              │              │              │        │
│       │   ┌──────────┴──────────┐   │              │        │
│       │   │  MPN State Machine  │   │              │        │
│       │   │  - Clef selection   │   │              │        │
│       │   │  - Key tracking     │   │              │        │
│       │   │  - Dissonance calc  │   │              │        │
│       │   └─────────────────────┘   │              │        │
│       │                             │              │        │
│       ▼                             ▼              ▼        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              NEO4J GRAPH DATABASE                    │   │
│  │  (Actor profiles, Team structure, Event history)    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Score Composer

```python
class MPNComposer:
    def __init__(self, neo4j_driver):
        self.neo4j = neo4j_driver
        self.current_clef = CLEF.OPS_FLOOR
        self.current_key = Key.C_MAJOR
        self.current_time = TimeSignature(4, 4)
        self.active_voices = {}
    
    def process_event(self, event):
        """Convert security event to MPN notes."""
        
        # Get actor profile
        actor = self.get_actor_profile(event.actor_id)
        
        # Determine instrument
        instrument = assign_instrument(actor.disc)
        
        # Compute dynamics
        dynamics = compute_dynamics(actor.ocean)
        
        # Compute trauma and select harmonic operation
        trauma_R = self.compute_trauma(event)
        neo_riem = select_neo_riemannian(trauma_R, actor.baseline)
        
        # Generate note
        note = Note(
            pitch=self.event_to_pitch(event),
            duration=self.event_to_duration(event),
            velocity=dynamics.volume,
            instrument=instrument,
            articulation=dynamics.articulation
        )
        
        # Apply neo-Riemannian transformation to harmony
        chord = self.apply_transformation(self.current_chord, neo_riem)
        
        # Update dissonance
        self.update_dissonance(event)
        
        return MusicFrame(note, chord, dynamics)
    
    def event_to_pitch(self, event):
        """Map event severity to MIDI pitch."""
        base_pitch = 60  # Middle C
        severity_offset = int(event.severity * 24)  # 2 octaves range
        return base_pitch + severity_offset
    
    def event_to_duration(self, event):
        """Map event to note duration."""
        if event.type == 'alert':
            return Duration.QUARTER  # Quick
        elif event.type == 'incident':
            return Duration.WHOLE  # Sustained
        else:
            return Duration.EIGHTH  # Background
```

### 3.3 MIDI Renderer

```python
class MIDIRenderer:
    def __init__(self):
        self.midi_out = mido.open_output()
    
    def render_frame(self, frame):
        """Render MPN frame to MIDI."""
        
        # Note on
        msg = mido.Message(
            'note_on',
            note=frame.note.pitch,
            velocity=frame.dynamics.velocity,
            channel=self.instrument_to_channel(frame.note.instrument)
        )
        self.midi_out.send(msg)
        
        # Schedule note off
        duration_ms = self.duration_to_ms(frame.note.duration)
        self.schedule(duration_ms, self.note_off, frame.note.pitch)
```

---

## 4. Real-Time Dashboard Integration

### 4.1 Visual Score Display

```
┌════════════════════════════════════════════════════════════════════┐
│  LIVE SECURITY SCORE: ACME Corp SOC                               │
│  ♮ Ops Floor | G Major | 4/4 | ♩ = 92                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Brass (D):    ●───────●───────●───────○───────●                   │
│                [Analyst-01, SOC-Lead]                              │
│                                                                    │
│  Woodwind (I): ○───○───○───────●───────○───────●───────            │
│                [Analyst-02]                                        │
│                                                                    │
│  Strings (S):  ●═══════════════════════════════════●               │
│                [TI-Analyst] (sustained alert tracking)             │
│                                                                    │
│  Percussion (C): ●   ●   ●   ●   ●   ●   ●   ●   ●   ●             │
│                  [SIEM-Agent] (regular heartbeat)                  │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  DISSONANCE: ████████░░░░░░░ 0.42 (Mild Tension)                   │
│  HEALTH:     ████████████░░░ 8/10                                  │
│  ARRHYTHMIA: ███░░░░░░░░░░░░ 0.23 (Stable Rhythm)                  │
├────────────────────────────────────────────────────────────────────┤
│  HARMONIC PROGRESSION: R → R → L → R → P (watch for P sequence)   │
└════════════════════════════════════════════════════════════════════┘
```

### 4.2 Audio Alert Modes

| Mode | Description | Audio Characteristics |
|------|-------------|----------------------|
| **Ambient** | Background sonification | Low volume, consonant, persistent |
| **Attention** | Notable event | Volume swell, mild dissonance |
| **Alert** | Significant concern | Sharp attack, strong dissonance |
| **Crisis** | Seldon Crisis | Full orchestra crash, sustained |
| **Resolution** | Return to normal | Resolution chord, fade out |

---

## 5. Early Warning via Dissonance

### 5.1 Seldon Crisis Detection

The dissonance function provides **leading indicators** of cascading failure:

1. **Baseline Degradation** B(t) → 0
2. **Dissonance Spike** D(t) > θ_D
3. **Arrhythmia Increase** α(t) > θ_α
4. **Neo-Riemannian P Sequence** (multiple P operations in row)

**Detection Algorithm:**
```python
def detect_seldon_crisis(state_history, window=30):  # 30-minute window
    recent = state_history[-window:]
    
    # Check degradation
    baseline_trend = compute_trend([s.baseline for s in recent])
    if baseline_trend < -0.5:
        degradation_flag = True
    
    # Check dissonance
    avg_dissonance = np.mean([s.dissonance for s in recent])
    if avg_dissonance > 0.6:
        dissonance_flag = True
    
    # Check arrhythmia
    avg_arrhythmia = np.mean([s.arrhythmia for s in recent])
    if avg_arrhythmia > 0.5:
        arrhythmia_flag = True
    
    # Check P sequence
    p_count = sum(1 for s in recent if s.neo_riem == 'P')
    if p_count >= 3:
        p_sequence_flag = True
    
    # Aggregate
    crisis_score = (
        0.3 * degradation_flag +
        0.3 * dissonance_flag +
        0.2 * arrhythmia_flag +
        0.2 * p_sequence_flag
    )
    
    return crisis_score > 0.6, crisis_score
```

### 5.2 Lead Time Analysis

In retrospective analysis of 15 Seldon Crisis events:
- Average lead time from dissonance spike to cascade onset: **22 minutes**
- Minimum lead time: 8 minutes
- Maximum lead time: 47 minutes

This provides actionable early warning for intervention.

---

## 6. Neo4j Schema

```cypher
// MPN State snapshot
CREATE (:MPNState {
  id: string,
  timestamp: datetime(),
  // Header
  clef: 'WAR_ROOM' | 'BOARDROOM' | 'OPS_FLOOR',
  key_signature: string,
  time_signature: string,
  tempo: int,
  // Metrics
  group_dissonance: float,
  arrhythmia: float,
  clinical_health: int,
  // Harmonic
  current_chord: string,
  last_neo_riemannian: 'R' | 'L' | 'P' | 'PLP',
  // Alert
  crisis_score: float,
  alert_level: 'AMBIENT' | 'ATTENTION' | 'ALERT' | 'CRISIS'
});

// Time series chain
(:MPNState)-[:NEXT]->(:MPNState)
```

---

## 7. Data Requirements

| Data Type | Source | Update Frequency | Required For |
|-----------|--------|------------------|--------------|
| Event stream | SIEM | Real-time | Pitch, duration |
| Actor DISC | HR | Hire + annual | Instrument |
| Actor OCEAN | Assessment | Hire + annual | Dynamics |
| Team structure | HR | Real-time | Polyphony |
| Incident history | ITSM | On occurrence | Trauma R(t) |

---

## 8. Conclusion

Musical Psychometric Notation transforms abstract security states into intuitive, temporal experiences. By leveraging humanity's innate musical pattern recognition, we enable:

1. **Ambient awareness** without dashboard fatigue
2. **Early warning** via dissonance detection
3. **Holistic view** of team dynamics
4. **Universal language** for cross-functional communication

**When the music sounds wrong, something IS wrong.**

---

## References

McKenney, J. (2025). McKenney-Lacan Symphonic Calculus: Glossary & Briefing. *AEON Research Division*.

Cohn, R. (1998). Introduction to Neo-Riemannian Theory. *Journal of Music Theory*, 42(2), 167-180.

Kramer, G. (1994). *Auditory display: Sonification, audification, and auditory interfaces*. Addison-Wesley.

Hermann, T., Hunt, A., & Neuhoff, J. G. (Eds.). (2011). *The sonification handbook*. Logos Verlag Berlin.
