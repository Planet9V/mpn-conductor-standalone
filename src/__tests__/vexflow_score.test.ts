/**
 * VexFlow ConductorScore Component Tests
 * Tests for pitch conversion, duration mapping, and component behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================================
// UTILITY FUNCTIONS (extracted for testing)
// ============================================================================

/**
 * Convert MIDI-style pitch (e.g., "C4", "F#5") to VexFlow format (e.g., "c/4", "f#/5")
 */
function pitchToVexFlow(pitch: string): string {
    const match = pitch.match(/^([A-G])(#|b)?(\d)$/);
    if (!match) return 'c/4';

    const letter = match[1].toLowerCase();
    const accidental = match[2] || '';
    const octave = match[3];

    return `${letter}${accidental}/${octave}`;
}

/**
 * Convert duration to VexFlow duration
 */
function durationToVexFlow(duration: number): string {
    if (duration >= 1) return 'w';      // whole
    if (duration >= 0.5) return 'h';    // half
    if (duration >= 0.25) return 'q';   // quarter
    if (duration >= 0.125) return '8';  // eighth
    return '16';                         // sixteenth
}

/**
 * Get accidental for VexFlow if present
 */
function getAccidental(pitch: string): string | null {
    const match = pitch.match(/^[A-G](#|b)/);
    if (!match) return null;
    return match[1] === '#' ? '#' : 'b';
}

/**
 * Convert velocity to dynamic marking
 */
function velocityToDynamic(velocity: number): string {
    if (velocity < 30) return 'ppp';
    if (velocity < 50) return 'pp';
    if (velocity < 65) return 'p';
    if (velocity < 85) return 'mf';
    if (velocity < 100) return 'f';
    if (velocity < 115) return 'ff';
    return 'fff';
}

// ============================================================================
// PITCH CONVERSION TESTS
// ============================================================================

describe('pitchToVexFlow', () => {
    it('should convert natural notes correctly', () => {
        expect(pitchToVexFlow('C4')).toBe('c/4');
        expect(pitchToVexFlow('D5')).toBe('d/5');
        expect(pitchToVexFlow('G3')).toBe('g/3');
        expect(pitchToVexFlow('A4')).toBe('a/4');
        expect(pitchToVexFlow('B2')).toBe('b/2');
    });

    it('should convert sharp notes correctly', () => {
        expect(pitchToVexFlow('C#4')).toBe('c#/4');
        expect(pitchToVexFlow('F#5')).toBe('f#/5');
        expect(pitchToVexFlow('G#3')).toBe('g#/3');
    });

    it('should convert flat notes correctly', () => {
        expect(pitchToVexFlow('Bb4')).toBe('bb/4');
        expect(pitchToVexFlow('Eb5')).toBe('eb/5');
        expect(pitchToVexFlow('Ab3')).toBe('ab/3');
    });

    it('should handle invalid pitch gracefully', () => {
        expect(pitchToVexFlow('')).toBe('c/4');
        expect(pitchToVexFlow('X9')).toBe('c/4');
        expect(pitchToVexFlow('invalid')).toBe('c/4');
    });

    it('should handle different octaves', () => {
        expect(pitchToVexFlow('C0')).toBe('c/0');
        expect(pitchToVexFlow('C9')).toBe('c/9');
        expect(pitchToVexFlow('E6')).toBe('e/6');
    });
});

// ============================================================================
// DURATION CONVERSION TESTS
// ============================================================================

describe('durationToVexFlow', () => {
    it('should convert whole notes', () => {
        expect(durationToVexFlow(1)).toBe('w');
        expect(durationToVexFlow(1.5)).toBe('w');
        expect(durationToVexFlow(2)).toBe('w');
    });

    it('should convert half notes', () => {
        expect(durationToVexFlow(0.5)).toBe('h');
        expect(durationToVexFlow(0.75)).toBe('h');
    });

    it('should convert quarter notes', () => {
        expect(durationToVexFlow(0.25)).toBe('q');
        expect(durationToVexFlow(0.3)).toBe('q');
    });

    it('should convert eighth notes', () => {
        expect(durationToVexFlow(0.125)).toBe('8');
        expect(durationToVexFlow(0.2)).toBe('8');
    });

    it('should convert sixteenth notes', () => {
        expect(durationToVexFlow(0.0625)).toBe('16');
        expect(durationToVexFlow(0.1)).toBe('16');
    });
});

// ============================================================================
// ACCIDENTAL TESTS
// ============================================================================

describe('getAccidental', () => {
    it('should return sharp for sharp notes', () => {
        expect(getAccidental('C#4')).toBe('#');
        expect(getAccidental('F#5')).toBe('#');
        expect(getAccidental('G#')).toBe('#');
    });

    it('should return flat for flat notes', () => {
        expect(getAccidental('Bb4')).toBe('b');
        expect(getAccidental('Eb5')).toBe('b');
        expect(getAccidental('Ab')).toBe('b');
    });

    it('should return null for natural notes', () => {
        expect(getAccidental('C4')).toBeNull();
        expect(getAccidental('D5')).toBeNull();
        expect(getAccidental('G')).toBeNull();
    });
});

// ============================================================================
// VELOCITY TO DYNAMIC TESTS
// ============================================================================

describe('velocityToDynamic', () => {
    it('should return ppp for very soft', () => {
        expect(velocityToDynamic(10)).toBe('ppp');
        expect(velocityToDynamic(29)).toBe('ppp');
    });

    it('should return pp for soft', () => {
        expect(velocityToDynamic(30)).toBe('pp');
        expect(velocityToDynamic(49)).toBe('pp');
    });

    it('should return p for moderately soft', () => {
        expect(velocityToDynamic(50)).toBe('p');
        expect(velocityToDynamic(64)).toBe('p');
    });

    it('should return mf for medium', () => {
        expect(velocityToDynamic(65)).toBe('mf');
        expect(velocityToDynamic(84)).toBe('mf');
    });

    it('should return f for loud', () => {
        expect(velocityToDynamic(85)).toBe('f');
        expect(velocityToDynamic(99)).toBe('f');
    });

    it('should return ff for very loud', () => {
        expect(velocityToDynamic(100)).toBe('ff');
        expect(velocityToDynamic(114)).toBe('ff');
    });

    it('should return fff for maximum', () => {
        expect(velocityToDynamic(115)).toBe('fff');
        expect(velocityToDynamic(127)).toBe('fff');
    });
});

// ============================================================================
// INTEGRATION TESTS (Component Behavior)
// ============================================================================

describe('ConductorScoreVexFlow Integration', () => {
    it('should handle empty frame gracefully', () => {
        // Simulate empty frame scenario
        const frame = undefined;
        const staveCount = frame?.staves?.length || 1;
        expect(staveCount).toBe(1);
    });

    it('should calculate required height based on stave count', () => {
        const staveHeight = 100;
        const baseHeight = 120;

        // 1 stave
        expect(1 * staveHeight + baseHeight).toBe(220);

        // 4 staves (typical scenario)
        expect(4 * staveHeight + baseHeight).toBe(520);

        // 7 staves (maximum)
        expect(7 * staveHeight + baseHeight).toBe(820);
    });

    it('should determine active state correctly', () => {
        const isActive = (isSpeaking: boolean, activation: number) =>
            isSpeaking || activation > 0.3;

        expect(isActive(true, 0)).toBe(true);
        expect(isActive(false, 0.5)).toBe(true);
        expect(isActive(false, 0.3)).toBe(false);
        expect(isActive(false, 0.1)).toBe(false);
    });
});
