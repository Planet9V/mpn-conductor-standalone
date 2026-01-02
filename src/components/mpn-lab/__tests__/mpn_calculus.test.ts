
import { describe, it, expect } from 'vitest';
import {
    lookupTempoRange,
    lookupDynamics,
    lookupAllParams
} from '../mpn_reference_lookup';
import {
    psychometricToMusical,
    traumaToDynamics,
    entropyToRhythm
} from '../psychometric_calculus';
import { ParameterAdjustment } from '../mpn_reference_types';

describe('MPN Calculus & Reference System', () => {

    describe('Default Lookups (No Adjustments)', () => {
        it('should return default operational tempo range', () => {
            const range = lookupTempoRange('operational');
            expect(range.min).toBe(80);
            expect(range.max).toBe(100);
        });

        it('should return default dynamics for medium trauma', () => {
            const result = lookupDynamics(0.5);
            expect(result.velocity).toBe(72);
            expect(result.label).toBe('mf');
        });
    });

    describe('Adjustment Overrides', () => {
        // ID for 'Normal Tempo' is rhythm-006
        const MOCK_ADJUSTMENTS: Record<string, ParameterAdjustment> = {
            'rhythm-006': {
                id: 'rhythm-006',
                tempo: 150
            },
            'dynamics-002': { // Medium dynamics
                id: 'dynamics-002',
                dynamics: 90
            }
        };

        it('should override tempo range when adjustment is present', () => {
            const range = lookupTempoRange('operational', MOCK_ADJUSTMENTS);
            // logic creates a +/- 10 range around the target
            expect(range.min).toBe(140);
            expect(range.max).toBe(160);
        });

        it('should override dynamics when adjustment is present', () => {
            // Trauma 0.5 maps to dynamics-002 (Medium)
            const result = lookupDynamics(0.5, MOCK_ADJUSTMENTS);
            expect(result.velocity).toBe(90);
            // Label comes from original element string "mf (mezzo-forte)" -> "mf"
            expect(result.label).toBe('mf');
        });

        it('should NOT override when stability does not match adjustment', () => {
            // 'strategic' maps to 'Slow Tempo' (rhythm-005), which we haven't adjusted
            const range = lookupTempoRange('strategic', MOCK_ADJUSTMENTS);
            expect(range.min).toBe(40); // Default slow
            expect(range.max).toBe(60);
        });
    });

    describe('Psychometric Calculus Integration', () => {
        const STATE = {
            trauma: 0.5,
            entropy: 0.5,
            rsi: { real: 0.3, symbolic: 0.4, imaginary: 0.3 },
            disc: { D: 0.2, I: 0.3, S: 0.3, C: 0.2 },
            ocean: { O: 0.5, C: 0.5, E: 0.5, A: 0.5, N: 0.5 },
            darkTriad: { narcissism: 0.1, machiavellianism: 0.1, psychopathy: 0.1 },
            cgn: { biasConfig: {} }
        };

        const MOCK_ADJUSTMENTS: Record<string, ParameterAdjustment> = {
            'rhythm-006': { // Operational default is 80-100
                id: 'rhythm-006',
                tempo: 140
            }
        };

        it('should calculate rhythm based on adjustments', () => {
            // Entropy 0.5 -> Operational stability
            // Without adjustment: 80-100 range. 0.5 entropy -> ~90
            const defaultRes = entropyToRhythm(0.5);
            expect(defaultRes.tempo).toBeGreaterThanOrEqual(80);
            expect(defaultRes.tempo).toBeLessThanOrEqual(100);

            // With adjustment: 140 target -> 130-150 range.
            const adjustedRes = entropyToRhythm(0.5, MOCK_ADJUSTMENTS);
            expect(adjustedRes.tempo).toBeGreaterThanOrEqual(130);
            expect(adjustedRes.tempo).toBeLessThanOrEqual(150);
        });

        it('should propogate adjustments through full psychometricToMusical', () => {
            const result = psychometricToMusical(STATE, MOCK_ADJUSTMENTS);
            expect(result.tempo).toBeGreaterThan(120); // Should be well above default
        });
    });
});
