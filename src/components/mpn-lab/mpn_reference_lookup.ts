/**
 * MPN Reference Lookup Utilities
 * Provides lookup functions for the score orchestrator to use reference entries
 */

import {
    MPN_REFERENCE_DICTIONARY,
    getEntriesByCategory,
    searchEntries,
    getAdjustableEntries
} from './mpn_reference_data';
import {
    MPNCategory,
    PsychometricDimension,
    MPNReferenceEntry,
    ParameterAdjustment
} from './mpn_reference_types';
import {
    OrchestrationOption,
    ORCHESTRATION_OPTIONS,
    OrchestrationConfig
} from './mpn_orchestration_options';

// ============================================================================
// LOOKUP BY PSYCHOMETRIC STATE
// ============================================================================

/**
 * Get the appropriate time signature based on entropy level
 */
export function lookupTimeSignature(entropy: number): string {
    const rhythmEntries = getEntriesByCategory(MPNCategory.RHYTHM)
        .filter(e => e.subcategory === 'time_signature');

    // Find matching entry based on entropy condition
    for (const entry of rhythmEntries) {
        const mapping = entry.psychometricMappings[0];
        if (!mapping.condition) continue;

        if (mapping.condition === '< 0.3' && entropy < 0.3) {
            return entry.musicalElement.split(' ')[0]; // "4/4"
        }
        if (mapping.condition === '0.3-0.5' && entropy >= 0.3 && entropy < 0.5) {
            return entry.musicalElement.split(' ')[0]; // "3/4"
        }
        if (mapping.condition === '0.6-0.8' && entropy >= 0.6 && entropy < 0.8) {
            return '5/4';
        }
        if (mapping.condition === '> 0.8' && entropy >= 0.8) {
            return 'free';
        }
    }
    return '4/4'; // Default
}

/**
 * Get tempo range based on stability/crisis level
 */
export function lookupTempoRange(
    stability: 'strategic' | 'operational' | 'crisis',
    adjustments?: Record<string, ParameterAdjustment>
): { min: number; max: number } {
    const tempoEntries = getEntriesByCategory(MPNCategory.RHYTHM)
        .filter(e => e.subcategory === 'tempo');

    for (const entry of tempoEntries) {
        const mapping = entry.psychometricMappings[0];
        if (mapping.trait?.toLowerCase() === stability && entry.implementation.bpmRange) {
            // Check for override
            if (adjustments && adjustments[entry.id] && adjustments[entry.id].tempo) {
                const adjTempo = adjustments[entry.id].tempo!;
                // Create a narrow range around the specific adjusted tempo, or use it as center
                return { min: adjTempo - 10, max: adjTempo + 10 };
            }
            return entry.implementation.bpmRange;
        }
    }
    return { min: 80, max: 100 }; // Default operational
}

/**
 * Get dynamics (velocity) based on trauma level
 */
export function lookupDynamics(
    trauma: number,
    adjustments?: Record<string, ParameterAdjustment>
): { velocity: number; label: string } {
    const dynamicEntries = getEntriesByCategory(MPNCategory.DYNAMICS)
        .filter(e => e.subcategory === 'volume_level');

    for (const entry of dynamicEntries) {
        const mapping = entry.psychometricMappings[0];
        if (!mapping.condition) continue;

        // Helper to check range
        const inRange = (cond: string, val: number) => {
            if (cond.includes('-')) {
                const [min, max] = cond.split('-').map(parseFloat);
                return val >= min && val < max;
            }
            if (cond.includes('>')) return val >= parseFloat(cond.replace('> ', ''));
            if (cond.includes('<')) return val < parseFloat(cond.replace('< ', ''));
            return false;
        };

        if (inRange(mapping.condition, trauma)) {
            // Check override
            if (adjustments && adjustments[entry.id] && adjustments[entry.id].dynamics) {
                // If override exists, return it. Note: Label might involve calculation or stick to default
                return { velocity: adjustments[entry.id].dynamics!, label: entry.musicalElement.split(' ')[0] };
            }
            return { velocity: entry.defaultValue as number || 72, label: entry.musicalElement.split(' ')[0] };
        }
    }

    // Interpolate/Default
    return { velocity: 72, label: 'mf' };
}

/**
 * Get articulation based on Cognitive Bias
 */
export function lookupArticulation(
    biases: string[], // e.g. ["confirmation_bias", "anchoring"]
    adjustments?: Record<string, ParameterAdjustment>
): string {
    const artEntries = getEntriesByCategory(MPNCategory.ARTICULATION);

    // Priority: Explicit adjustments -> known biases -> default
    for (const bias of biases) {
        // Find entry mapping to this bias
        const entry = artEntries.find(e =>
            e.psychometricMappings.some(m => m.trait?.toLowerCase() === bias.toLowerCase() || m.description.toLowerCase().includes(bias.toLowerCase()))
        );

        if (entry) {
            return entry.musicalElement.toLowerCase(); // "staccato", "marcato"
        }
    }

    return 'legato'; // Default flow
}

/**
 * Get Mode/Scale based on Emotion/RSI
 */
export function lookupMode(
    emotion: string, // "anger", "grief", "joy"
    rsi: { real: number, symbolic: number, imaginary: number },
    adjustments?: Record<string, ParameterAdjustment>
): string {
    const modeEntries = getEntriesByCategory(MPNCategory.MODE);

    // 1. Emotion (Primary driver)
    if (emotion) {
        const entry = modeEntries.find(e =>
            e.psychometricMappings.some(m => m.trait?.toLowerCase().includes(emotion.toLowerCase()))
        );
        if (entry) return entry.musicalElement.split(' ')[0].toLowerCase();
    }

    // 2. RSI (Fallback driver)
    if (rsi.real > 0.6) return 'locrian'; // Void
    if (rsi.real > 0.4) return 'phrygian'; // Tension

    if (rsi.imaginary > 0.6) return 'lydian'; // Fantasy
    if (rsi.imaginary > 0.4) return 'mixolydian'; // Hope

    if (rsi.symbolic > 0.6) return 'ionian'; // Order
    return 'dorian'; // Balanced melancholy
}

/**
 * Get chord type based on emotional state
 */
export function lookupChordType(emotion: string): number[] | undefined {
    const harmonyEntries = getEntriesByCategory(MPNCategory.HARMONY)
        .filter(e => e.subcategory === 'chord_type');

    for (const entry of harmonyEntries) {
        const mapping = entry.psychometricMappings[0];
        if (mapping.trait?.toLowerCase().includes(emotion.toLowerCase())) {
            return entry.implementation.chordFormula;
        }
    }
    return undefined;
}

/**
 * Get mode/scale based on Lacanian register
 */
export function lookupModeScale(register: 'real' | 'symbolic' | 'imaginary'): number[] | undefined {
    const modeEntries = getEntriesByCategory(MPNCategory.MODE)
        .filter(e => e.subcategory === 'scale_mode');

    for (const entry of modeEntries) {
        const mapping = entry.psychometricMappings[0];
        if (mapping.trait?.toLowerCase() === register) {
            return entry.implementation.scaleFormula;
        }
    }
    return undefined;
}

/**
 * Get mode name based on Lacanian register
 */
export function lookupModeName(register: 'real' | 'symbolic' | 'imaginary'): string {
    const modeEntries = getEntriesByCategory(MPNCategory.MODE)
        .filter(e => e.subcategory === 'scale_mode');

    for (const entry of modeEntries) {
        const mapping = entry.psychometricMappings[0];
        if (mapping.trait?.toLowerCase() === register) {
            return entry.musicalElement.split(' ')[0].toLowerCase();
        }
    }
    // Fallback based on register
    if (register === 'real') return 'phrygian';
    if (register === 'imaginary') return 'lydian';
    return 'major';
}

/**
 * Get instrument based on DISC profile
 */
export function lookupInstrument(
    disc: 'D' | 'I' | 'S' | 'C',
    orchestration: OrchestrationOption = OrchestrationOption.LEITMOTIF_WAGNERIAN
): string[] {
    const config = ORCHESTRATION_OPTIONS[orchestration];
    const voice = config.voiceConfiguration.find(v => v.discMapping === disc);
    return voice?.instruments || [];
}



/**
 * Get interval quality based on relationship
 */
export function lookupInterval(relationshipQuality: 'aligned' | 'creative_tension' | 'conflict'): number {
    const intervalEntries = getEntriesByCategory(MPNCategory.INTERVALS);

    const qualityMap: Record<string, string> = {
        'aligned': 'Total Alignment',
        'creative_tension': 'Creative Tension',
        'conflict': 'Rupture/Conflict'
    };

    for (const entry of intervalEntries) {
        const mapping = entry.psychometricMappings[0];
        if (mapping.trait === qualityMap[relationshipQuality]) {
            // Return interval in semitones
            if (entry.displayName.includes('Perfect 5th')) return 7;
            if (entry.displayName.includes('3rd')) return 4;
            if (entry.displayName.includes('2nd')) return 2;
            if (entry.displayName.includes('Tritone')) return 6;
        }
    }
    return 7; // Default perfect 5th
}

// ============================================================================
// BULK LOOKUP
// ============================================================================

export interface ReferenceBasedParams {
    timeSignature: string;
    tempoRange: { min: number; max: number };
    dynamics: { velocity: number; label: string };
    scale?: number[];
    interval: number;
}

/**
 * Get all reference-based parameters for a psychometric state
 */
export function lookupAllParams(
    trauma: number,
    entropy: number,
    dominantRegister: 'real' | 'symbolic' | 'imaginary',
    stability: 'strategic' | 'operational' | 'crisis' = 'operational',
    adjustments?: Record<string, ParameterAdjustment>
): ReferenceBasedParams {
    return {
        timeSignature: lookupTimeSignature(entropy),
        tempoRange: lookupTempoRange(stability, adjustments),
        dynamics: lookupDynamics(trauma, adjustments),
        scale: lookupModeScale(dominantRegister),
        interval: lookupInterval(trauma > 0.7 ? 'conflict' : trauma > 0.4 ? 'creative_tension' : 'aligned')
    };
}


// ============================================================================
// ORCHESTRATION CONFIG LOOKUP
// ============================================================================

/**
 * Get full orchestration configuration
 */
export function getOrchestrationConfig(option: OrchestrationOption = OrchestrationOption.LEITMOTIF_WAGNERIAN): OrchestrationConfig {
    return ORCHESTRATION_OPTIONS[option];
}

/**
 * Get instrument palette for orchestration option
 */
export function getInstrumentPalette(option: OrchestrationOption = OrchestrationOption.LEITMOTIF_WAGNERIAN) {
    return ORCHESTRATION_OPTIONS[option].instrumentPalette;
}
