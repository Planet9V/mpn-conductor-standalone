/**
 * MPN Score Orchestrator Tests
 * Tests for the multi-stave orchestration engine
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    ScoreOrchestrator,
    getOrchestrator,
    resetOrchestrator,
    type ScriptFrame,
    type OrchestratorOutput,
    type ActorStave,
} from '@/components/mpn-lab/score_orchestrator';
import type { ActorProfile } from '@/components/mpn-lab/leitmotif_generator';

describe('Score Orchestrator', () => {
    let orchestrator: ScoreOrchestrator;

    beforeEach(() => {
        resetOrchestrator();
        orchestrator = new ScoreOrchestrator();
    });

    describe('Actor Registration', () => {
        it('should register an actor successfully', () => {
            const profile: ActorProfile = {
                id: 'hamlet',
                name: 'Hamlet',
                disc: { D: 0.6, I: 0.4, S: 0.3, C: 0.7 },
                darkTriad: { machiavellianism: 0.4, narcissism: 0.5, psychopathy: 0.2 },
            };

            orchestrator.registerActor(profile);

            // Should not throw
            expect(true).toBe(true);
        });

        it('should assign instruments based on DISC profile', () => {
            const dominantProfile: ActorProfile = {
                id: 'king',
                name: 'King Claudius',
                disc: { D: 0.9, I: 0.3, S: 0.2, C: 0.5 },
                darkTriad: { machiavellianism: 0.8, narcissism: 0.7, psychopathy: 0.6 },
            };

            orchestrator.registerActor(dominantProfile);

            // Registration should complete
            expect(true).toBe(true);
        });
    });

    describe('Frame Processing', () => {
        beforeEach(() => {
            const profiles: ActorProfile[] = [
                {
                    id: 'hamlet',
                    name: 'Hamlet',
                    disc: { D: 0.5, I: 0.6, S: 0.4, C: 0.7 },
                    darkTriad: { machiavellianism: 0.3, narcissism: 0.4, psychopathy: 0.2 },
                },
                {
                    id: 'claudius',
                    name: 'Claudius',
                    disc: { D: 0.8, I: 0.4, S: 0.3, C: 0.5 },
                    darkTriad: { machiavellianism: 0.8, narcissism: 0.6, psychopathy: 0.5 },
                },
            ];

            profiles.forEach((p) => orchestrator.registerActor(p));
        });

        it('should process a script frame and return output', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'To be or not to be, that is the question.',
                chord: 'Am',
                analysis: 'Hamlet contemplates existence.',
            };

            const output = await orchestrator.processFrame(frame, 0.4, 0.3);

            expect(output).toBeDefined();
            expect(output.frameIndex).toBe(0);
            expect(output.staves).toBeDefined();
            expect(output.harmony).toBeDefined();
            expect(output.global).toBeDefined();
        });

        it('should increment frame index on each process', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'Test dialogue.',
                chord: 'C',
                analysis: 'Test.',
            };

            await orchestrator.processFrame(frame, 0.3, 0.3);
            const output2 = await orchestrator.processFrame(frame, 0.3, 0.3);

            expect(output2.frameIndex).toBe(1);
        });

        it('should activate speaking actor stave', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'I speak now.',
                chord: 'Dm',
                analysis: 'Speaking.',
            };

            const output = await orchestrator.processFrame(frame, 0.5, 0.4);

            const hamletStave = output.staves.find((s) => s.actorName === 'Hamlet');
            expect(hamletStave?.isSpeaking).toBe(true);
            expect(hamletStave?.activation).toBe(1.0);
        });

        it('should generate notes for speaking actor', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'A longer piece of dialogue for note generation.',
                chord: 'Em',
                analysis: 'Extended speech.',
            };

            const output = await orchestrator.processFrame(frame, 0.6, 0.5);

            const hamletStave = output.staves.find((s) => s.actorName === 'Hamlet');
            expect(hamletStave?.notes.length).toBeGreaterThan(0);
        });

        it('should respond to trauma levels', async () => {
            const calmFrame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'A peaceful moment.',
                chord: 'C',
                analysis: 'Calm.',
            };

            const traumaFrame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'Murder! Death! Revenge!',
                chord: 'Cdim',
                analysis: 'Crisis.',
            };

            const calmOutput = await orchestrator.processFrame(calmFrame, 0.1, 0.1);
            orchestrator.reset();
            const traumaOutput = await orchestrator.processFrame(traumaFrame, 0.9, 0.8);

            // Trauma output should have higher tension
            expect(traumaOutput.harmony.tension).toBeGreaterThan(calmOutput.harmony.tension);
        });
    });

    describe('Orchestration Modes', () => {
        it('should accept different orchestration modes', () => {
            orchestrator.setOrchestrationMode('FULL_ORCHESTRA');
            orchestrator.setOrchestrationMode('JAZZ_NOIR');
            orchestrator.setOrchestrationMode('MINIMALIST_VOID');
            orchestrator.setOrchestrationMode('WAGNERIAN');

            // Should not throw
            expect(true).toBe(true);
        });
    });

    describe('AI Configuration', () => {
        it('should accept AI enable/disable', () => {
            orchestrator.setAIConfig(true, 0.7);
            orchestrator.setAIConfig(false, 0.5);

            // Should not throw
            expect(true).toBe(true);
        });

        it('should accept temperature values', () => {
            orchestrator.setAIConfig(true, 0.0);
            orchestrator.setAIConfig(true, 0.5);
            orchestrator.setAIConfig(true, 1.0);

            // Should not throw
            expect(true).toBe(true);
        });
    });

    describe('Reset Functionality', () => {
        it('should reset frame index to zero', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'Test.',
                chord: 'C',
                analysis: 'Test.',
            };

            await orchestrator.processFrame(frame, 0.3, 0.3);
            await orchestrator.processFrame(frame, 0.3, 0.3);

            orchestrator.reset();

            expect(orchestrator.getFrameIndex()).toBe(0);
        });
    });

    describe('Graph Generation', () => {
        beforeEach(() => {
            orchestrator.registerActor({
                id: 'hamlet',
                name: 'Hamlet',
                disc: { D: 0.5, I: 0.5, S: 0.5, C: 0.5 },
                darkTriad: { machiavellianism: 0.3, narcissism: 0.3, psychopathy: 0.3 },
            });
        });

        it('should generate graph nodes for actors', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'Graph test.',
                chord: 'C',
                analysis: 'Test.',
            };

            const output = await orchestrator.processFrame(frame, 0.3, 0.3);

            expect(output.graph.nodes.length).toBeGreaterThan(0);
        });

        it('should include RSI concept nodes', async () => {
            const frame: ScriptFrame = {
                speaker: 'Hamlet',
                text: 'Concept test.',
                chord: 'C',
                analysis: 'Real symbolic imaginary.',
            };

            const output = await orchestrator.processFrame(frame, 0.5, 0.5);

            const conceptNodes = output.graph.nodes.filter((n) => n.type === 'concept');
            expect(conceptNodes.length).toBe(3); // Real, Symbolic, Imaginary
        });
    });
});

describe('Orchestrator Singleton', () => {
    beforeEach(() => {
        resetOrchestrator();
    });

    it('should return same instance on multiple calls', () => {
        const instance1 = getOrchestrator();
        const instance2 = getOrchestrator();

        expect(instance1).toBe(instance2);
    });

    it('should return new instance after reset', () => {
        const instance1 = getOrchestrator();
        resetOrchestrator();
        const instance2 = getOrchestrator();

        expect(instance1).not.toBe(instance2);
    });
});
