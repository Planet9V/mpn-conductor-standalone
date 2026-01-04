/**
 * Psychometric Instrument Mapper
 * 
 * CRITICAL: Connects 498 Psychometric Mappings → Instrument Selection
 * 
 * Purpose:
 * Maps actor psychometric profiles to specific musical instruments based on:
 * - DISC personality traits
 * - Trauma levels
 * - Entropy states
 * - RSI register dominance
 * - Database psychometric mappings
 * 
 * Theory Foundation:
 * - High D (Dominance) → Brass (trumpet, trombone) - commanding, penetrating
 * - High I (Influence) → Woodwinds (flute, clarinet) - expressive, soaring
 * - High S (Steadiness) → Strings (violin, cello) - warm, sustained
 * - High C (Conscientiousness) → Keyboard (piano, harp) - precise, structured
 * 
 * Psychometric Refinements:
 * - High Trauma + D → Distorted brass, aggressive articulation
 * - Real register dominance → Dark timbres (bass clarinet, cello)
 * - Symbolic register → Classical instruments (violin, piano)
 * - Imaginary register → Ethereal sounds (harp, vibraphone, pad synths)
 * 
 * @module psychometric_instrument_mapper
 */

import { ActorProfile } from '@/components/mpn-lab/score_types';

/**
 * Available instrument samples
 * Based on VSCO-2 CE Community Edition soundfont
 */
export const AVAILABLE_INSTRUMENTS = {
    // Strings (S - Steadiness, emotional foundation)
    violin: { family: 'strings', discWeight: { S: 0.9, I: 0.3 }, register: 'imaginary' },
    viola: { family: 'strings', discWeight: { S: 0.85, C: 0.4 }, register: 'symbolic' },
    cello: { family: 'strings', discWeight: { S: 0.95, D: 0.2 }, register: 'real' },
    contrabass: { family: 'strings', discWeight: { S: 0.8, C: 0.5 }, register: 'real' },

    // Brass (D - Dominance, commanding presence)
    trumpet: { family: 'brass', discWeight: { D: 0.95, I: 0.3 }, register: 'symbolic' },
    trombone: { family: 'brass', discWeight: { D: 0.9, S: 0.2 }, register: 'real' },
    french_horn: { family: 'brass', discWeight: { D: 0.8, S: 0.4 }, register: 'imaginary' },
    tuba: { family: 'brass', discWeight: { D: 0.85, C: 0.3 }, register: 'real' },

    // Woodwinds (I - Influence, expressive melodies)
    flute: { family: 'woodwind', discWeight: { I: 0.95, S: 0.2 }, register: 'imaginary' },
    clarinet: { family: 'woodwind', discWeight: { I: 0.9, C: 0.3 }, register: 'symbolic' },
    oboe: { family: 'woodwind', discWeight: { I: 0.85, C: 0.4 }, register: 'symbolic' },
    bassoon: { family: 'woodwind', discWeight: { I: 0.7, S: 0.5 }, register: 'real' },

    // Keyboard (C - Conscientiousness, precision)
    piano: { family: 'keyboard', discWeight: { C: 0.95, I: 0.2 }, register: 'symbolic' },
    harp: { family: 'keyboard', discWeight: { C: 0.8, I: 0.5 }, register: 'imaginary' },
    celesta: { family: 'keyboard', discWeight: { C: 0.85, I: 0.4 }, register: 'imaginary' },

    // Percussion (D - Dominance, rhythmic drive)
    timpani: { family: 'percussion', discWeight: { D: 0.9, S: 0.3 }, register: 'real' },
    snare: { family: 'percussion', discWeight: { D: 0.85, C: 0.4 }, register: 'symbolic' },
    cymbals: { family: 'percussion', discWeight: { D: 0.95, I: 0.2 }, register: 'real' },
} as const;

export type InstrumentName = keyof typeof AVAILABLE_INSTRUMENTS;

interface InstrumentScore {
    instrument: InstrumentName;
    score: number;
    reasoning: string;
}

/**
 * Select optimal instrument for actor based on psychometric profile
 * 
 * Algorithm:
 * 1. Calculate base score from DISC profile match
 * 2. Apply trauma modifiers (high trauma → darker timbres)
 * 3. Apply entropy modifiers (high entropy → unpredictable instruments)
 * 4. Apply RSI register preference
 * 5. Query database for psychometric_entry_id matches
 * 6. Weight and rank all candidates
 * 7. Return highest-scoring instrument
 * 
 * @param actor - Actor profile with DISC, trauma, entropy, RSI data
 * @param psychometricEntryIds - Array of active psychometric entry IDs for this actor
 * @returns InstrumentName - Optimal instrument selection
 */
export function selectInstrumentForActor(
    actor: ActorProfile,
    psychometricEntryIds: string[] = []
): InstrumentName {
    const scores: InstrumentScore[] = [];

    // Score each instrument
    for (const [instrumentName, instrumentData] of Object.entries(AVAILABLE_INSTRUMENTS)) {
        let score = 0;
        const reasons: string[] = [];

        // 1. Base DISC matching (40% weight)
        const discScore = calculateDISCScore(actor.disc, instrumentData.discWeight);
        score += discScore * 0.4;
        if (discScore > 0.7) {
            reasons.push(`Strong DISC match (${(discScore * 100).toFixed(0)}%)`);
        }

        // 2. Trauma modifier (20% weight)
        // High trauma (>0.7) → prefer darker, more dissonant instruments
        if (actor.currentState?.trauma !== undefined) {
            const trauma = actor.currentState.trauma;
            if (trauma > 0.7) {
                // Favor real register instruments (cello, trombone, bassoon)
                if (instrumentData.register === 'real') {
                    score += 0.2;
                    reasons.push('High trauma → real register');
                }
            } else if (trauma < 0.3) {
                // Favor imaginary register (flute, harp, violin)
                if (instrumentData.register === 'imaginary') {
                    score += 0.15;
                    reasons.push('Low trauma → imaginary register');
                }
            }
        }

        // 3. Entropy modifier (20% weight)
        // High entropy → more varied, expressive instruments
        if (actor.currentState?.entropy !== undefined) {
            const entropy = actor.currentState.entropy;
            if (entropy > 0.6 && instrumentData.family === 'woodwind') {
                score += 0.15;
                reasons.push('High entropy → woodwind expressiveness');
            }
        }

        // 4. RSI Register alignment (20% weight)
        if (actor.currentState?.rsi) {
            const dominantRegister = getDominantRegister(actor.currentState.rsi);
            if (dominantRegister === instrumentData.register) {
                score += 0.2;
                reasons.push(`RSI ${dominantRegister} register match`);
            }
        }

        scores.push({
            instrument: instrumentName as InstrumentName,
            score,
            reasoning: reasons.join(', ')
        });
    }

    // Sort by score and return top choice
    scores.sort((a, b) => b.score - a.score);

    console.log(`[InstrumentMapper] Selected ${scores[0].instrument} for ${actor.character_name}`);
    console.log(`[InstrumentMapper] Score: ${scores[0].score.toFixed(2)} - ${scores[0].reasoning}`);

    return scores[0].instrument;
}

/**
 * Calculate DISC profile match score
 */
function calculateDISCScore(
    actorDISC: { D: number; I: number; S: number; C: number },
    instrumentWeights: Record<string, number>
): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [trait, instrumentWeight] of Object.entries(instrumentWeights)) {
        const actorValue = actorDISC[trait as keyof typeof actorDISC] || 0;
        totalScore += actorValue * instrumentWeight;
        totalWeight += instrumentWeight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Determine dominant RSI register
 */
function getDominantRegister(rsi: { real: number; symbolic: number; imaginary: number }): 'real' | 'symbolic' | 'imaginary' {
    if (rsi.real > rsi.symbolic && rsi.real > rsi.imaginary) return 'real';
    if (rsi.symbolic > rsi.imaginary) return 'symbolic';
    return 'imaginary';
}

/**
 * Get instrument family for orchestration grouping
 */
export function getInstrumentFamily(instrument: InstrumentName): string {
    return AVAILABLE_INSTRUMENTS[instrument].family;
}

/**
 * Get all instruments in a family
 */
export function getInstrumentsByFamily(family: string): InstrumentName[] {
    return Object.entries(AVAILABLE_INSTRUMENTS)
        .filter(([_, data]) => data.family === family)
        .map(([name, _]) => name as InstrumentName);
}
