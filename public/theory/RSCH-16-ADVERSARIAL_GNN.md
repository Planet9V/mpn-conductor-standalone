# Adversarial Robustness in Graph Neural Networks
## Graph Purification as a Digital Immune System

**Date:** December 27, 2025
**Document ID:** RSCH-16-ADVERSARIAL_GNN
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
We address the vulnerability of Graph Neural Networks (GNNs) to **Structural Poisoning Attacks** (e.g., *Nettack*, *Metattack*), where an adversary injects perturbations (fake edges) into the topology to fool the classifier. We propose a **Graph Purification Defense** inspired by **Negative Selection** in biological immune systems. By learning the "Manifold of Normality" using a variational autoencoder, we prune edges that violate homophily constraints ($A_{ij}=0$ if $sim(h_i, h_j) < \epsilon$).

### 1. The Adversarial Objective
The attacker seeks a perturbed adjacency matrix $A'$ that maximizes classification error:
$$ \max_{A'} \mathcal{L}(f_{\theta}(A', X), Y) \quad \text{s.t.} \quad \|A' - A\|_0 \le \Delta $$
Where $\Delta$ is the budget of fake edges (e.g., adding a few "Admin" connections to a malicious user).

### 2. The Immune Response: Graph Purification
We employ a **Self-Supervised Defense**.
1.  **Representation Learning**: We train a GNN to map nodes to a latent space $Z$.
2.  **Affinity Calculation**: We compute the similarity matrix $S_{ij} = \cos(z_i, z_j)$.
3.  **Purification**: We update the graph structure:
    $$ A_{new} = A_{obs} \odot \mathbb{I}(S_{ij} > \tau) $$
    This effectively "lyses" (destroys) the fake edges that do not match the semantic affinity of the nodes.

### 3. AEON Core Application
Agent Blue runs a continuous background process:
*   **Antigen Presentation**: Every new connection (Edge) is evaluated against the manifold.
*   **T-Cell Response**: If a connection is structurally anomalous (e.g., a Printer connecting to a Database via an admin port), it is pruned *before* the message passing aggregation step occurs.
*   **Result**: The GNN becomes robust to adversarial structural noise.

### References
1.  Zügner, D., et al. (2018). *Adversarial Attacks on Neural Networks for Graph Data*. KDD.
2.  Jin, W., et al. (2020). *Graph Structure Learning for Robust Graph Neural Networks*.
3.  Forrest, S., et al. (1994). *Self-Nonself Discrimination in a Computer Security System*.
