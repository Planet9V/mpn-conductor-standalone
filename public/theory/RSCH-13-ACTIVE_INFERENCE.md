# Multi-Agent Reinforcement Learning (MARL) in Active Defense
## Graph Convolutional Communication for Decentralized Reflex

**Date:** December 27, 2025
**Document ID:** RSCH-13-MARL_REFLEX
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
We replace the single-agent "Active Inference" model with a **Multi-Agent Reinforcement Learning (MARL)** framework utilizing **Graph Convolutional Communication (GCC)**. Security agents (e.g., Endpoint Sensors) are modeled as cooperative agents learning a shared policy $\pi_{\theta}(u^a | \tau^a)$ that minimizes the collective Free Energy of the network. We employ **Centralized Training, Decentralized Execution (CTDE)** to ensure scalability, allowing local agents to execute complex containment strategies without cloud dependency.

### 1. The POMDP Formulation
We model the network defense as a Decentralized Partially Observable Markov Decision Process (Dec-POMDP):
*   $\mathcal{S}$: Global state (Network Traffic).
*   $\mathcal{O}^a$: Local observation of agent $a$ (Local Packets).
*   $\mathcal{U}^a$: Action space (Block, Allow, Quarantine).

### 2. Graph Convolutional Communication
Agents communicate latent state embeddings $m_a$ via graph edges.
$$ h_a^{(l+1)} = \sigma \left( \sum_{b \in \mathcal{N}(a)} W^{(l)} h_b^{(l)} + m_a \right) $$
This allows Agent A to "know" that Agent B is under attack without sending raw PCAP data, preserving bandwidth while expanding the receptive field of the policy.

### 3. The Objective Function
We maximize the joint value function $Q_{tot}$ using a mixing network (QMIX):
$$ Q_{tot}(\boldsymbol{\tau}, \boldsymbol{u}) = \sum_{a=1}^N w_a Q_a(\tau^a, u^a) $$
However, we constrain this with a **Free Energy Regularizer** to prevent overfitting to "Peace Time" stats:
$$ \mathcal{L}(\theta) = \mathbb{E} [ (y - Q_{tot})^2 ] + \beta D_{KL}(\pi_{\theta} || \pi_{prior}) $$

### 4. Conclusion
MARL allows "Emergent Defense". Agents learn to sacrifice local performance (e.g., disconnecting a switch) to save the global manifold (preventing lateral movement).

### References
1.  Rashid, T., et al. (2018). *QMIX: Monotonic Value Function Factorization*. ICML.
2.  Jiang, J., et al. (2018). *Graph Convolutional Reinforcement Learning*.
3.  Friston, K. (2010). *The Free-Energy Principle*.
