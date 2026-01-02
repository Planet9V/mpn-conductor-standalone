import * as THREE from 'three';

export type NodeType = 'persona' | 'bias' | 'theory' | 'trait';

export interface KnowledgeNode {
    id: string;
    label: string;
    type: NodeType;
    group: number; // For clustering (0=DISC, 1=DarkTriad, 2=Lacan, 3=Bias)
    description: string;
    color: string;
    val: number; // Radius influence
}

export interface KnowledgeLink {
    source: string;
    target: string;
    value: number; // Force strength
    type: 'reinforces' | 'opposes' | 'related';
}

export const GRAPH_NODES: KnowledgeNode[] = [
    // --- DISC Types ---
    { id: 'dom', label: 'Dominance', type: 'trait', group: 0, description: 'Direct, firm, strong-willed, force-oriented.', color: '#ef4444', val: 2 },
    { id: 'inf', label: 'Influence', type: 'trait', group: 0, description: 'Outgoing, enthusiastic, optimistic, high-spirited.', color: '#facc15', val: 2 },
    { id: 'ste', label: 'Steadiness', type: 'trait', group: 0, description: 'Even-tempered, accommodating, patient, humble.', color: '#22c55e', val: 2 },
    { id: 'con', label: 'Conscientiousness', type: 'trait', group: 0, description: 'Analytical, reserved, precise, private.', color: '#3b82f6', val: 2 },

    // --- Dark Triad ---
    { id: 'nar', label: 'Narcissism', type: 'trait', group: 1, description: 'Grandiosity, pride, egotism, and a lack of empathy.', color: '#7f1d1d', val: 2.5 },
    { id: 'mac', label: 'Machiavellianism', type: 'trait', group: 1, description: 'Manipulation and exploitation of others, cynical disregard.', color: '#450a0a', val: 2.5 },
    { id: 'psy', label: 'Psychopathy', type: 'trait', group: 1, description: 'Continuous antisocial behavior, impulsivity, selfishness.', color: '#000000', val: 2.5 },

    // --- Lacanian Registers ---
    { id: 'real', label: 'The Real', type: 'theory', group: 2, description: 'That which is authentic, unchangeable, and impossible to symbolize.', color: '#9ca3af', val: 3 },
    { id: 'sym', label: 'The Symbolic', type: 'theory', group: 2, description: 'The realm of law, language, and culture.', color: '#fbbf24', val: 3 },
    { id: 'img', label: 'The Imaginary', type: 'theory', group: 2, description: 'The realm of images, identifying with the mirror image.', color: '#60a5fa', val: 3 },
    { id: 'obj', label: 'Objet petit a', type: 'theory', group: 2, description: 'The unattainable object of cause of desire.', color: '#ec4899', val: 1.5 },

    // --- Cognitive Biases ---
    { id: 'conf', label: 'Confirmation Bias', type: 'bias', group: 3, description: 'Tendency to search for strings that confirm one\'s pre-existing beliefs.', color: '#a855f7', val: 1 },
    { id: 'dunn', label: 'Dunning-Kruger', type: 'bias', group: 3, description: 'Cognitive bias of illusory superiority.', color: '#a855f7', val: 1 },
    { id: 'anch', label: 'Anchoring', type: 'bias', group: 3, description: 'Relying too heavily on the first piece of information offered.', color: '#a855f7', val: 1 },
    { id: 'fram', label: 'Framing Effect', type: 'bias', group: 3, description: 'Drawing different conclusions based on how data is presented.', color: '#a855f7', val: 1 },

    // --- Personas (Archetypes) ---
    { id: 'lead', label: 'The Sovereign', type: 'persona', group: 4, description: 'Autonomous agent making executive decisions.', color: '#ffffff', val: 4 },
    { id: 'trick', label: 'The Trickster', type: 'persona', group: 4, description: 'Agent of chaos and entropy, disrupting systems.', color: '#fb923c', val: 3 },
];

export const GRAPH_LINKS: KnowledgeLink[] = [
    // DISC <-> Dark Triad
    { source: 'dom', target: 'nar', value: 0.8, type: 'reinforces' },
    { source: 'dom', target: 'mac', value: 0.6, type: 'related' },
    { source: 'inf', target: 'nar', value: 0.7, type: 'related' },
    { source: 'con', target: 'mac', value: 0.5, type: 'related' },
    { source: 'ste', target: 'psy', value: -0.5, type: 'opposes' }, // Opposition

    // Lacan <-> Traits
    { source: 'real', target: 'psy', value: 0.9, type: 'related' }, // Psychosis/Real link
    { source: 'sym', target: 'con', value: 0.7, type: 'related' }, // Law/Rules
    { source: 'img', target: 'nar', value: 0.9, type: 'reinforces' }, // Mirror stage/Ego

    // Biases <-> Traits
    { source: 'conf', target: 'dom', value: 0.6, type: 'related' },
    { source: 'dunn', target: 'inf', value: 0.5, type: 'related' },
    { source: 'anch', target: 'ste', value: 0.4, type: 'related' },

    // Persona Interactions
    { source: 'lead', target: 'dom', value: 1.0, type: 'reinforces' },
    { source: 'lead', target: 'sym', value: 0.8, type: 'related' },
    { source: 'trick', target: 'inf', value: 0.8, type: 'related' },
    { source: 'trick', target: 'mac', value: 0.7, type: 'related' },
    { source: 'trick', target: 'real', value: 0.6, type: 'related' },
];
