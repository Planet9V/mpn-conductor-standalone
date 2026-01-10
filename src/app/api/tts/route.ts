import { NextResponse } from 'next/server';
import { voiceClient } from '@/lib/voice_client';
import { mapPsychometricsToEmotion, PsychometricState } from '@/lib/emotional_tts_renderer';

export async function POST(request: Request) {
    try {
        const { text, voiceId, psychometrics, style } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Determine speaker style from psychometrics or direct style input
        let speakerStyle = style || 'default';

        if (psychometrics && typeof psychometrics === 'object') {
            const emotionResult = mapPsychometricsToEmotion(psychometrics as PsychometricState);
            speakerStyle = emotionResult.style;
            console.log(`[TTS API] Mapped psychometrics to emotion: ${speakerStyle}`);
        }

        const audioBuffer = await voiceClient.synthesize(text, voiceId, {
            speakerStyle,
            stability: undefined, // Let emotion map determine
            similarityBoost: undefined
        });

        if (!audioBuffer) {
            return NextResponse.json({ error: 'TTS synthesis failed. Check API key.' }, { status: 500 });
        }

        // Return audio as binary stream
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.byteLength.toString(),
                'X-Emotion-Style': speakerStyle
            }
        });

    } catch (error) {
        console.error('[TTS API] Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    // Return available emotion styles for documentation
    const styles = [
        { name: 'default', description: 'Neutral, calm delivery' },
        { name: 'fearful', description: 'Nervous, trembling voice' },
        { name: 'excited', description: 'Energetic, enthusiastic' },
        { name: 'sad', description: 'Slow, melancholic tone' },
        { name: 'angry', description: 'Tense, forceful delivery' },
        { name: 'cheerful', description: 'Bright, upbeat tone' },
        { name: 'hopeful', description: 'Optimistic, rising intonation' },
        { name: 'whispering', description: 'Quiet, intimate tone' },
        { name: 'shouting', description: 'Loud, urgent delivery' },
        { name: 'friendly', description: 'Warm, approachable tone' }
    ];

    return NextResponse.json({
        provider: 'elevenlabs',
        model: 'eleven_multilingual_v2',
        styles,
        usage: {
            method: 'POST',
            body: {
                text: 'string (required)',
                voiceId: 'string (optional, defaults to Rachel)',
                style: 'string (optional, one of the above styles)',
                psychometrics: 'object (optional, { trauma, entropy, rsi: { real, symbolic, imaginary } })'
            }
        }
    });
}
