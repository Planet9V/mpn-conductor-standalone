# The Seven-Staff Score: Engineering Specification for Multi-Layered Sonification

**Document Type:** Application Specification
**For:** MPN Engine v3.0
**Dependency:** RSCH-41-SEVEN_STAFF_FUGUE.md (Theory)

---

## 1. Objective

Extend the MPN Engine to output a 7-Staff MIDI/MusicXML score, where each staff represents an architectural layer (L0-L6). This enables the "Conductor" (AI or Analyst) to perceive the cyber-social state as a polyphonic orchestral texture rather than a single monophonic line.

---

## 2. Staff-to-Layer Mapping

| Staff # | Layer | MIDI Channel | GM Instrument (Default) | Note Range (MIDI) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | L0 Catalog | 1 | 33 (Acoustic Bass) | C1-C3 (24-48) |
| 2 | L1 Equipment | 2 | 42 (Cello) | C2-C4 (36-60) |
| 3 | L2 SBOM | 3 | 70 (Bassoon) | C3-C5 (48-72) |
| 4 | L3 Threats | 4 | 71 (Clarinet) | C4-C6 (60-84) |
| 5 | L4 Psychology | 5 | 73 (Flute) | C5-C7 (72-96) |
| 6 | L5 Info Streams | 6 | 9 (Glockenspiel) | C6-C8 (84-108) |
| 7 | L6 Predictions | 7 | 88 (Pad Sweep) | C5-C7 (72-96), Sparse |

---

## 3. Data Flow

```
+-------------------+      +-------------------+      +-------------------+
|   Event Stream    | ---> |   Layer Router    | ---> |   Staff Scorers   |
| (SIEM, HR, NLP)   |      |   (Assign L0-L6)  |      |   (7x MPNCalc)    |
+-------------------+      +-------------------+      +-------------------+
                                                               |
                                                               v
                           +-----------------------------------+
                           |     Cross-Layer Harmonizer       |
                           | (Sheaf Cohomology, Pers. Homol.) |
                           +-----------------------------------+
                                                               |
                                                               v
                           +-----------------------------------+
                           |      MIDI/MusicXML Generator     |
                           |      (7-Track Polyphonic Score)  |
                           +-----------------------------------+
```

---

## 4. Temporal Context Window

Each beat is scored with a **Context Window** of `N` beats before and after.
*   **Prologue (t-N to t-1):** Calculates the "Subject" that the current beat is "Answering."
*   **Epilogue (t+1 to t+N):** (Predictive) Calculates the expected "Resolution" or "Continuation."

The **Path Integral Weight** for the current beat is:
$$ W(t) = \frac{1}{Z} \sum_{p \in \text{Paths}(t-N, t+N)} e^{-S_p / T} $$
Where $S_p$ is the total "Entropy" accumulated along path $p$.

---

## 5. Visualization: State Evolution (7-Band)

The `/logic` State Evolution visual is extended:
*   The single particle cloud is replaced with **7 Horizontal Bands**.
*   Each band's color corresponds to its Layer's accent (Gray, Blue, Green, Red, Pink, Orange, Purple).
*   **Vertical Lines (Persistence Bars)** connect features that span multiple layers, rendered as "Strings" vibrating in 3D space.
*   The **Urlinie Trendline** (the Schenkerian Fundamental Descent) is superimposed as a translucent diagonal line from upper-left (Stable) to lower-right (Crisis).

---

## 6. MPN Laboratory: 13 Visualization Experiments

A dedicated `/mpn-lab` route hosts 13 parallel visualization experiments, each responding to shared control parameters (Time, Trauma, Entropy, Layer Focus). These experiments serve as cognitive prostheses for perceiving high-dimensional organizational states.

### 6.1 Conventional Experiments (1-4)
| # | Name | Technology | Theory Source |
|:--|:-----|:-----------|:--------------|
| 1 | Seven-Band Waveform | Canvas 2D | RSCH-41 |
| 2 | Tonnetz Grid | WebGL (R3F) | RSCH-39 |
| 3 | Persistence Barcode | Canvas 2D | RSCH-41 |
| 4 | 7D State Evolution | WebGL (R3F) | RSCH-40 |

### 6.2 Radical I: Topology & Dynamics (5-8)
| # | Name | Technology | Theory Source |
|:--|:-----|:-----------|:--------------|
| 5 | Borromean Knot | WebGL (R3F) | Lacanian R/S/I |
| 6 | Lorenz Attractor | WebGL (R3F) | RSCH-14 |
| 7 | Turing Patterns | Canvas 2D | Morphogenesis |
| 8 | Neural Plasma | Canvas 2D | Navier-Stokes |

### 6.3 Radical II: Neural Physics (9-13)
| # | Name | Technology | Theory Source |
|:--|:-----|:-----------|:--------------|
| 9 | Neural Propagation | Canvas 2D | RSCH-03 (GGNN) |
| 10 | Epidemic Phase | Canvas 2D | RSCH-11 |
| 11 | Tensor Hypercube | WebGL (R3F) | RSCH-37 |
| 12 | Spectral Waterfall | Canvas 2D | RSCH-39 |
| 13 | Percolation Map | Canvas 2D | RSCH-14 |

**Full Mathematical Documentation**: See `RSCH-42-VISUALIZATION_PHYSICS.md`

---

## 7. Future Work

1.  **API Endpoint (`/api/mpn/score`):** Accepts an event stream and returns a 7-track MIDI file.
2.  **Real-Time Web Audio:** Stream MIDI via WebMIDI to browser-based synthesizers.
3.  **Persistent Homology Visual Component:** A React component rendering the Barcode diagram alongside the 7-Band State Evolution.
4.  **Sonification Integration:** Connect visualization experiments to Web Audio API for auditory feedback.
5.  **VR/AR Extensions:** Immersive exploration of high-dimensional psychometric spaces.
6.  **Live MPN Engine Data:** Real-time connection to the MPN Engine for live organizational monitoring.

