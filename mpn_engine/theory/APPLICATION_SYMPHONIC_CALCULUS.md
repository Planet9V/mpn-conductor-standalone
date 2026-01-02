# The Symphonic Calculus: Engineering the Digital Twin of the Unconscious

**Technical Implementation Report**
**System**: MPN Engine v2.1
**Module**: Core Calculus & Signal Processing

---

## 1. System Architecture
The application of the **McKenney-Lacan Theory** requires a rigid, high-throughput pipeline capable of ingesting raw unstructured text and outputting structured musical data. The system is designed as a three-stage transducer.

### Stage I: The Signal Processor (Input)
The entry point is the **Digital Librettist** (`dialogue_parser.py`).
*   **Normalization**: Raw text is stripped of non-diegetic noise (stage directions, timestamps) unless they contribute to the entropy calculation.
*   **Speaker Diarization**: The engine identities the "Voice" distinct from the "Chorus" (Narrator).
*   **Psychometric Parsing**:
    *   **Level 1**: Keyword Density Scan (Legacy).
    *   **Level 2**: NER Vector Analysis (via `ner11-gold-api`). The system detects high-level constructs (`COGNITIVE_BIAS`, `THREAT_MODELING`) and assigns them a "Mass" value.

### Stage II: The Calculus Engine (Throughput)
The core logic (`mpn_calculus.py`) operates as a state machine. It maintains a persistent "Global Tonal Center" while calculating the delta for each discrete Beat.

#### The Trauma Loop
For every beat $t$:
1.  Calculate discrete trauma $r_t$ from text entity mass.
2.  Update global trauma $\mathcal{R}_t = \mathcal{R}_{t-1} + (r_t \cdot \alpha)$ where $\alpha$ is the persistence decay factor.
3.  **Threshold Check**:
    *   IF $\mathcal{R}_t > 0.8$: Trigger `PLP` subroutine.
    *   IF $\mathcal{R}_t > 0.6$: Trigger `P` subroutine.
    *   ELSE: Maintain harmonic orbit.

#### The Entropy Regulator
Entropy $\mathcal{H}$ serves as the system clock.
*   Standard Clock: 120 BPM.
*   The `time_dilation` factor means that a high-entropy conversation effectively contains *more music* per wall-clock second than a low-entropy one. The data becomes dense.

### Stage III: SONIFICATION (Output)
The data is rendered into two concurrent streams:

1.  **The Score (MusicXML)**:
    *   Intended for the **Analyst**.
    *   Visualizes the "Trauma Spikes" as dense clusters of accidentals (sharps/flats).
    *   The "Key Signature" serves as a visual health bar for the document.

2.  **The Audio (MIDI)**:
    *   Intended for the **Observer**.
    *   Velocity (Volume) controls the "Urgency."
    *   The engine utilizes the **General MIDI** bank to assign voices. Ideally, a "Strings" ensemble is used for its continuous, breath-like quality, allowing the `arrhythmia` (gaps in sound) to be felt viscerally.

## 2. Performance Benchmarks
*   **Throughput**: ~17 Beats/Second (on `Oedipus Rex` dataset).
*   **Latency**: < 100ms per NER call.
*   **Scalability**: The system is stateless per-beat relative to the previous beat, allowing for unlimited stream length (Continuous Monitoring).

## 3. Future Engineering Vectors
*   **Real-Time WebSocket Stream**: Direct pipe from the "War Room" chat into the MPN Engine, generating a live soundtrack to an active cyber-incident.
*   **Discordance Alerting**: Triggering a pager alert not when a keyword is found, but when the *harmonic complexity* of the team's communication exceeds a defined threshold (e.g., "The team has modulated to F# Minor; intervention required").
