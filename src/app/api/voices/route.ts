import { NextResponse } from 'next/server';
import { voiceClient } from '@/lib/voice_client';

export async function GET() {
    try {
        const voices = await voiceClient.getVoices();

        // Return voices with essential metadata for the frontend
        return NextResponse.json({
            voices: voices.map(v => ({
                id: v.voice_id,
                name: v.name,
                category: v.category,
                labels: v.labels,
                previewUrl: v.preview_url,
                description: v.description
            }))
        });
    } catch (error) {
        console.error('[Voices API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch voices' }, { status: 500 });
    }
}
