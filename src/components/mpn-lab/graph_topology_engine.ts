import { LiteraryScenario } from './types';
import { calculatePsychometricForce } from './psychometric_calculus';

// --- Types ---

export interface GraphEdge {
    source: string; // Actor Name
    target: string; // Actor Name
    weight: number; // 0 to 1
    type: 'speech' | 'reference' | 'tension';
}

export interface GraphTopologyFrame {
    frameIndex: number;
    activeEdges: GraphEdge[];
}

// --- Topology Engine ---

export function precomputeGraphTopology(scenario: LiteraryScenario, castList: string[]): GraphTopologyFrame[] {
    const topology: GraphTopologyFrame[] = [];

    // Helper: Normalize name for matching
    const normalize = (s: string) => s.toLowerCase().trim();

    // 1. Iterate through every frame of the script
    scenario.frames.forEach((frame, index) => {
        const edges: GraphEdge[] = [];
        const script = frame.script;
        const speaker = script?.speaker;

        if (!speaker || !script) {
            topology.push({ frameIndex: index, activeEdges: [] });
            return;
        }

        const speakerNorm = normalize(speaker);
        const textNorm = normalize(script.text);
        const analysisNorm = normalize(script.analysis);

        // Helper to check for keywords (Heuristic Matching)
        const checkKeywords = (text: string, target: string) => {
            const t = target.toLowerCase();
            if (text.includes(t)) return true;
            // Aliases
            if (t === 'gertrude' && text.includes('mother')) return true;
            if (t === 'claudius' && (text.includes('king') || text.includes('uncle'))) return true;
            if (t === 'ghost' && (text.includes('spirit') || text.includes('father'))) return true;
            if (t === 'ophelia' && (text.includes('love') || text.includes('nymph'))) return true;
            if (t === 'polonius' && text.includes('fool')) return true;
            return false;
        };

        // 2. Identify Targets - Actor-to-Actor
        castList.forEach(target => {
            const targetNorm = normalize(target);
            if (targetNorm === speakerNorm) return;

            let weight = 0;
            let type: 'speech' | 'reference' | 'tension' = 'reference';

            // A. Direct Mention / Heuristics
            if (checkKeywords(textNorm, targetNorm)) {
                weight += 0.8;
                type = 'speech';
            }
            if (checkKeywords(analysisNorm, targetNorm)) {
                weight += 0.6;
                type = 'reference';
            }

            // B. Special Interactions
            if (speaker === 'Hamlet' && target === 'Horatio' && (index < 5)) weight += 0.3; // Act 1 bonding

            if (weight > 0) {
                const psycho = calculatePsychometricForce(script);
                if (psycho.tension > 0.6) type = 'tension';
                edges.push({ source: speaker, target, weight, type });
            }
        });

        // 3. Identify Targets - Actor-to-Concept (E.g. Hamlet -> Real)
        ['Real', 'Symbolic', 'Imaginary'].forEach(concept => {
            const cNorm = normalize(concept);
            let weight = 0;
            if (analysisNorm.includes(cNorm)) weight += 1.0;

            // Implicit Concept Mapping
            if (concept === 'Real' && (script.chord.includes('dim') || script.chord.includes('Tritone'))) weight += 0.5;
            if (concept === 'Symbolic' && (script.text.includes('King') || script.text.includes('Law'))) weight += 0.5;

            if (weight > 0) {
                edges.push({ source: speaker, target: concept, weight, type: 'tension' });
            }
        });

        topology.push({ frameIndex: index, activeEdges: edges });
    });

    return topology;
}
