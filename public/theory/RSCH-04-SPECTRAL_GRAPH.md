# Spectral Analysis of Network Robustness
## Eigenvalues and the Mathematical Limit of Propagation

**Date:** December 27, 2025
**Document ID:** RSCH-04-SPECTRAL_GRAPH
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
This paper expands on the Epidemic R0 model by focusing specifically on the **Spectral Radius** ($\rho(A) = \lambda_{max}$) of the network adjacency matrix. We explore the theorem that virus extinction is guaranteed if the effective infection rate is less than the reciprocal of the spectral radius. We apply this to "Hub Removal" strategies in cybersecurity, arguing that targeted segmentation of high-degree nodes (eigenvectors) is the most efficient defense strategy.

### 1. The Adjacency Matrix and Eigenvalues
Let $G = (V, E)$ be a graph representing the IT infrastructure. $A$ is the adjacency matrix where $A_{ij} = 1$ if nodes $i$ and $j$ are connected, else $0$.
The eigenvalues $\lambda_1 \ge \lambda_2 \ge ... \ge \lambda_n$ of $A$ define the **Spectrum** of the graph.

#### 1.1 The Spectral Radius ($\lambda_{max}$)
For a connected graph, $\lambda_{max}$ describes the **destructiveness** of the graph topology regarding propagation.
*   **Star Network** (Hub & Spoke): $\lambda_{max} = \sqrt{N-1}$ (Very High). A hub is a super-spreader.
*   **Path Graph** (Daisy Chain): $\lambda_{max} < 2$ (Very Low). Propagation is slow.

### 2. The Extinction Condition
The critical threshold for global pandemic on a network is:
$$ \tau < \frac{1}{\lambda_{max}} $$
Where $\tau$ is the effective transmission probability per edge.
If we can manipulate the network such that $\lambda_{max}$ decreases, we effectively vaccinate the network without touching the endpoints.

### 3. AEON Core Application: Eigen-Centrality Pruning
AEON's "Neural Physics" engine computes the eigenvector centrality $x$ of all nodes:
$$ Ax = \lambda_{max}x $$
Nodes with high centrality scores (large components in eigenvector $x$) are the "Seldon Points"—the critical failures.
*   **Action**: Agent Blue dynamically "cuts" edges (blocks ports) on high-centrality nodes during an outbreak. This lowers $\lambda_{max}$ below the critical threshold, forcing the math to kill the virus.

### 4. Conclusion
Spectral Graph Theory provides the *proof* for why network segmentation works. It moves the conversation from "compliance" to "physics". We do not segment to satisfy an auditor; we segment to lower the spectral radius.

### References
1.  Van Mieghem, P. (2011). *Graph Spectra for Complex Networks*.
2.  Wang, Y., et al. (2003). *Epidemic Spreading in Real Networks: An Eigenvalue Viewpoint*.
3.  Preciado, V. M., et al. (2013). *Optimal Resource Allocation for Network Protection*.
