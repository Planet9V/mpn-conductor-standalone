# Information Geometry for Defense Optimization
## Natural Gradient Descent on the Attack Manifold

**Date:** December 27, 2025
**Document ID:** RSCH-22-INFO_GEOMETRY
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
We apply **Information Geometry** to the problem of optimizing a defense policy against an evolving attacker. The space of all possible attack distributions $\mathcal{P} = \{p_{\theta} : \theta \in \Theta\}$ forms a **Statistical Manifold** equipped with the **Fisher Information Metric**. We show that standard Gradient Descent on this manifold is inefficient due to its non-Euclidean curvature, and propose using **Natural Gradient Descent** which follows geodesics.

### 1. The Fisher Information Metric
Let $p(x|\theta)$ be a parameterized family of attack distributions. The Fisher Information Matrix is:
$$ g_{ij}(\theta) = \mathbb{E}_{p(x|\theta)} \left[ \frac{\partial \log p(x|\theta)}{\partial \theta_i} \frac{\partial \log p(x|\theta)}{\partial \theta_j} \right] $$
This $g_{ij}$ defines a Riemannian metric on $\Theta$, making it a curved manifold.

### 2. The Geodesic of Attack Evolution
The shortest path between two attack distributions $p_{\theta_1}$ and $p_{\theta_2}$ is the geodesic on this manifold. The length of this path is related to the **KL-Divergence**:
$$ d(\theta_1, \theta_2)^2 \approx 2 D_{KL}(p_{\theta_1} || p_{\theta_2}) $$

### 3. Natural Gradient Descent for Defense
Let $J(\theta)$ be the cost function of the defense (e.g., detection error). Standard gradient descent updates:
$$ \theta_{t+1} = \theta_t - \eta \nabla_\theta J $$
This is inefficient because it ignores curvature. **Natural Gradient** uses:
$$ \theta_{t+1} = \theta_t - \eta \cdot g^{-1}(\theta_t) \nabla_\theta J $$
This follows the geodesic on $\mathcal{M}$, giving faster convergence in fewer epochs.

### 4. Application: AEON Core Tuning
Agent Blue uses Natural Gradient to optimize its detection thresholds. Instead of tuning hyperparameters in Euclidean space, it moves along the Fisher-Rao manifold, arriving at the optimal policy in $O(\log N)$ steps instead of $O(N)$.

### References
1.  Amari, S. (1998). Natural gradient works efficiently in learning. *Neural Computation*.
2.  Amari, S., & Nagaoka, H. (2000). *Methods of Information Geometry*. AMS.
3.  Martens, J. (2020). New insights and perspectives on the natural gradient method. *JMLR*.
