# Mean Field Games (MFG) in Botnet Propagation
## Stochastic Differential Equations for Large-Scale Network Infection

**Date:** December 27, 2025
**Document ID:** RSCH-12-MFG_BOTNET
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
We model the propagation of botnets in large-scale IoT networks ($N \to \infty$) using the framework of **Mean Field Games (MFG)** on Graphs. Unlike discrete Threshold Models or simple SIR dynamics, MFG allows us to model the **Rationality of the Attacker** versus the **State Distribution of the Network**. We derive the coupled system of the **Hamilton-Jacobi-Bellman (HJB)** equation (controlling the optimal attack strategy) and the **Fokker-Planck (FP)** equation (describing the evolution of the compromised node density).

### 1. The Game Formulation
Let the network state be a probability measure $m(t, x)$ representing the density of nodes at state $x$ (e.g., Vulnerability Level).
The Attacker controls a strategy $u(t)$ (Infection Rate) to maximize a payoff $J(u, m)$.

#### 1.1 The Master Equation System
As $N \to \infty$, the Nash Equilibrium is given by the solution pair $(u, m)$ to:
1.  **The Backward HJB Equation** (Attacker's Optimization):
    $$ -\partial_t V(t,x) - \nu \Delta V(t,x) + H(x, \nabla V(t,x), m(t)) = 0 $$
    $$ V(T, x) = G(x, m(T)) $$
    Where $V$ is the Value Function and $H$ is the Hamiltonian.

2.  **The Forward Fokker-Planck Equation** (Network Evolution):
    $$ \partial_t m(t,x) - \nu \Delta m(t,x) - \nabla \cdot (m(t,x) \nabla_p H) = 0 $$
    $$ m(0, x) = m_0(x) $$

### 2. Application: The Botnet Singularity
We analyze the existence of "Blow-up Solutions".
If the coupling term in the Hamiltonian $H$ exceeds a critical value (related to Graph Connectivity $\lambda_{max}$), the solution $m(t,x)$ concentrates into a Dirac measure $\delta(x_{compromised})$ in finite time $T^*$.
*   **Result**: This finite-time blow-up is the rigorous mathematical definition of a **Flash Botnet** (e.g., Mirai).

### 3. Conclusion
MFG proves that "hygiene" ($m_0$) is insufficient if the Hamiltonian ($H$) allows for super-linear feedback. Defense requires modifying the *Game Structure* ($\nabla_p H$), not just the initial state.

### References
1.  Lasry, J. M., & Lions, P. L. (2007). *Mean Field Games*. Japanese Journal of Mathematics.
2.  Gomes, D. A., et al. (2016). *Regularity of the HJB Equation in Mean Field Games*.
3.  Carmona, R., & Delarue, F. (2018). *Probabilistic Theory of Mean Field Games*.
