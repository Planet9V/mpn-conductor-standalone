
import { ActorProfile, PsychometricScoreFrame } from './score_types';
import { OrchestrationMode } from './GeniusComposer';
import { ParameterAdjustment } from './mpn_reference_types';

/**
 * Client-side wrapper for the Orchestration WebWorker.
 * Provides a Promise-based API for orchestration tasks.
 */
export class OrchestratorWorkerClient {
    private worker: Worker | null = null;
    private pendingRequests: Map<string, { resolve: (value: any) => void; reject: (reason?: any) => void }> = new Map();

    constructor() {
        if (typeof window !== 'undefined') {
            // Instantiate worker
            this.worker = new Worker(new URL('../../workers/orchestrator.worker.ts', import.meta.url));
            this.worker.onmessage = this.handleMessage.bind(this);
        }
    }

    private handleMessage(event: MessageEvent) {
        const { type, payload, id } = event.data;

        if (type === 'PROCESS_SUCCESS' && id) {
            const request = this.pendingRequests.get(id);
            if (request) {
                request.resolve(payload);
                this.pendingRequests.delete(id);
            }
        } else if (type === 'ERROR' && id) {
            const request = this.pendingRequests.get(id);
            if (request) {
                request.reject(new Error(payload));
                this.pendingRequests.delete(id);
            }
        } else if (type === 'ERROR') {
            console.error('Orchestrator Worker Global Error:', payload);
        }
    }

    // ========================================================================
    // API METHODS
    // ========================================================================

    init(actors: ActorProfile[]) {
        this.worker?.postMessage({ type: 'INIT', payload: { actors } });
    }

    reset() {
        this.worker?.postMessage({ type: 'RESET' });
    }

    setOrchestrationMode(mode: OrchestrationMode) {
        this.worker?.postMessage({ type: 'SET_MODE', payload: { mode } });
    }

    setMusicalStyle(styleId: string) {
        this.worker?.postMessage({ type: 'SET_STYLE', payload: { styleId } });
    }

    setAIConfig(enabled: boolean, temperature: number) {
        this.worker?.postMessage({ type: 'SET_AI', payload: { enabled, temperature } });
    }

    updateAdjustments(adjustments: Record<string, ParameterAdjustment>) {
        this.worker?.postMessage({ type: 'UPDATE_ADJUSTMENTS', payload: { adjustments } });
    }

    setVariantOverrides(variant: any) {
        this.worker?.postMessage({ type: 'SET_VARIANT_OVERRIDES', payload: { variant } });
    }

    jumpToFrame(frameIndex: number) {
        this.worker?.postMessage({ type: 'JUMP_TO_FRAME', payload: { frameIndex } });
    }

    async processFrame(script: any, trauma: number, entropy: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.worker) {
                reject(new Error('Worker not initialized'));
                return;
            }

            const id = crypto.randomUUID();
            this.pendingRequests.set(id, { resolve, reject });

            this.worker.postMessage({
                type: 'PROCESS_FRAME',
                payload: { script, trauma, entropy, id }
            });
        });
    }

    terminate() {
        this.worker?.terminate();
        this.worker = null;
    }
}
