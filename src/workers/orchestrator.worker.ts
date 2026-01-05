
import { ScoreOrchestrator } from '../components/mpn-lab/score_orchestrator';
import { ActorProfile } from '../components/mpn-lab/score_types';
import { OrchestrationMode } from '../components/mpn-lab/GeniusComposer';

// Internal instance within the worker
let orchestrator: ScoreOrchestrator | null = null;

// Message Types
type WorkerMessage =
    | { type: 'INIT', payload: { actors: ActorProfile[] } }
    | { type: 'RESET' }
    | { type: 'SET_MODE', payload: { mode: OrchestrationMode } }
    | { type: 'SET_STYLE', payload: { styleId: string } }
    | { type: 'SET_AI', payload: { enabled: boolean, temperature: number } }
    | { type: 'UPDATE_ADJUSTMENTS', payload: { adjustments: any } }
    | { type: 'PROCESS_FRAME', payload: { script: any, trauma: number, entropy: number, id: string } };

// Handle incoming messages
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
    const { type, payload } = e.data;

    try {
        switch (type) {
            case 'INIT':
                // Initialize a fresh orchestrator
                orchestrator = new ScoreOrchestrator((payload as any).actors);
                self.postMessage({ type: 'INIT_SUCCESS' });
                break;

            case 'RESET':
                if (orchestrator) orchestrator.reset();
                self.postMessage({ type: 'RESET_SUCCESS' });
                break;

            case 'SET_MODE':
                if (orchestrator) orchestrator.setOrchestrationMode((payload as any).mode);
                break;

            case 'SET_STYLE':
                if (orchestrator) orchestrator.setMusicalStyle((payload as any).styleId);
                break;

            case 'SET_AI':
                if (orchestrator) orchestrator.setAIConfig((payload as any).enabled, (payload as any).temperature);
                break;

            case 'UPDATE_ADJUSTMENTS':
                if (orchestrator) orchestrator.updateAdjustments((payload as any).adjustments);
                break;

            case 'PROCESS_FRAME':
                if (!orchestrator) throw new Error('Orchestrator not initialized');
                const result = await orchestrator.processFrame(
                    (payload as any).script,
                    (payload as any).trauma,
                    (payload as any).entropy
                );
                // Send back result with the Request ID to match promises
                self.postMessage({
                    type: 'PROCESS_SUCCESS',
                    payload: result,
                    id: (payload as any).id
                });
                break;
        }
    } catch (error) {
        console.error('Orchestrator Worker Error:', error);
        self.postMessage({
            type: 'ERROR',
            payload: error instanceof Error ? error.message : String(error),
            id: (payload as any)?.id // Return ID if available so promise can reject
        });
    }
};
