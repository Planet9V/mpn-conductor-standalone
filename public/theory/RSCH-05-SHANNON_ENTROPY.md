# The Thermodynamics of Cyber Defense
## Determining Anomaly via Shannon Entropy Variations

**Date:** December 27, 2025
**Document ID:** RSCH-05-SHANNON_ENTROPY
**Classification:** AEON CORE INTERNAL // TIER 1

### Abstract
This paper examines the application of **Information Theory**, specifically **Shannon Entropy**, to network anomaly detection. We posit that a "Healthy" network state exhibits high entropy (randomness of user actions), while an "Attack" state (DDoS, Exfiltration) often exhibits an Entropy Collapse (hypersynchronization). We define the entropy formula $S = -\sum p_i \ln p_i$ and demonstrate its utility in detecting low-and-slow APTS that evade signature detection.

### 1. Shannon Entropy ($S$)
Shannon Entropy measures the uncertainty or "information content" of a random variable. In cybersecurity, the variable $X$ is often the **Source IP Address** or **Destination Port** in a packet stream.
$$ S(X) = - \sum_{i=1}^{n} p(x_i) \ln p(x_i) $$
Where $p(x_i)$ is the probability (frequency) of occurrence of event $x_i$.

### 2. Entropy Signatures of Attack Vectors
#### 2.1 DDoS (Distributed Denial of Service)
*   **The Phenomenon**: A massive influx of packets from many IPs to a single IP.
*   **Entropy Change**:
    *   **Source IP Entropy**: INCREASES (Random spoofed IPs).
    *   **Dest IP Entropy**: COLLAPSES to 0 (Targeting one victim).
    *   **Packet Size Entropy**: COLLAPSES (Attack tools send identical packet sizes).
*   **Detection**: A sudden drop in Destination Entropy combined with a drop in Packet Size Entropy is a 99% confident DDoS signal.

#### 2.2 Data Exfiltration
*   **The Phenomenon**: Moving large files to an external server.
*   **Entropy Change**: Encrypted data is high entropy (pseudo-random). However, the *timing* of packets often becomes regular (hypersynchronized machine beaconing).
*   **Detection**: Low entropy in **Inter-Arrival Times** (IAT) indicates automated "heartbeats" rather than human browsing.

### 3. AEON Core Application: The Thermodynamic Monitor
Agent Blue maintains a rolling window of entropy scores for network flows.
*   **Baseline**: $S_{baseline} \approx 4.8$ (Normal user mix).
*   **Alert**: If $S_{current} < 2.0$ (Order) or $S_{current} > 8.0$ (Chaos), trigger investigation.
*   **Value**: This detects "Unknown Unknowns". We don't need to know *what* the attack is; we only need to know that the physics of the network have shifted from specific randomness to specific order.

### 4. Conclusion
Entropy provides a signature-less method for identifying the "State of the Network". By treating the network as a thermodynamic system, we can detect phase transitions (attacks) purely through the statistics of information flow.

### References
1.  Shannon, C. E. (1948). *A Mathematical Theory of Communication*.
2.  Feinstein, L., et al. (2003). *Statistical Approaches to DDoS Attack Detection and Response*.
3.  Nychis, G., et al. (2008). *An Empirical Investigation of Entropy-Based Anomaly Detection*.
