/**
 * Dialectic Graph Data Model
 * 
 * Actors don't connect directly - they traverse through dialectic nodes:
 * language, psychometrics, biases, and Lacanian registers.
 * 
 * Actor -> Dialectic -> Dialectic -> ... -> Actor (5-10 hops)
 */

// =============================================================================
// TYPES
// =============================================================================

export interface DISCProfile {
    D: number; // Dominance: 0-1
    I: number; // Influence: 0-1
    S: number; // Steadiness: 0-1
    C: number; // Conscientiousness: 0-1
}

export interface OCEANProfile {
    O: number; // Openness: 0-1
    C: number; // Conscientiousness: 0-1
    E: number; // Extraversion: 0-1
    A: number; // Agreeableness: 0-1
    N: number; // Neuroticism: 0-1
}

export interface DarkTriadProfile {
    narcissism: number;       // 0-1
    machiavellianism: number; // 0-1
    psychopathy: number;      // 0-1
}

export type BiasType =
    | 'confirmation_bias'
    | 'dunning_kruger'
    | 'anchoring'
    | 'framing_effect'
    | 'bandwagon'
    | 'loss_aversion'
    | 'sunk_cost'
    | 'availability_heuristic'
    | 'hindsight_bias'
    | 'projection';

export type LacanianRegister = 'real' | 'symbolic' | 'imaginary';

export type DialecticCategory =
    | 'disc'
    | 'ocean'
    | 'dark_triad'
    | 'bias'
    | 'lacanian';

// Actor node with attached psychometric traits
export interface ActorNode {
    id: string;
    label: string;
    type: 'actor';
    // Attached psychometrics (extracted from text/behavior/tone)
    disc: DISCProfile;
    ocean: OCEANProfile;
    darkTriad: DarkTriadProfile;
    activeBiases: BiasType[];
    lacanianPosition: { real: number; symbolic: number; imaginary: number };
    // Physics properties
    mass: number;
    clusterWeight: number; // Higher = attracts similar, lower = repels
}

// Dialectic intermediary node (language mesh)
export interface DialecticNode {
    id: string;
    label: string;
    type: 'dialectic';
    category: DialecticCategory;
    subtype: string; // e.g., 'D' for Dominance, 'confirmation_bias', 'real'
    strength: number; // 0-1, affects edge pulsing intensity
    color: string;
}

// Edges that pulse during active dialogue
export interface DialecticEdge {
    source: string;
    target: string;
    edgeType: 'actor-dialectic' | 'dialectic-dialectic' | 'dialectic-actor';
    active: boolean;
    pulseIntensity: number; // 0-1
    traversalOrder: number; // 0 = first hop, 1 = second, etc.
    weight: number; // Connection strength
}

// =============================================================================
// DIALECTIC NODES - The Language Mesh
// =============================================================================

export const DIALECTIC_NODES: DialecticNode[] = [
    // --- DISC Traits ---
    { id: 'disc-d', label: 'Dominance', type: 'dialectic', category: 'disc', subtype: 'D', strength: 0.8, color: '#ef4444' },
    { id: 'disc-i', label: 'Influence', type: 'dialectic', category: 'disc', subtype: 'I', strength: 0.8, color: '#facc15' },
    { id: 'disc-s', label: 'Steadiness', type: 'dialectic', category: 'disc', subtype: 'S', strength: 0.8, color: '#22c55e' },
    { id: 'disc-c', label: 'Conscientiousness', type: 'dialectic', category: 'disc', subtype: 'C', strength: 0.8, color: '#3b82f6' },

    // --- OCEAN Traits ---
    { id: 'ocean-o', label: 'Openness', type: 'dialectic', category: 'ocean', subtype: 'O', strength: 0.7, color: '#a855f7' },
    { id: 'ocean-c', label: 'Conscientiousness', type: 'dialectic', category: 'ocean', subtype: 'C', strength: 0.7, color: '#06b6d4' },
    { id: 'ocean-e', label: 'Extraversion', type: 'dialectic', category: 'ocean', subtype: 'E', strength: 0.7, color: '#f97316' },
    { id: 'ocean-a', label: 'Agreeableness', type: 'dialectic', category: 'ocean', subtype: 'A', strength: 0.7, color: '#84cc16' },
    { id: 'ocean-n', label: 'Neuroticism', type: 'dialectic', category: 'ocean', subtype: 'N', strength: 0.7, color: '#64748b' },

    // --- Dark Triad ---
    { id: 'dark-nar', label: 'Narcissism', type: 'dialectic', category: 'dark_triad', subtype: 'narcissism', strength: 0.9, color: '#be123c' },
    { id: 'dark-mac', label: 'Machiavellianism', type: 'dialectic', category: 'dark_triad', subtype: 'machiavellianism', strength: 0.9, color: '#7f1d1d' },
    { id: 'dark-psy', label: 'Psychopathy', type: 'dialectic', category: 'dark_triad', subtype: 'psychopathy', strength: 0.9, color: '#0f0f0f' },

    // --- Cognitive Biases ---
    { id: 'bias-confirm', label: 'Confirmation Bias', type: 'dialectic', category: 'bias', subtype: 'confirmation_bias', strength: 0.6, color: '#a855f7' },
    { id: 'bias-dk', label: 'Dunning-Kruger', type: 'dialectic', category: 'bias', subtype: 'dunning_kruger', strength: 0.6, color: '#d946ef' },
    { id: 'bias-anchor', label: 'Anchoring', type: 'dialectic', category: 'bias', subtype: 'anchoring', strength: 0.6, color: '#8b5cf6' },
    { id: 'bias-frame', label: 'Framing Effect', type: 'dialectic', category: 'bias', subtype: 'framing_effect', strength: 0.6, color: '#c084fc' },
    { id: 'bias-bandwagon', label: 'Bandwagon', type: 'dialectic', category: 'bias', subtype: 'bandwagon', strength: 0.6, color: '#e879f9' },
    { id: 'bias-loss', label: 'Loss Aversion', type: 'dialectic', category: 'bias', subtype: 'loss_aversion', strength: 0.6, color: '#f472b6' },
    { id: 'bias-sunk', label: 'Sunk Cost', type: 'dialectic', category: 'bias', subtype: 'sunk_cost', strength: 0.6, color: '#fb7185' },
    { id: 'bias-avail', label: 'Availability', type: 'dialectic', category: 'bias', subtype: 'availability_heuristic', strength: 0.6, color: '#818cf8' },

    // --- Lacanian Registers ---
    { id: 'lacan-real', label: 'The Real', type: 'dialectic', category: 'lacanian', subtype: 'real', strength: 1.0, color: '#9ca3af' },
    { id: 'lacan-sym', label: 'The Symbolic', type: 'dialectic', category: 'lacanian', subtype: 'symbolic', strength: 1.0, color: '#fbbf24' },
    { id: 'lacan-img', label: 'The Imaginary', type: 'dialectic', category: 'lacanian', subtype: 'imaginary', strength: 1.0, color: '#60a5fa' },
];

// =============================================================================
// ACTOR PROFILES - Base psychometric signatures for literary characters
// =============================================================================

export const ACTOR_PROFILES: Record<string, Omit<ActorNode, 'id' | 'label' | 'type'>> = {
    // --- Hamlet Cast ---
    'Hamlet': {
        disc: { D: 0.3, I: 0.5, S: 0.2, C: 0.8 },
        ocean: { O: 0.9, C: 0.7, E: 0.4, A: 0.3, N: 0.9 },
        darkTriad: { narcissism: 0.4, machiavellianism: 0.6, psychopathy: 0.2 },
        activeBiases: ['confirmation_bias', 'anchoring'],
        lacanianPosition: { real: 0.7, symbolic: 0.5, imaginary: 0.6 },
        mass: 2.0,
        clusterWeight: 1.0,
    },
    'Claudius': {
        disc: { D: 0.9, I: 0.7, S: 0.2, C: 0.6 },
        ocean: { O: 0.4, C: 0.6, E: 0.7, A: 0.2, N: 0.5 },
        darkTriad: { narcissism: 0.8, machiavellianism: 0.95, psychopathy: 0.7 },
        activeBiases: ['framing_effect', 'loss_aversion'],
        lacanianPosition: { real: 0.3, symbolic: 0.9, imaginary: 0.5 },
        mass: 1.8,
        clusterWeight: 0.8,
    },
    'Gertrude': {
        disc: { D: 0.4, I: 0.7, S: 0.7, C: 0.3 },
        ocean: { O: 0.3, C: 0.4, E: 0.6, A: 0.7, N: 0.4 },
        darkTriad: { narcissism: 0.5, machiavellianism: 0.3, psychopathy: 0.1 },
        activeBiases: ['bandwagon', 'availability_heuristic'],
        lacanianPosition: { real: 0.2, symbolic: 0.7, imaginary: 0.8 },
        mass: 1.5,
        clusterWeight: 0.9,
    },
    'Ophelia': {
        disc: { D: 0.1, I: 0.5, S: 0.9, C: 0.4 },
        ocean: { O: 0.7, C: 0.5, E: 0.3, A: 0.9, N: 0.85 },
        darkTriad: { narcissism: 0.1, machiavellianism: 0.0, psychopathy: 0.0 },
        activeBiases: ['anchoring', 'sunk_cost'],
        lacanianPosition: { real: 0.4, symbolic: 0.3, imaginary: 0.9 },
        mass: 1.2,
        clusterWeight: 1.1,
    },
    'Polonius': {
        disc: { D: 0.5, I: 0.8, S: 0.6, C: 0.7 },
        ocean: { O: 0.2, C: 0.8, E: 0.7, A: 0.5, N: 0.3 },
        darkTriad: { narcissism: 0.6, machiavellianism: 0.5, psychopathy: 0.1 },
        activeBiases: ['dunning_kruger', 'confirmation_bias'],
        lacanianPosition: { real: 0.1, symbolic: 0.95, imaginary: 0.4 },
        mass: 1.4,
        clusterWeight: 0.7,
    },
    'Horatio': {
        disc: { D: 0.3, I: 0.4, S: 0.8, C: 0.9 },
        ocean: { O: 0.6, C: 0.9, E: 0.4, A: 0.8, N: 0.2 },
        darkTriad: { narcissism: 0.1, machiavellianism: 0.1, psychopathy: 0.0 },
        activeBiases: [],
        lacanianPosition: { real: 0.2, symbolic: 0.8, imaginary: 0.3 },
        mass: 1.3,
        clusterWeight: 1.2,
    },
    'Laertes': {
        disc: { D: 0.8, I: 0.6, S: 0.3, C: 0.5 },
        ocean: { O: 0.4, C: 0.5, E: 0.7, A: 0.4, N: 0.6 },
        darkTriad: { narcissism: 0.4, machiavellianism: 0.5, psychopathy: 0.3 },
        activeBiases: ['loss_aversion', 'framing_effect'],
        lacanianPosition: { real: 0.5, symbolic: 0.7, imaginary: 0.5 },
        mass: 1.5,
        clusterWeight: 0.9,
    },
    'Ghost': {
        disc: { D: 0.7, I: 0.2, S: 0.3, C: 0.5 },
        ocean: { O: 0.2, C: 0.6, E: 0.1, A: 0.3, N: 0.8 },
        darkTriad: { narcissism: 0.3, machiavellianism: 0.4, psychopathy: 0.2 },
        activeBiases: ['anchoring'],
        lacanianPosition: { real: 0.95, symbolic: 0.4, imaginary: 0.2 },
        mass: 2.5,
        clusterWeight: 0.5,
    },

    // --- Default fallback ---
    'default': {
        disc: { D: 0.5, I: 0.5, S: 0.5, C: 0.5 },
        ocean: { O: 0.5, C: 0.5, E: 0.5, A: 0.5, N: 0.5 },
        darkTriad: { narcissism: 0.3, machiavellianism: 0.3, psychopathy: 0.1 },
        activeBiases: [],
        lacanianPosition: { real: 0.33, symbolic: 0.33, imaginary: 0.33 },
        mass: 1.0,
        clusterWeight: 1.0,
    },
};

// =============================================================================
// DIALECTIC CONNECTIONS - Base edges between dialectic nodes
// =============================================================================

export const DIALECTIC_MESH_EDGES: Array<{ source: string; target: string; weight: number }> = [
    // DISC <-> Dark Triad connections
    { source: 'disc-d', target: 'dark-nar', weight: 0.8 },
    { source: 'disc-d', target: 'dark-mac', weight: 0.7 },
    { source: 'disc-i', target: 'dark-nar', weight: 0.6 },
    { source: 'disc-c', target: 'dark-mac', weight: 0.5 },
    { source: 'disc-s', target: 'dark-psy', weight: -0.5 }, // Opposition

    // DISC <-> OCEAN correlations
    { source: 'disc-d', target: 'ocean-e', weight: 0.6 },
    { source: 'disc-i', target: 'ocean-e', weight: 0.8 },
    { source: 'disc-s', target: 'ocean-a', weight: 0.7 },
    { source: 'disc-c', target: 'ocean-c', weight: 0.9 },
    { source: 'ocean-n', target: 'dark-psy', weight: 0.4 },

    // Lacanian <-> Traits
    { source: 'lacan-real', target: 'dark-psy', weight: 0.8 },
    { source: 'lacan-sym', target: 'disc-c', weight: 0.7 },
    { source: 'lacan-img', target: 'dark-nar', weight: 0.9 },
    { source: 'lacan-real', target: 'ocean-n', weight: 0.6 },

    // Biases <-> Traits
    { source: 'bias-confirm', target: 'disc-c', weight: 0.5 },
    { source: 'bias-dk', target: 'disc-i', weight: 0.6 },
    { source: 'bias-dk', target: 'dark-nar', weight: 0.7 },
    { source: 'bias-anchor', target: 'disc-s', weight: 0.5 },
    { source: 'bias-frame', target: 'dark-mac', weight: 0.6 },
    { source: 'bias-loss', target: 'ocean-n', weight: 0.5 },
    { source: 'bias-bandwagon', target: 'ocean-a', weight: 0.5 },

    // Inner dialectic mesh (trait-to-trait)
    { source: 'disc-d', target: 'disc-i', weight: 0.4 },
    { source: 'disc-s', target: 'disc-c', weight: 0.4 },
    { source: 'dark-nar', target: 'dark-mac', weight: 0.6 },
    { source: 'dark-mac', target: 'dark-psy', weight: 0.5 },
    { source: 'lacan-real', target: 'lacan-sym', weight: 0.3 },
    { source: 'lacan-sym', target: 'lacan-img', weight: 0.4 },
    { source: 'lacan-img', target: 'lacan-real', weight: 0.3 },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get actor profile by name, with fallback to default
 */
export function getActorProfile(name: string): Omit<ActorNode, 'id' | 'label' | 'type'> {
    return ACTOR_PROFILES[name] || ACTOR_PROFILES['default'];
}

/**
 * Calculate trait affinity between an actor and a dialectic node
 * Returns 0-1 score of how strongly connected they are
 */
export function calculateActorDialecticAffinity(actor: ActorNode, dialectic: DialecticNode): number {
    switch (dialectic.category) {
        case 'disc':
            return actor.disc[dialectic.subtype as keyof DISCProfile] || 0;
        case 'ocean':
            return actor.ocean[dialectic.subtype as keyof OCEANProfile] || 0;
        case 'dark_triad':
            return actor.darkTriad[dialectic.subtype as keyof DarkTriadProfile] || 0;
        case 'bias':
            return actor.activeBiases.includes(dialectic.subtype as BiasType) ? 0.8 : 0.1;
        case 'lacanian':
            return actor.lacanianPosition[dialectic.subtype as LacanianRegister] || 0;
        default:
            return 0;
    }
}

/**
 * Calculate clustering force between two actors based on trait similarity
 * Positive = attract, Negative = repel
 */
export function calculateActorClusteringForce(actor1: ActorNode, actor2: ActorNode): number {
    let similarity = 0;
    let count = 0;

    // DISC similarity
    for (const key of ['D', 'I', 'S', 'C'] as const) {
        similarity += 1 - Math.abs(actor1.disc[key] - actor2.disc[key]);
        count++;
    }

    // Dark Triad similarity (weighted higher - shared darkness clusters)
    for (const key of ['narcissism', 'machiavellianism', 'psychopathy'] as const) {
        const both = actor1.darkTriad[key] * actor2.darkTriad[key];
        similarity += both * 2; // Amplify shared dark traits
        count++;
    }

    // Lacanian similarity
    for (const key of ['real', 'symbolic', 'imaginary'] as const) {
        similarity += 1 - Math.abs(actor1.lacanianPosition[key] - actor2.lacanianPosition[key]);
        count++;
    }

    const avgSimilarity = similarity / count;

    // Transform to attraction/repulsion: >0.5 attracts, <0.5 repels
    return (avgSimilarity - 0.5) * 2 * actor1.clusterWeight * actor2.clusterWeight;
}

/**
 * Find the dialectic path between two actors (5-10 node traversal)
 */
export function findDialecticPath(
    speaker: ActorNode,
    target: ActorNode,
    dialecticNodes: DialecticNode[],
    maxHops: number = 7
): string[] {
    const path: string[] = [speaker.id];

    // Find speaker's strongest trait connections
    const speakerAffinities = dialecticNodes
        .map(d => ({ node: d, affinity: calculateActorDialecticAffinity(speaker, d) }))
        .sort((a, b) => b.affinity - a.affinity);

    // Find target's strongest trait connections
    const targetAffinities = dialecticNodes
        .map(d => ({ node: d, affinity: calculateActorDialecticAffinity(target, d) }))
        .sort((a, b) => b.affinity - a.affinity);

    // Start from speaker's top trait
    if (speakerAffinities.length > 0) {
        path.push(speakerAffinities[0].node.id);
    }

    // Build middle path through dialectic mesh
    const middleHops = Math.min(maxHops - 2, Math.max(3, Math.floor(Math.random() * 5) + 3));
    const usedNodes = new Set(path);

    for (let i = 0; i < middleHops; i++) {
        // Find connected nodes via mesh edges
        const lastNode = path[path.length - 1];
        const connections = DIALECTIC_MESH_EDGES
            .filter(e => (e.source === lastNode || e.target === lastNode) && e.weight > 0)
            .map(e => e.source === lastNode ? e.target : e.source)
            .filter(n => !usedNodes.has(n));

        if (connections.length > 0) {
            const next = connections[Math.floor(Math.random() * connections.length)];
            path.push(next);
            usedNodes.add(next);
        } else {
            // Random dialectic node if no connections
            const available = dialecticNodes.filter(d => !usedNodes.has(d.id));
            if (available.length > 0) {
                const next = available[Math.floor(Math.random() * available.length)];
                path.push(next.id);
                usedNodes.add(next.id);
            }
        }
    }

    // End at target's strongest trait
    if (targetAffinities.length > 0 && !usedNodes.has(targetAffinities[0].node.id)) {
        path.push(targetAffinities[0].node.id);
    }

    path.push(target.id);

    return path;
}
