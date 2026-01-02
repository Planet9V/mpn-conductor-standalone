# Deep Learning on Attack Graphs
## Gated Graph Neural Networks (GGNN) for Exploit Prediction

**Date:** December 27, 2025
**Document ID:** RSCH-06-GGNN_ATTACK
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
This paper investigates the use of **Gated Graph Neural Networks (GGNNs)** to model vulnerability propagation in enterprise networks. Unlike static analysis, GGNNs use message-passing mechanisms (GRUs/LSTMs) to propagate "Infection State" across a graph structure over time steps. We propose using GGNNs to predict the "Most Likely Attack Path" by treating the enterprise network as a directed graph where nodes are assets and edges are lateral movement vector opportunities.

### 1. Limits of Static Attack Graphs
Traditional Attack Graphs (AG) are combinatorial explosions. If a network has $N$ nodes and $M$ vulnerabilities, the state space is $2^{N+M}$. Calculating the "shortest path to Domain Admin" is NP-hard for large dynamic networks.

### 2. The GGNN Architecture
GGNNs (Li et al., 2016) extend standard GNNs by adding a **Gated Recurrent Unit (GRU)** to the node update step. This allows the network to "remember" long-range dependencies (e.g., a vulnerability in a printer eventually leading to the DB).

The propagation rule for a node $v$ at time $t$:
1.  **Message Aggregation**:
    $$ m_v^{(t)} = \sum_{u \in \mathcal{N}(v)} W \cdot h_u^{(t-1)} $$
    The node receives "messages" (state vectors) from its neighbors.
2.  **State Update (Gating)**:
    $$ h_v^{(t)} = GRU(h_v^{(t-1)}, m_v^{(t)}) $$
    The node updates its internal state (Probability of Compromise) based on its neighbors' states.

### 3. AEON Core Application: "Neural Propagation"
In the `NeuralPhysicsView`, AEON visualizes this propagation:
*   **Nodes**: Servers, Workstations, IoT.
*   **State ($h_v$)**: [Compromised, Vulnerable, Secure].
*   **Edges**: Firewall Rules (Allow TCP/445).

When Agent Red (The Attacker) simulates an infection on Node A, the GGNN iterates for $T$ steps (Time). If the state of the "Domain Controller" node flips to "Compromised" effectively at $T=5$, we know the "Time to Pwn" is 5 hops.

### 4. Conclusion
GGNNs allow for $O(T \times |E|)$ complexity prediction of attack paths, which is linearly scalable, unlike the exponential complexity of full graph traversal. This enables **Real-Time Risk Scoring** on the Dashboard.

### References
1.  Li, Y., Tarlow, D., et al. (2016). *Gated Graph Sequence Neural Networks*. ICLR.
2.  Zhou, Y., et al. (2020). *Automated Vulnerability Detection in Source Code Using Minimum Intermediate Representation Learning*.
3.  Scarselli, F., et al. (2009). *The Graph Neural Network Model*. IEEE Transactions on Neural Networks.
