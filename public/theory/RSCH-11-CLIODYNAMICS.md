# Heterogeneous Graph Attention Networks (HAN) in IAM
## Meta-Path Based Privilege Analysis for Zero Trust

**Date:** December 27, 2025
**Document ID:** RSCH-11-HAN_PRIVILEGE
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
We propose a **Heterogeneous Graph Attention Network (HAN)** to classify nodes in a privilege graph. Unlike simple "Cliodynamics", which treats "Elites" as a scalar, we model the IAM infrastructure as a graph $\mathcal{G} = (\mathcal{V}, \mathcal{E})$ with multiple node types (User, ServicePrincipal, Device). We define a set of meta-paths $\Phi$ (e.g., User $\to$ Role $\to$ Resource) and compute the attention coefficients $\alpha_{ij}^{\Phi}$ to learn the "Semantic Importance" of each privilege escalation path.

### 1. Mathematical Formulation
Let $h_i$ be the feature vector of node $i$. For a specific meta-path $\Phi$, the node-level attention is:
$$ e_{ij}^{\Phi} = \text{Attn}(h_i, h_j; \Phi) $$
$$ \alpha_{ij}^{\Phi} = \text{softmax}_j(e_{ij}^{\Phi}) $$
The embedding of node $i$ under path $\Phi$ is aggregating neighbor features:
$$ z_i^{\Phi} = \sigma \left( \sum_{j \in \mathcal{N}_i^{\Phi}} \alpha_{ij}^{\Phi} \cdot h_j \right) $$

#### 1.1 Semantic Attention
We then aggregate across different meta-paths (e.g., "Admin-Access" vs "Read-Access"):
$$ w_{\Phi_p} = \frac{1}{|\mathcal{V}|} \sum_{i \in \mathcal{V}} q^T \cdot \tanh(W \cdot z_i^{\Phi_p} + b) $$
The final embedding $Z_i = \sum_{p=1}^{P} \beta_{\Phi_p} \cdot z_i^{\Phi_p}$.

### 2. Application: The "Silent Admin" Problem
Traditional RBAC fails to detect "Silent Admins" (chains of 3+ non-admin roles that sum to Admin).
*   **Meta-Path**: User $\xrightarrow{MemberOf}$ Group $\xrightarrow{Assumes}$ Role $\xrightarrow{HasAction}$ `*.*`.
*   **Result**: If the HAN assigns high $\beta_{\Phi}$ to this path, the user is classified as **High Risk** even if their nominal role is "Contractor".

### 3. Conclusion
HANs provide a differential geometry of privilege. We do not count admins; we calculate the **Attention Flow** of power.

### References
1.  Wang, X., et al. (2019). *Heterogeneous Graph Attention Network*. WWW Conference.
2.  Zhang, C., et al. (2019). *Heterogeneous Graph Neural Network*. KDD.
