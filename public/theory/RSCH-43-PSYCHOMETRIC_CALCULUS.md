# RSCH-43: The Psychometric Calculus (Experiment 9)

**Date**: 2025-12-31
**Status**: Implemented
**Component**: `MPNExperiment_NeuralPropagation.tsx`
**Dependencies**: `psychometric_calculus.ts`, `graph_topology_engine.ts`

---

## 1. Abstract

The Psychometric Calculus is a unified mathematical framework that translates **Musical Psychometric Notation (MPN)** directly into **3D Force-Directed Graph Physics**.

It solves the "Semantic Gap" between the literary analysis of a script (Hamlet, Oedipus) and the visual behavior of the neural graph. Instead of using random motion or generic physics, the graph is now driven by the exact same "Score" that drives the audio engine, creating a perfect synesthetic bond between sound, text, and visual topology.

## 2. Core Architecture

The system relies on two new dedicated engines that sit between the `ScenarioDriver` and the `Canvas`.

### A. The Calculus Bridge (`psychometric_calculus.ts`)
This utility parses the **Musical Data** of the script frame to generate raw physics vectors.

*   **Input**: `script.chord` (e.g., "Tritone", "C Major"), `script.analysis` (e.g., "The Real ruptures...").
*   **Vector 1: Tension (Dissonance)**
    *   *Logic*: Maps musical intervals to `0.0 - 1.0` scalar.
    *   *Mapping*: Major Third = 0.1 (Stable), Tritone = 0.9 (Unstable), Cluster = 1.0 (Crisis).
    *   *Physics Effect*: Increases **Repulsion** between nodes (Social Fabric tearing) and **Entropy** (Jitter/Heat).
*   **Vector 2: Libido (Dynamics)**
    *   *Logic*: Maps volume/intensity (`ff`, `pp`, `Tutti`) to energy.
    *   *Physics Effect*: Controls the **Size** and **Glow Intensity** of the active Speaker node.
*   **Vector 3: Lacanian Attractors**
    *   *Logic*: Keyword scanning of the `analysis` text.
    *   *Keywords*: "Real" (Red), "Symbolic" (Gold), "Imaginary" (Blue).
    *   *Physics Effect*: Exerts a **Directional Force**, pulling the Speaker towards specific fixed poles in the 3D space (e.g., Macbeth is physically dragged towards the "Real" during his hallucination).

### B. The Topology Engine (`graph_topology_engine.ts`)
This engine enables the graph to be **Script-Aware** of relationships, rather than just random.

*   **Pre-Computation**: On scenario load, it scans *every frame* of the script.
*   **Edge Detection**:
    1.  **Explicit Address**: "Hamlet: Go, Horatio." -> Creates Edge(Hamlet, Horatio).
    2.  **Implicit Reference**: "Hamlet: ...the poor wretch (Ophelia)..." -> Creates Edge(Hamlet, Ophelia).
    3.  **Tension Bonds**: If `Tension > 0.6`, the edge is flagged as a "Stress Bond" (Visualized differently).
*   **Result**: A time-series list of `activeEdges` for every moment of the play.

## 3. Visualization Logic

The `MPNExperiment_NeuralPropagation` component renders this math in real-time (60fps).

### The Node (The Subject)
*   **Identity**: Each node is a specific cast member (Hamlet, Ghost, etc.).
*   **Behavior**:
    *   **Rest**: Blue, small, stable.
    *   **Speaking**: Pulses Gold (Symbolic Authority).
    *   **Trauma**: Vibrates violently, flees the center.
    *   **Attraction**: drifts towards the "Real" or "Imaginary" zones based on the text.

### The Edge (The Social Link)
*   Edgework is no longer static. It breathes.
*   **Formation**: Edges appear only when characters interact or think of one another.
*   **Destruction**: Connections dissolve when the script focus changes, leaving the subject isolated (e.g., Hamlet's "The rest is silence").

## 4. Traceability & Files

| Component | Path | Function |
| :--- | :--- | :--- |
| **Main Visualization** | `src/components/mpn-lab/MPNExperiment_NeuralPropagation.tsx` | R3F Canvas, Render Loop, HTML Labels |
| **Physics Math** | `src/components/mpn-lab/psychometric_calculus.ts` | Translates Music/Text -> Physics Forces |
| **Graph Structure** | `src/components/mpn-lab/graph_topology_engine.ts` | Translates Narrative -> Edge Connections |
| **Literary Data** | `src/components/mpn-lab/literary_data.ts` | The Source of Truth (Hamlet, Oedipus, Macbeth) |

## 5. Conclusion

Experiment 9 is now a **Dynamic Psychometric Simulator**. It does not just "show" the data; it **enacts** the psychoanalytic drama of the script through the laws of physics, proving that "The Unconscious is structured like a Language"—and now, like a Graph.
