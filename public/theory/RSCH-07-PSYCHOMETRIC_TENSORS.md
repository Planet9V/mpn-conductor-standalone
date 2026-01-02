# Psychometric Tensor Fields in Insider Threat Modeling
## Mapping Personality Dimensions to Attack Surface Vectors

**Date:** December 27, 2025
**Document ID:** RSCH-07-PSYCHOMETRIC_TENSORS
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
This paper introduces the concept of the **Psychometric Tensor Field**, a mathematical model that maps human personality traits (e.g., Big Five, Dark Triad) onto the cybersecurity attack surface. We propose that "Insider Risk" is not a scalar value but a **Tensor $T_{ij}$**, representing the stress-strain relationship between a user's psychological disposition (Vector $u$) and a specific social engineering vector (Vector $v$).

### 1. The Scalar limit of traditional risk
Traditional User Behavior Analytics (UBA) assigns a singular "Risk Score" ($R \in [0, 100]$) to a user. This is insufficient. A user with high **Openness** is risky for Phishing but safe for Malicious Insider (Sabotage). A user with high **Narcissism** is risky for Sabotage but may be resilient to Authority-based Phishing.

### 2. The Psychometric Tensor ($T_{ij}$)
We define the interaction as a second-order tensor $T$.
Let $P$ be the vector of Personality Traits (e.g., [Openness, Conscientiousness, Extroversion, Agreeableness, Neuroticism]).
Let $A$ be the vector of Attack Types (e.g., [Phishing, Baiting, Quid Pro Quo, Tailgating]).

The Risk scalar $R$ for a specific interaction is:
$$ R = P^T \cdot T \cdot A $$

#### 2.1 The Stress Components
The Tensor $T$ captures the correlations:
*   $T_{11}$ (Openness x Phishing): High (Curiosity leads to clicking).
*   $T_{23}$ (Conscientiousness x Baiting): Low (Rule-following reduces baiting success).
*   $T_{54}$ (Neuroticism x Pretexting): High (Anxiety leads to compliance under pressure).

### 3. AEON Core Application: tensor-based Profiling
Agent Blue ingests "Digital Body Language" (typing speed, sentiment analysis, browsing habits) to estimate the vector $P$ in real-time. It then computes the product against the current Threat Landscape $A$.
*   **Result**: If $R > \text{Threshold}$, the user is flagged not just as "Risky", but as "Vulnerable to Vector $A_k$".
*   **Response**: The system dynamically disables the specific vector (e.g., blocks external email attachments) while leaving other functions intact.

### 4. Conclusion
By moving from scalar risk to Tensor Fields, we achieve a high-fidelity model of the "Human Firewall". We do not secure "Users"; we secure specific *psychological interactions*.

### References
1.  McKenney, P. (2024). *The Psychohistory of the Digital Subject*.
2.  Costa, P. T., & McCrae, R. R. (1992). *Neo Personality Inventory-Revised (NEO PI-R)*.
3.  Einstein, A. (1915). *The Field Equations of Gravitation* (Tensor methodology).
