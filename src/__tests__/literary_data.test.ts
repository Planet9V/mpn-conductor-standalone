/**
 * MPN Literary Data Tests
 * Tests for the scenario and literary data
 */

import { describe, it, expect } from 'vitest';
import { LITERARY_SCENARIOS } from '@/components/mpn-lab/literary_data';
import type { LiteraryScenario, ScenarioFrame } from '@/components/mpn-lab/types';

describe('Literary Scenarios', () => {
    describe('Scenario Structure', () => {
        it('should have literary scenarios defined', () => {
            expect(LITERARY_SCENARIOS).toBeDefined();
            expect(Array.isArray(LITERARY_SCENARIOS)).toBe(true);
            expect(LITERARY_SCENARIOS.length).toBeGreaterThan(0);
        });

        it('should have valid scenario structure', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                expect(scenario.id).toBeDefined();
                expect(scenario.title).toBeDefined();
                expect(scenario.frames).toBeDefined();
                expect(Array.isArray(scenario.frames)).toBe(true);
            });
        });

        it('should have frames with required fields', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    expect(frame.name).toBeDefined();
                    expect(frame.description).toBeDefined();
                    expect(frame.trauma).toBeDefined();
                    expect(frame.entropy).toBeDefined();
                });
            });
        });

        it('should have unique scenario IDs', () => {
            const ids = LITERARY_SCENARIOS.map((s) => s.id);
            const uniqueIds = new Set(ids);

            expect(uniqueIds.size).toBe(ids.length);
        });
    });

    describe('Scenario Content', () => {
        it('should have Shakespeare scenarios', () => {
            const shakespeareScenarios = LITERARY_SCENARIOS.filter(
                (s) =>
                    s.author?.includes('Shakespeare') ||
                    ['hamlet', 'macbeth', 'othello', 'king_lear'].some((name) => s.id.includes(name))
            );

            expect(shakespeareScenarios.length).toBeGreaterThan(0);
        });

        it('should have frames with script data', () => {
            let hasScript = false;

            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    if (frame.script) {
                        hasScript = true;
                        expect(frame.script.speaker).toBeDefined();
                        expect(frame.script.text).toBeDefined();
                    }
                });
            });

            expect(hasScript).toBe(true);
        });

        it('should have script text with content', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    if (frame.script) {
                        expect(frame.script.text.length).toBeGreaterThan(0);
                    }
                });
            });
        });

        it('should have consistent speaker names within scenarios', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    if (frame.script) {
                        expect(typeof frame.script.speaker).toBe('string');
                        expect(frame.script.speaker.length).toBeGreaterThan(0);
                    }
                });
            });
        });
    });

    describe('Frame Analysis', () => {
        it('should have optional analysis field in script', () => {
            let hasAnalysis = false;

            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    if (frame.script?.analysis) {
                        hasAnalysis = true;
                    }
                });
            });

            expect(hasAnalysis).toBe(true);
        });

        it('should have optional chord suggestions in script', () => {
            let hasChords = false;

            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    if (frame.script?.chord) {
                        hasChords = true;
                    }
                });
            });

            expect(hasChords).toBe(true);
        });

        it('should have valid trauma values (0-1)', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    expect(frame.trauma).toBeGreaterThanOrEqual(0);
                    expect(frame.trauma).toBeLessThanOrEqual(1);
                });
            });
        });

        it('should have valid entropy values (0-1)', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    expect(frame.entropy).toBeGreaterThanOrEqual(0);
                    expect(frame.entropy).toBeLessThanOrEqual(1);
                });
            });
        });
    });

    describe('Scenario Playback Validity', () => {
        it('should have at least 3 frames per scenario', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                expect(scenario.frames.length).toBeGreaterThanOrEqual(3);
            });
        });

        it('should have displayable scenario titles', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                expect(scenario.title.length).toBeGreaterThan(2);
                expect(scenario.title.length).toBeLessThan(100);
            });
        });

        it('should not have empty frame names', () => {
            LITERARY_SCENARIOS.forEach((scenario) => {
                scenario.frames.forEach((frame: ScenarioFrame) => {
                    expect(frame.name.trim().length).toBeGreaterThan(0);
                });
            });
        });
    });
});

describe('Scenario Selection', () => {
    it('should be able to select first scenario', () => {
        const firstScenario = LITERARY_SCENARIOS[0];

        expect(firstScenario).toBeDefined();
        expect(firstScenario.id).toBeDefined();
        expect(firstScenario.frames.length).toBeGreaterThan(0);
    });

    it('should be able to iterate through all scenarios', () => {
        let count = 0;

        LITERARY_SCENARIOS.forEach(() => {
            count++;
        });

        expect(count).toBe(LITERARY_SCENARIOS.length);
    });

    it('should find scenario by ID', () => {
        const firstId = LITERARY_SCENARIOS[0].id;
        const found = LITERARY_SCENARIOS.find((s) => s.id === firstId);

        expect(found).toBeDefined();
        expect(found?.id).toBe(firstId);
    });
});
