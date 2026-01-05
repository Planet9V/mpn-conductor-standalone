
import { voiceClient } from '@/lib/voice_client';
import { MPNSynthesizer } from './MPNSynthesizer';

// Types
export interface VoiceActorMap {
    [actorId: string]: string; // actorId -> voiceId
}

// Default mappings (using standard ElevenLabs pre-made voices)
const DEFAULT_VOICES: VoiceActorMap = {
    'scholar': 'ErXwobaYiN019PkySvjV', // Antoni
    'healer': '21m00Tcm4TlvDq8ikWAM', // Rachel
    'general': 'D38z5RcWu1voky8WS1ja', // Fin
    'dreamer': 'AZnzlk1XvdvUeBnXmlld', // Domi
    'bureaucrat': 'TxGEqnHWrfWFTfGW9XjX', // Josh
    'clown': 'MF3mGyEYCl7XYWbV9V6O', // Elli
};

export class LeadVoiceManager {
    private voiceMap: VoiceActorMap;
    private synthesizer: MPNSynthesizer;
    private isEnabled: boolean = true;

    constructor(synthesizer: MPNSynthesizer) {
        this.synthesizer = synthesizer;
        this.voiceMap = { ...DEFAULT_VOICES };
    }

    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    /**
     * Map a specific actor ID to a Voice ID
     */
    assignVoice(actorId: string, voiceId: string) {
        this.voiceMap[actorId.toLowerCase()] = voiceId;
    }

    /**
     * Speak a line of dialogue for an actor
     * @param actorId The actor speaking
     * @param text The text to speak
     * @param psychometrics Optional psychometrics to adjust voice stability
     */
    async speak(actorId: string, text: string, psychometrics?: any): Promise<void> {
        if (!this.isEnabled) return;

        const normalizedId = actorId.toLowerCase();
        // Fallback to 'scholar' (Male) or 'healer' (Female) if not found? 
        // Or just use default config.
        const voiceId = this.voiceMap[normalizedId] || this.voiceMap['scholar'];

        // Adjust stability based on Trauma (High Trauma -> Low Stability)
        let stability = 0.5;
        if (psychometrics && psychometrics.trauma) {
            stability = Math.max(0.1, 0.8 - (psychometrics.trauma * 0.6));
        }

        try {
            const audioBuffer = await voiceClient.synthesize(text, voiceId, stability);
            if (audioBuffer) {
                // Play via synthesizer (ducking volume of music?)
                // TODO: Implement "ducking" in synthesizer
                await this.synthesizer.playAudioBuffer(audioBuffer, 0); // 0dB
            }
        } catch (e) {
            console.error('[LeadVoiceManager] Speech failed:', e);
        }
    }
}
