
import { describe, expect, it } from 'vitest';
import { selectInstrumentForActor, InstrumentName } from '../psychometric_instrument_mapper';
import { ActorProfile } from '@/components/mpn-lab/score_types';

describe('Psychometric Instrument Mapper', () => {

    const mockActor = (
        name: string,
        disc: { D: number, I: number, S: number, C: number },
        trauma: number = 0,
        entropy: number = 0,
        rsi: { real: number, symbolic: number, imaginary: number } = { real: 0.33, symbolic: 0.33, imaginary: 0.33 }
    ): ActorProfile => ({
        id: name.toLowerCase(),
        name,
        disc,
        currentState: {
            trauma,
            entropy,
            rsi
        }
    });

    it('should select BRASS for High Dominance (D)', () => {
        // High Dominance, low others
        const actor = mockActor('General', { D: 0.9, I: 0.2, S: 0.1, C: 0.3 });
        const instrument = selectInstrumentForActor(actor);
        // Trumpet, Trombone, Tuba are D-heavy
        expect(['trumpet', 'trombone', 'tuba', 'french_horn', 'timpani', 'cymbals']).toContain(instrument);
    });

    it('should select STRINGS for High Steadiness (S)', () => {
        // High Steadiness
        const actor = mockActor('Healer', { D: 0.1, I: 0.3, S: 0.9, C: 0.4 });
        const instrument = selectInstrumentForActor(actor);
        expect(['violin', 'viola', 'cello', 'contrabass']).toContain(instrument);
    });

    it('should select WOODWINDS for High Influence (I)', () => {
        // High Influence
        const actor = mockActor('Bard', { D: 0.2, I: 0.9, S: 0.3, C: 0.2 });
        const instrument = selectInstrumentForActor(actor);
        expect(['flute', 'clarinet', 'oboe', 'bassoon']).toContain(instrument);
    });

    it('should select KEYBOARD for High Compliance (C)', () => {
        // High Compliance
        const actor = mockActor('Scholar', { D: 0.2, I: 0.2, S: 0.3, C: 0.95 });
        const instrument = selectInstrumentForActor(actor);
        expect(['piano', 'harp', 'celesta']).toContain(instrument);
    });

    it('should prefer REAL register instruments when TRAUMA is HIGH', () => {
        // High Trauma -> Real Register preference
        // Even with High C (Piano - Symbolic), high trauma should push towards Real?
        // Let's test a borderline case.
        // High S (Strings - mostly real/imaginary) + High Trauma
        const actor = mockActor('Traumatized', { D: 0.4, I: 0.1, S: 0.8, C: 0.4 }, 0.9, 0.2);
        const instrument = selectInstrumentForActor(actor);

        // Cello/Contrabass are Real. Violin is Imaginary.
        // Expect Cello or Contrabass.
        expect(['cello', 'contrabass', 'trombone', 'tuba', 'bassoon']).toContain(instrument);
    });

    it('should prefer IMAGINARY register instruments when TRAUMA is LOW', () => {
        // Low Trauma -> Imaginary Register preference
        const actor = mockActor('Dreamer', { D: 0.1, I: 0.8, S: 0.5, C: 0.2 }, 0.1, 0.2);
        // Flute is Imaginary.
        const instrument = selectInstrumentForActor(actor);
        expect(['flute', 'harp', 'violin', 'french_horn', 'celesta']).toContain(instrument);
    });

    it('should prefer WOODWINDS when ENTROPY is HIGH', () => {
        // High Entropy -> Woodwind expressiveness
        // Actor with neutral profile but high entropy
        const actor = mockActor('Chaos', { D: 0.4, I: 0.4, S: 0.4, C: 0.4 }, 0.5, 0.9);
        const instrument = selectInstrumentForActor(actor);
        expect(['flute', 'clarinet', 'oboe', 'bassoon']).toContain(instrument);
    });

});
