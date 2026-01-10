/**
 * MPN Reference Lookup Utilities
 * Provides lookup functions for the score orchestrator to use reference entries
 * Refactored for Phase 10: Deep Psychometric Integration
 */

import {
    getEntriesByCategory,
    getAdjustableEntries
} from './mpn_reference_data';
import {
    MPNCategory,
    PsychometricDimension,
    MPNReferenceEntry,
    ParameterAdjustment,
    PsychometricMapping
} from './mpn_reference_types';
import {
    OrchestrationOption,
    ORCHESTRATION_OPTIONS,
    OrchestrationConfig
} from './mpn_orchestration_options';

// ============================================================================
// GENERIC HELPERS
// ============================================================================

/**
 * Check if a value satisfies a condition string (e.g. "> 0.5", "0.3-0.7")
 */
export function checkCondition(condition: string | undefined, value: number): boolean {
    if (!condition) return true; // No condition means always match (if trait matches)

    try {
        if (condition.includes('-')) {
            const [min, max] = condition.split('-').map(s => parseFloat(s.trim()));
            return value >= min && value <= max;
        }
        if (condition.includes('>=')) return value >= parseFloat(condition.replace('>=', '').trim());
        if (condition.includes('<=')) return value <= parseFloat(condition.replace('<=', '').trim());
        if (condition.includes('>')) return value > parseFloat(condition.replace('>', '').trim());
        if (condition.includes('<')) return value < parseFloat(condition.replace('<', '').trim());
        if (condition.includes('=')) return value === parseFloat(condition.replace('=', '').trim());
    } catch (e) {
        console.warn(`[MPN Lookup] Invalid condition format: ${condition}`, e);
        return false;
    }
    return false;
}

/**
 * Find the best matching entry for a numeric dimension
 */
function findEntryByNumericCondition(
    category: MPNCategory,
    subcategory: string | undefined,
    dimension: PsychometricDimension,
    value: number
): MPNReferenceEntry | undefined {
    let entries = getEntriesByCategory(category);
    if (subcategory) {
        entries = entries.filter(e => e.subcategory === subcategory);
    }

    // Sort by signal strength (descending) to prefer stronger matches
    // Note: This is an approximation as entries might have multiple mappings
    // We'll prioritize entries where the *matching* mapping is strong.

    for (const entry of entries) {
        const matchingMapping = entry.psychometricMappings.find(m =>
            m.dimension === dimension && checkCondition(m.condition, value)
        );

        if (matchingMapping) {
            return entry;
        }
    }
    return undefined;
}

/**
 * Find the best matching entry for a trait/string dimension
 */
function findEntryByTrait(
    category: MPNCategory,
    subcategory: string | undefined,
    dimension: PsychometricDimension,
    trait: string
): MPNReferenceEntry | undefined {
    let entries = getEntriesByCategory(category);
    if (subcategory) {
        entries = entries.filter(e => e.subcategory === subcategory);
    }

    return entries.find(entry =>
        entry.psychometricMappings.some(m =>
            m.dimension === dimension &&
            m.trait?.toLowerCase().includes(trait.toLowerCase())
        )
    );
}

// ============================================================================
// SPECIFIC LOOKUPS (Refactored to use Generic Helpers)
// ============================================================================

/**
 * Get the appropriate time signature based on entropy level
 */
export function lookupTimeSignature(entropy: number): string {
    const entry = findEntryByNumericCondition(
        MPNCategory.RHYTHM,
        'time_signature',
        PsychometricDimension.ENTROPY,
        entropy
    );

    // Extract signature from musicalElement (e.g., "4/4 (Common Time)" -> "4/4")
    return entry ? entry.musicalElement.split(' ')[0] : '4/4';
}

/**
 * Get tempo range based on stability/crisis level
 */
export function lookupTempoRange(
    stability: 'strategic' | 'operational' | 'crisis',
    adjustments?: Record<string, ParameterAdjustment>
): { min: number; max: number } {
    const entry = findEntryByTrait(
        MPNCategory.RHYTHM,
        'tempo',
        PsychometricDimension.STABILITY,
        stability
    );

    if (entry) {
        if (adjustments?.[entry.id]?.tempo) {
            const t = adjustments[entry.id].tempo!;
            return { min: t - 10, max: t + 10 };
        }
        return entry.implementation?.bpmRange || { min: 80, max: 100 };
    }

    return { min: 80, max: 100 };
}

/**
 * Get dynamics (velocity) based on trauma level (or Extraversion)
 */
export function lookupDynamics(
    trauma: number,
    adjustments?: Record<string, ParameterAdjustment>
): { velocity: number; label: string } {
    // Try Trauma first
    let entry = findEntryByNumericCondition(
        MPNCategory.DYNAMICS,
        'volume_level',
        PsychometricDimension.TRAUMA,
        trauma
    );

    if (!entry) {
        // Fallback logic could go here, or just return default
    }

    if (entry) {
        const label = entry.musicalElement.split(' ')[0]; // "ff"
        let velocity = entry.defaultValue as number || 70;

        if (adjustments?.[entry.id]?.dynamics) {
            velocity = adjustments[entry.id].dynamics!;
        }

        return { velocity, label };
    }

    return { velocity: 72, label: 'mf' };
}

/**
 * Get articulation based on Cognitive Bias or Traits
 */
export function lookupArticulation(
    trauma: number,
    biases: string[],
    adjustments?: Record<string, ParameterAdjustment>
): string {
    // High trauma overrides everything
    if (trauma > 0.7) return 'sforzando';
    if (trauma > 0.5) return 'marcato';
    // Try each bias until we find a mapping
    for (const bias of biases) {
        const entry = findEntryByTrait(
            MPNCategory.ARTICULATION,
            undefined, // Any subcategory
            PsychometricDimension.COGNITIVE_BIAS, // Or check general traits
            bias
        );

        // Also check if bias matches a DISC trait or Big Five trait if passed as string
        // But predominantly these come in as specific bias strings like "Confirmation Bias"

        if (!entry) {
            // Try searching text if trait lookup failed
            const textEntry = getEntriesByCategory(MPNCategory.ARTICULATION).find(e =>
                e.psychometricMappings.some(m => m.trait?.toLowerCase().includes(bias.toLowerCase()) || m.description.toLowerCase().includes(bias.toLowerCase()))
            );
            if (textEntry) return textEntry.musicalElement.toLowerCase();
        }

        if (entry) return entry.musicalElement.toLowerCase();
    }

    return 'legato';
}

/**
 * Get Mode/Scale based on Emotion (Primary) or RSI (Secondary)
 */
export function lookupMode(
    emotion: string,
    rsi: { real: number, symbolic: number, imaginary: number },
    adjustments?: Record<string, ParameterAdjustment>
): string {
    // 1. Emotion (Explicit mapping)
    if (emotion) {
        const entry = findEntryByTrait(MPNCategory.MODE, undefined, PsychometricDimension.EMOTION, emotion);
        if (entry) return entry.musicalElement.split(' ')[0].toLowerCase();
    }

    // 2. RSI (Lacanian Register)
    // Determine dominant register
    const registers = [
        { name: 'real', value: rsi.real },
        { name: 'symbolic', value: rsi.symbolic },
        { name: 'imaginary', value: rsi.imaginary }
    ].sort((a, b) => b.value - a.value);

    const dominant = registers[0].name;
    const entry = findEntryByTrait(MPNCategory.MODE, 'scale_mode', PsychometricDimension.LACANIAN, dominant);

    return entry ? entry.musicalElement.split(' ')[0].toLowerCase() : 'major';
}

/**
 * Get chord type based on emotional state
 */
export function lookupChordType(emotion: string): number[] | undefined {
    const entry = findEntryByTrait(MPNCategory.HARMONY, 'chord_type', PsychometricDimension.EMOTION, emotion);
    if (entry) return entry.implementation.chordFormula;

    // Fallback: Check OCEAN (Openness) -> Harmony complexity
    // But we need the Openness value, which isn't passed here.
    // For now, return undefined to let orchestrator handle default.
    return undefined;
}

/**
 * Get mode/scale based on Lacanian register
 */
export function lookupModeScale(register: 'real' | 'symbolic' | 'imaginary'): number[] | undefined {
    // Note: The dictionary keys Lacanian dimensions as "Real", "Symbolic", "Imaginary"
    const entry = findEntryByTrait(MPNCategory.MODE, 'scale_mode', PsychometricDimension.LACANIAN, register);
    return entry?.implementation.scaleFormula;
}

/**
 * Get mode name based on Lacanian register (for rsiToMode function)
 */
export function lookupModeName(register: 'real' | 'symbolic' | 'imaginary'): string {
    // Map Lacanian registers to modes based on MPN Canon
    const modeMap: Record<string, string> = {
        'real': 'phrygian',      // Dark, raw, traumatic
        'symbolic': 'ionian',    // Order, law, structure (major)
        'imaginary': 'lydian'    // Dreamy, aspirational, fantasy
    };
    return modeMap[register] || 'ionian';
}


/**
 * Get instrument based on DISC profile
 */
export function lookupInstrument(
    disc: 'D' | 'I' | 'S' | 'C',
    orchestration: OrchestrationOption = OrchestrationOption.LEITMOTIF_WAGNERIAN
): string[] {
    // This looks up the Orchestration Config (presets), NOT the reference dictionary
    // The reference dictionary might have general Timbre mappings, but instrument assignment 
    // is often specific to the "Orchestration Mode" (Wagnerian vs Minimalist vs Cyberpunk).
    // We keep this using the Config for now, or update it to query Dictionary if TIMBRE entries exist for instruments.

    const config = ORCHESTRATION_OPTIONS[orchestration];
    let voice = config.voiceConfiguration.find(v => v.discMapping === disc);

    // Fallback to Full Orchestra if specific mapping not found (common for Wagnerian/abstract modes)
    if (!voice) {
        voice = ORCHESTRATION_OPTIONS[OrchestrationOption.FULL_ORCHESTRA].voiceConfiguration.find(v => v.discMapping === disc);
    }

    return voice?.instruments || [];
}

/**
 * Get interval quality based on relationship
 */
export function lookupInterval(relationshipQuality: 'aligned' | 'creative_tension' | 'conflict'): number {
    const traitMap: Record<string, string> = {
        'aligned': 'Total Alignment',
        'creative_tension': 'Creative Tension',
        'conflict': 'Rupture/Conflict'
    };

    const entry = findEntryByTrait(
        MPNCategory.INTERVALS,
        undefined,
        PsychometricDimension.RELATIONSHIP,
        traitMap[relationshipQuality]
    );

    if (entry && entry.displayName.includes('Perfect 5th')) return 7;
    if (entry && entry.displayName.includes('3rd')) return 4;
    if (entry && entry.displayName.includes('2nd')) return 2;
    if (entry && entry.displayName.includes('Tritone')) return 6;

    return 7;
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

export function getOrchestrationConfig(option: OrchestrationOption = OrchestrationOption.LEITMOTIF_WAGNERIAN): OrchestrationConfig {
    return ORCHESTRATION_OPTIONS[option];
}

export function getInstrumentPalette(option: OrchestrationOption = OrchestrationOption.LEITMOTIF_WAGNERIAN) {
    return ORCHESTRATION_OPTIONS[option].instrumentPalette;
}
