'use client';

import Link from 'next/link';
import { ArrowLeft, Book, Volume2, Check, AlertTriangle, ExternalLink } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Emotional TTS System Documentation
 * 
 * Updated: 2026-01-04 12:30 CST
 * Version: 3.2.0
 */

// Mermaid loader
function useMermaid() {
    const initialized = useRef(false);
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            window.mermaid?.initialize({ startOnLoad: true, theme: 'dark' });
            // @ts-ignore
            window.mermaid?.run();
        };
        document.head.appendChild(script);
    }, []);
}

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
    return (
        <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
            <code className="text-sm text-emerald-300 font-mono">{code}</code>
        </pre>
    );
}

export default function VoicePage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Wiki</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Volume2 className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Emotional TTS System</h1>
                                <p className="text-xs text-white/40">AI Integration → Voice</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Introduction */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-[#FFD700]">Emotional</span> Text-to-Speech
                    </h2>
                    <p className="text-lg text-white/60">
                        MPN Conductor uses a multi-provider TTS architecture with GST (Global Style Tokens)
                        emotion mapping to synthesize speech that matches character psychometric states.
                    </p>
                </div>

                {/* Architecture Diagram */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Architecture Overview
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart LR
    subgraph Input["INPUT"]
        Text[Text Content]
        Psycho[Psychometric State]
    end

    subgraph Mapping["EMOTION MAPPING"]
        GST[GST Emotion Mapper]
    end

    subgraph Providers["TTS PROVIDERS"]
        Azure[Azure Speech]
        Eleven[ElevenLabs]
        Bark[Bark/Suno]
    end

    subgraph Output["OUTPUT"]
        Audio[Audio Buffer]
    end

    Text --> GST
    Psycho --> GST
    GST --> |High intensity| Azure
    GST --> |Baseline| Eleven
    GST --> |Experimental| Bark
    Azure --> Audio
    Eleven --> Audio
    Bark --> Audio`}
                        </div>
                    </div>
                </section>

                {/* Provider Comparison */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Provider Comparison
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Provider</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Emotion Control</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Voice Quality</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Use Case</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium">Azure Speech</td>
                                    <td className="py-3 px-4">
                                        <span className="text-emerald-400">★★★★★</span>
                                        <span className="text-xs text-white/50 ml-2">Native SSML emotions</span>
                                    </td>
                                    <td className="py-3 px-4"><span className="text-emerald-400">★★★★☆</span></td>
                                    <td className="py-3 px-4">High-intensity emotions (fear, anger)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-medium">ElevenLabs</td>
                                    <td className="py-3 px-4">
                                        <span className="text-amber-400">★★★☆☆</span>
                                        <span className="text-xs text-white/50 ml-2">Stability/similarity</span>
                                    </td>
                                    <td className="py-3 px-4"><span className="text-emerald-400">★★★★★</span></td>
                                    <td className="py-3 px-4">Natural baseline, high quality</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-medium">Bark (Suno)</td>
                                    <td className="py-3 px-4">
                                        <span className="text-amber-400">★★★★☆</span>
                                        <span className="text-xs text-white/50 ml-2">[emotion] tokens</span>
                                    </td>
                                    <td className="py-3 px-4"><span className="text-amber-400">★★★☆☆</span></td>
                                    <td className="py-3 px-4">Open-source, experimental</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Emotion Mapping */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Psychometric → Emotion Mapping
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-red-400 mb-2">High Trauma + High Entropy</h4>
                            <p className="text-sm text-white/60 mb-2">→ <strong>Fearful</strong></p>
                            <p className="text-xs text-white/40">Rate: 1.2x, Pitch: +15%</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-blue-400 mb-2">High Trauma + Low Entropy</h4>
                            <p className="text-sm text-white/60 mb-2">→ <strong>Sad</strong></p>
                            <p className="text-xs text-white/40">Rate: 0.85x, Pitch: -8%</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-amber-400 mb-2">High Entropy + Low Trauma</h4>
                            <p className="text-sm text-white/60 mb-2">→ <strong>Excited</strong></p>
                            <p className="text-xs text-white/40">Rate: 1.15x, Pitch: +8%</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-medium text-emerald-400 mb-2">Low Trauma + Low Entropy</h4>
                            <p className="text-sm text-white/60 mb-2">→ <strong>Friendly</strong></p>
                            <p className="text-xs text-white/40">Rate: 1.0x, Pitch: 0%</p>
                        </div>
                    </div>
                </section>

                {/* Azure SSML Example */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Azure SSML Example
                    </h3>
                    <CodeBlock code={`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="en-US-JennyNeural">
    <mstts:express-as style="fearful" styledegree="1.8">
      <prosody rate="1.2" pitch="+15%">
        The ring... I can feel it calling to me.
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`} />
                    <p className="mt-4 text-sm text-white/60">
                        Azure supports native emotion styles: <code>cheerful</code>, <code>angry</code>, <code>sad</code>,
                        <code>fearful</code>, <code>excited</code>, <code>friendly</code>, <code>hopeful</code>,
                        <code>shouting</code>, <code>whispering</code>.
                    </p>
                </section>

                {/* Configuration */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">5</span>
                        Configuration
                    </h3>
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                            <p className="text-sm text-amber-200">
                                Configure API keys in <code className="bg-black/30 px-1 rounded">.env.local</code>
                            </p>
                        </div>
                    </div>
                    <CodeBlock code={`# ElevenLabs (recommended baseline)
ELEVENLABS_API_KEY=your_key_here

# Azure Speech (for high-intensity emotions)
AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=eastus

# API costs (approximate)
# ElevenLabs: ~$0.30/1000 chars
# Azure: ~$4/1M chars`} />
                </section>

                {/* Usage Example */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">6</span>
                        Usage Example
                    </h3>
                    <CodeBlock code={`import { EmotionalTTSRenderer } from '@/lib/emotional_tts_renderer';

const tts = new EmotionalTTSRenderer('elevenlabs');

// Render emotional speech
const audioBuffer = await tts.render(
  "The ring... I can feel it calling to me.",
  "frodo",
  {
    trauma: 0.85,
    entropy: 0.7,
    rsi: { real: 0.2, symbolic: 0.3, imaginary: 0.5 }
  }
);

// Preview emotion without synthesis
const preview = tts.getEmotionPreview(psychometrics);
console.log(preview);
// { style: 'fearful', description: 'Nervous, trembling voice', intensity: 0.9 }`} />
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/music-gen" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">AI Music Generation</h4>
                            <p className="text-xs text-white/50 mt-1">HuggingFace MusicGen integration</p>
                        </Link>
                        <Link href="/wiki/deployment/env-config" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Environment Configuration</h4>
                            <p className="text-xs text-white/50 mt-1">All API keys and settings</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • Emotional TTS System</span>
                    <span>Last updated: 2026-01-04 12:30 CST</span>
                </div>
            </footer>
        </div>
    );
}
