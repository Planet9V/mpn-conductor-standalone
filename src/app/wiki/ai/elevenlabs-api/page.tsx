'use client';

import Link from 'next/link';
import { ArrowLeft, Volume2, Mic, Settings, Code, Zap, Globe, MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * ElevenLabs API Documentation
 * 
 * Complete reference for ElevenLabs TTS integration,
 * Audio Tags, SSML, and voice settings.
 * 
 * Updated: 2026-01-05 07:30 CST
 * Version: 1.0.0
 */

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
            <code className="text-sm text-emerald-300 font-mono whitespace-pre">{code}</code>
        </pre>
    );
}

export default function ElevenLabsAPIPage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to Wiki</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                <Volume2 className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">ElevenLabs API</h1>
                                <p className="text-xs text-white/40">AI Integration → TTS</p>
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-white/40">Updated: 2026-01-05</span>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="text-violet-400">ElevenLabs</span> API Reference
                    </h2>
                    <p className="text-xl text-white/60 mb-6">
                        Complete guide to ElevenLabs text-to-speech integration for MPN Conductor,
                        including Audio Tags, SSML, and emotion mapping.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs">v3 Model</span>
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">70+ Languages</span>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs">Streaming</span>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs">Audio Tags</span>
                    </div>
                </div>

                {/* API Overview */}
                <section className="mb-12 p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4 text-[#FFD700]">API Overview (January 2026)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-2 px-4 text-[#FFD700]">Feature</th>
                                    <th className="text-left py-2 px-4 text-[#FFD700]">Support</th>
                                    <th className="text-left py-2 px-4 text-[#FFD700]">Notes</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-2 px-4">Emotion Control</td>
                                    <td className="py-2 px-4 text-emerald-400">✅ Audio Tags</td>
                                    <td className="py-2 px-4 text-white/50">[whispering], [giggles], etc.</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-2 px-4">SSML</td>
                                    <td className="py-2 px-4 text-amber-400">⚠️ Partial</td>
                                    <td className="py-2 px-4 text-white/50">Phonemes only (IPA/CMU)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-2 px-4">Voice Settings</td>
                                    <td className="py-2 px-4 text-emerald-400">✅ Full</td>
                                    <td className="py-2 px-4 text-white/50">stability, similarity, style</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-2 px-4">Languages</td>
                                    <td className="py-2 px-4 text-emerald-400">✅ 70+</td>
                                    <td className="py-2 px-4 text-white/50">Multilingual v2/v3</td>
                                </tr>
                                <tr>
                                    <td className="py-2 px-4">Streaming</td>
                                    <td className="py-2 px-4 text-emerald-400">✅ Full</td>
                                    <td className="py-2 px-4 text-white/50">Chunked transfer</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Audio Tags */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Audio Tags (Emotion Control)
                    </h3>
                    <p className="text-white/70 mb-4">
                        ElevenLabs v3 supports inline Audio Tags for emotional expression.
                        Insert these directly into your text for contextual voice modification.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-violet-400 mb-3">Supported Audio Tags</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[whispering]</code>
                                    <span className="text-white/50">Quiet, hushed tone</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[giggles]</code>
                                    <span className="text-white/50">Light laughter</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[nervously]</code>
                                    <span className="text-white/50">Trembling delivery</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[excitedly]</code>
                                    <span className="text-white/50">Energetic pacing</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[sadly]</code>
                                    <span className="text-white/50">Somber, slow</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[angrily]</code>
                                    <span className="text-white/50">Forceful, intense</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[gulps]</code>
                                    <span className="text-white/50">Sound effect</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className="text-emerald-300">[sighs]</code>
                                    <span className="text-white/50">Exhale sound</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-violet-400 mb-3">Usage Example</h4>
                            <CodeBlock code={`// Text with Audio Tags
const text = "[whispering] The ring... 
I can feel it [nervously] calling 
to me. [gulps] What have I done?";

// Psychometric → Audio Tag mapping
function mapPsychometricToTags(state) {
  const tags = [];
  
  if (state.trauma > 0.7) {
    tags.push('[nervously]');
  }
  if (state.entropy > 0.8) {
    tags.push('[excitedly]');
  }
  if (state.rsi.imaginary > 0.6) {
    tags.push('[sadly]');
  }
  
  return tags;
}`} />
                        </div>
                    </div>
                </section>

                {/* Voice Settings */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Voice Settings
                    </h3>
                    <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Parameter</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Range</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Default</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Effect</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-violet-300">stability</td>
                                    <td className="py-3 px-4">0.0 - 1.0</td>
                                    <td className="py-3 px-4">0.5</td>
                                    <td className="py-3 px-4">Lower = more expressive/variable</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-violet-300">similarity_boost</td>
                                    <td className="py-3 px-4">0.0 - 1.0</td>
                                    <td className="py-3 px-4">0.75</td>
                                    <td className="py-3 px-4">Higher = closer to original voice</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-violet-300">style</td>
                                    <td className="py-3 px-4">0.0 - 1.0</td>
                                    <td className="py-3 px-4">0.0</td>
                                    <td className="py-3 px-4">Exaggeration (v3 only)</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-violet-300">use_speaker_boost</td>
                                    <td className="py-3 px-4">boolean</td>
                                    <td className="py-3 px-4">true</td>
                                    <td className="py-3 px-4">Enhanced voice clarity</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <CodeBlock code={`// Psychometric → Voice Settings mapping
function mapPsychometricToVoiceSettings(state: PsychometricState) {
  return {
    // Higher trauma = less stable (more emotional variation)
    stability: Math.max(0.1, 0.8 - state.trauma * 0.5),
    
    // Higher entropy = less similarity (more unpredictable)
    similarity_boost: Math.max(0.3, 0.9 - state.entropy * 0.4),
    
    // Style based on RSI dominance
    style: state.rsi.imaginary > 0.5 ? 0.6 : 0.3,
    
    use_speaker_boost: true
  };
}

// Example for high trauma character:
// { stability: 0.25, similarity_boost: 0.65, style: 0.4 }`} />
                </section>

                {/* SSML Integration */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        SSML Integration (Phonemes)
                    </h3>
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                        <div className="flex items-start gap-2">
                            <MessageCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                            <p className="text-sm text-amber-200">
                                ElevenLabs supports <strong>partial SSML</strong> via phoneme tags only.
                                Full SSML (prosody, break, emphasis) is not supported - use Audio Tags instead.
                            </p>
                        </div>
                    </div>
                    <CodeBlock code={`// Enable SSML parsing in API call
const response = await fetch(
  \`https://api.elevenlabs.io/v1/text-to-speech/\${voiceId}\`,
  {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      // Use phoneme tags for pronunciation control
      text: \`
        <phoneme alphabet="ipa" ph="saɪˈkoʊskɔr">PSYCHOSCORE</phoneme> 
        analysis complete.
        <phoneme alphabet="ipa" ph="ˈlaɪtˌmoʊˌtif">leitmotif</phoneme>
        detected.
      \`,
      model_id: 'eleven_turbo_v2_5',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.5
      },
      // CRITICAL: Enable SSML parsing
      enable_ssml_parsing: true
    })
  }
);

// Phoneme alphabets supported:
// - IPA (International Phonetic Alphabet)
// - CMU (Carnegie Mellon University Arpabet)`} />
                </section>

                {/* Model Comparison */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Model Comparison
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Model</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Latency</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Quality</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Languages</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-blue-300">eleven_turbo_v2_5</td>
                                    <td className="py-3 px-4 text-emerald-400">⚡ Fastest</td>
                                    <td className="py-3 px-4">★★★★☆</td>
                                    <td className="py-3 px-4">English-focused</td>
                                    <td className="py-3 px-4">Real-time, streaming</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4 font-mono text-violet-300">eleven_multilingual_v2</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4">★★★★★</td>
                                    <td className="py-3 px-4">70+</td>
                                    <td className="py-3 px-4">Multilingual apps</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4 font-mono text-pink-300">eleven_v3 (alpha)</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4 text-emerald-400">★★★★★+</td>
                                    <td className="py-3 px-4">70+</td>
                                    <td className="py-3 px-4">Emotional, expressive</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Complete API Call */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">5</span>
                        Complete API Integration
                    </h3>
                    <CodeBlock code={`// src/lib/elevenlabs_client.ts
export class ElevenLabsClient {
  private apiKey: string;
  private voiceId: string;
  
  constructor(apiKey: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
    this.apiKey = apiKey;
    this.voiceId = voiceId;
  }

  async synthesize(
    text: string,
    psychometrics?: PsychometricState
  ): Promise<ArrayBuffer> {
    // Map psychometrics to Audio Tags
    let enhancedText = text;
    if (psychometrics) {
      if (psychometrics.trauma > 0.7) {
        enhancedText = '[nervously] ' + enhancedText;
      }
      if (psychometrics.entropy > 0.8) {
        enhancedText = '[excitedly] ' + enhancedText;
      }
    }

    // Map psychometrics to voice settings
    const voiceSettings = psychometrics 
      ? this.mapToVoiceSettings(psychometrics)
      : { stability: 0.5, similarity_boost: 0.75 };

    const response = await fetch(
      \`https://api.elevenlabs.io/v1/text-to-speech/\${this.voiceId}\`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: enhancedText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings
        })
      }
    );

    if (!response.ok) {
      throw new Error(\`ElevenLabs API error: \${response.status}\`);
    }

    return response.arrayBuffer();
  }

  private mapToVoiceSettings(state: PsychometricState) {
    return {
      stability: Math.max(0.1, 0.8 - state.trauma * 0.5),
      similarity_boost: Math.max(0.3, 0.9 - state.entropy * 0.4),
      style: state.rsi?.imaginary > 0.5 ? 0.6 : 0.3,
      use_speaker_boost: true
    };
  }
}

// Usage
const client = new ElevenLabsClient(process.env.ELEVENLABS_API_KEY);
const audioBuffer = await client.synthesize(
  "The ring... I can feel it calling to me.",
  { trauma: 0.85, entropy: 0.7, rsi: { real: 0.2, symbolic: 0.3, imaginary: 0.5 } }
);

// Play audio
const audioContext = new AudioContext();
const audioBufferSource = audioContext.createBufferSource();
audioBufferSource.buffer = await audioContext.decodeAudioData(audioBuffer);
audioBufferSource.connect(audioContext.destination);
audioBufferSource.start();`} />
                </section>

                {/* Pricing */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">6</span>
                        Pricing (Jan 2026)
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-violet-400">Free Tier</h4>
                            <p className="text-2xl font-bold mt-2">10,000</p>
                            <p className="text-xs text-white/50">characters/month</p>
                        </div>
                        <div className="p-4 rounded-lg border border-violet-500/30 bg-violet-500/10">
                            <h4 className="font-semibold text-violet-400">Starter</h4>
                            <p className="text-2xl font-bold mt-2">$5/mo</p>
                            <p className="text-xs text-white/50">30,000 characters</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <h4 className="font-semibold text-white/60">Creator</h4>
                            <p className="text-2xl font-bold mt-2">$22/mo</p>
                            <p className="text-xs text-white/50">100,000 characters</p>
                        </div>
                    </div>
                    <p className="text-xs text-white/40 mt-4">
                        Approximate cost: ~$0.30 per 1,000 characters (Starter tier)
                    </p>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/voice" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Emotional TTS System</h4>
                            <p className="text-xs text-white/50 mt-1">Multi-provider architecture</p>
                        </Link>
                        <Link href="/wiki/ai/psychoscore" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">PSYCHOSCORE</h4>
                            <p className="text-xs text-white/50 mt-1">Psychometric music generation</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • ElevenLabs API Reference</span>
                    <span>Last updated: 2026-01-05 07:30 CST</span>
                </div>
            </footer>
        </div>
    );
}
