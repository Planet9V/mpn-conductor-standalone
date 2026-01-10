'use client';

import Link from 'next/link';
import { ArrowLeft, Music, Server, Code, Terminal, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * PSYCHOSCORE Inference API Documentation
 * 
 * Complete API reference for the PSYCHOSCORE FastAPI server
 * and TypeScript client.
 * 
 * Updated: 2026-01-05 15:58 CST
 * Version: 1.1.0
 * 
 * CHANGE LOG:
 * - 2026-01-05 15:58: Added GeniusComposer AIModelSource integration
 * - 2026-01-05 07:25: Initial API documentation
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

function EndpointCard({
    method,
    path,
    description,
    children
}: {
    method: 'GET' | 'POST';
    path: string;
    description: string;
    children: React.ReactNode;
}) {
    const methodColors = {
        GET: 'bg-emerald-500 text-white',
        POST: 'bg-blue-500 text-white'
    };

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[method]}`}>
                    {method}
                </span>
                <code className="font-mono text-lg">{path}</code>
            </div>
            <div className="p-4">
                <p className="text-white/70 mb-4">{description}</p>
                {children}
            </div>
        </div>
    );
}

export default function APIPage() {
    useMermaid();

    return (
        <div className="min-h-screen bg-black">
            <header className="border-b border-white/10 px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-lg z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki/ai/psychoscore" className="flex items-center gap-2 text-white/60 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back to PSYCHOSCORE</span>
                        </Link>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Music className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Inference API</h1>
                                <p className="text-xs text-white/40">PSYCHOSCORE → API Reference</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-emerald-400">Inference</span> API Reference
                    </h2>
                    <p className="text-lg text-white/60">
                        Complete API documentation for the PSYCHOSCORE FastAPI server and TypeScript client.
                    </p>
                    <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-center gap-2">
                            <Server className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-300 font-mono">http://localhost:8001</span>
                            <span className="text-white/50 text-sm ml-2">Production endpoint</span>
                        </div>
                    </div>
                </div>

                {/* Endpoints */}
                <section className="mb-12 space-y-6">
                    <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>

                    {/* Health Endpoint */}
                    <EndpointCard method="GET" path="/health" description="Check server health and model status.">
                        <h4 className="font-semibold mb-2 text-sm">Response</h4>
                        <CodeBlock code={`{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}`} language="json" />
                        <div className="mt-4 flex gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                <span className="text-white/60">200: Server healthy</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <XCircle className="w-4 h-4 text-red-400" />
                                <span className="text-white/60">503: Model not loaded</span>
                            </div>
                        </div>
                    </EndpointCard>

                    {/* Generate Endpoint */}
                    <EndpointCard method="POST" path="/generate" description="Generate MIDI from psychometric profile.">
                        <h4 className="font-semibold mb-2 text-sm">Request Body</h4>
                        <CodeBlock code={`{
  "disc": {
    "D": 0.8,  // Dominance (0-1)
    "I": 0.3,  // Influence (0-1)
    "S": 0.2,  // Steadiness (0-1)
    "C": 0.5   // Compliance (0-1)
  },
  "ocean": {
    "O": 0.7,  // Openness (0-1)
    "C": 0.4,  // Conscientiousness (0-1)
    "E": 0.6,  // Extraversion (0-1)
    "A": 0.5,  // Agreeableness (0-1)
    "N": 0.3   // Neuroticism (0-1)
  },
  "rsi": {
    "real": 0.5,       // Real register (0-1)
    "symbolic": 0.3,   // Symbolic register (0-1)
    "imaginary": 0.2   // Imaginary register (0-1)
  },
  "trauma": 0.7,       // Trauma coefficient (0-1)
  "entropy": 0.5,      // Shannon entropy (0-1)
  "dark_triad": {
    "machiavellianism": 0.3,
    "narcissism": 0.2,
    "psychopathy": 0.1
  },
  "max_bars": 8,       // Optional: bars to generate (1-128)
  "temperature": 0.8,  // Optional: sampling temperature (0.1-2.0)
  "top_p": 0.9         // Optional: nucleus sampling (0-1)
}`} language="json" />

                        <h4 className="font-semibold mb-2 mt-6 text-sm">Response</h4>
                        <CodeBlock code={`{
  "success": true,
  "midi_base64": "TVRoZAAAAAYAAQACAHhNVHJr...",
  "parameters": {
    "bars": 8,
    "temperature": 0.8,
    "rsi_dominant": "real"
  }
}`} language="json" />

                        <h4 className="font-semibold mb-2 mt-6 text-sm">Error Response</h4>
                        <CodeBlock code={`{
  "success": false,
  "midi_base64": null,
  "parameters": {},
  "error": "Model not ready"
}`} language="json" />
                    </EndpointCard>
                </section>

                {/* TypeScript Client */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        TypeScript Client
                    </h3>
                    <p className="text-white/70 mb-4">
                        Use the <code className="bg-black/40 px-1 rounded">PsychoscoreClient</code> class for
                        type-safe API access from the frontend.
                    </p>
                    <CodeBlock code={`// src/lib/psychoscore_client.ts
import { PsychoscoreClient, getPsychoscoreClient } from '@/lib/psychoscore_client';

// Using singleton instance
const client = getPsychoscoreClient();

// Or create custom instance
const customClient = new PsychoscoreClient({
  endpoint: 'http://localhost:8001',
  timeout: 30000
});

// Health check
const isHealthy = await client.healthCheck();
console.log('Server healthy:', isHealthy);

// Generate MIDI
const response = await client.generate({
  disc: { D: 0.8, I: 0.3, S: 0.2, C: 0.5 },
  rsi: { real: 0.5, symbolic: 0.3, imaginary: 0.2 },
  trauma: 0.7,
  entropy: 0.5,
  max_bars: 8
});

if (response.success) {
  console.log('MIDI generated:', response.midi_base64);
  console.log('RSI dominant:', response.parameters?.rsi_dominant);
}

// Generate as ArrayBuffer (for audio playback)
const midiBuffer = await client.generateMidi({
  trauma: 0.7,
  rsi: { real: 0.8, symbolic: 0.1, imaginary: 0.1 },
  max_bars: 16
});

if (midiBuffer) {
  // Play with Tone.js or save to file
  const blob = new Blob([midiBuffer], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
}

// Generate from PsychometricState (GeniusComposer integration)
const midiFromState = await client.generateFromPsychometrics(
  psychometricState,  // From actor analysis
  32                  // bars
);`} language="typescript" />
                </section>

                {/* Python Client */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-amber-400" />
                        Python Client (curl)
                    </h3>
                    <CodeBlock code={`# Health check
curl -s http://localhost:8001/health | jq

# Generate MIDI
curl -X POST http://localhost:8001/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "disc": {"D": 0.8, "I": 0.3, "S": 0.2, "C": 0.5},
    "rsi": {"real": 0.5, "symbolic": 0.3, "imaginary": 0.2},
    "trauma": 0.7,
    "entropy": 0.5,
    "max_bars": 8
  }' | jq

# Save MIDI to file
curl -X POST http://localhost:8001/generate \\
  -H "Content-Type: application/json" \\
  -d '{"trauma": 0.7, "max_bars": 8}' \\
  | python3 -c "
import sys, json, base64
d = json.load(sys.stdin)
if d['success']:
    open('output.mid', 'wb').write(base64.b64decode(d['midi_base64']))
    print('Saved output.mid')
"`} language="bash" />
                </section>

                {/* Integration Example */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">GeniusComposer Integration</h3>
                    <p className="text-white/70 mb-4">
                        PSYCHOSCORE is integrated as the primary music generation path in
                        <code className="bg-black/40 px-1 rounded">AIMusicClient</code>, with
                        Text2midi as fallback.
                    </p>
                    <CodeBlock code={`// src/lib/ai_music_client.ts

async generateSymbolicMidi(params: PsychometricTextParams): Promise<ParsedMidiNote[] | null> {
  // Try PSYCHOSCORE first (custom trained model - highest quality)
  try {
    const psychoscoreAvailable = await this.psychoscore.healthCheck();
    
    if (psychoscoreAvailable) {
      console.log('[AIMusicClient] Using PSYCHOSCORE for generation');
      
      const psychoState = {
        discProfile: params.disc,
        oceanProfile: params.ocean,
        rsi: params.rsi,
        trauma: params.trauma ?? 0.3,
        entropy: params.entropy ?? 0.3,
        darkTriad: params.darkTriad,
        activeBiases: [],
      };
      
      const midiBuffer = await this.psychoscore.generateFromPsychometrics(
        psychoState as any,
        32 // bars
      );
      
      if (midiBuffer) {
        const notes = this.text2midi.parseMidiToNotes(
          btoa(String.fromCharCode(...new Uint8Array(midiBuffer)))
        );
        console.log(\`[AIMusicClient] PSYCHOSCORE generated \${notes.length} notes\`);
        return notes;
      }
    }
  } catch (error) {
    console.warn('[AIMusicClient] PSYCHOSCORE failed, falling back to text2midi:', error);
  }

  // Fallback to Text2midi
  // ...
}`} language="typescript" />
                </section>

                {/* Test Coverage */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4">Test Coverage</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
                            <h4 className="font-semibold text-emerald-400 mb-2">TypeScript Tests</h4>
                            <p className="text-sm text-white/70">26 tests in 2 files</p>
                            <ul className="text-xs text-white/50 mt-2 space-y-1">
                                <li>• psychoscore_client.test.ts (16 unit tests)</li>
                                <li>• psychoscore_e2e.test.ts (10 E2E tests)</li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                            <h4 className="font-semibold text-blue-400 mb-2">Python Tests</h4>
                            <p className="text-sm text-white/70">16 tests (live server)</p>
                            <ul className="text-xs text-white/50 mt-2 space-y-1">
                                <li>• Health check (3 tests)</li>
                                <li>• Generate endpoint (6 tests)</li>
                                <li>• RSI dominance (3 tests)</li>
                                <li>• Performance + MIDI quality (4 tests)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/psychoscore" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">PSYCHOSCORE Overview</h4>
                            <p className="text-xs text-white/50 mt-1">System introduction</p>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/training" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Training Pipeline</h4>
                            <p className="text-xs text-white/50 mt-1">QLoRA configuration</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • PSYCHOSCORE Inference API</span>
                    <span>Last updated: 2026-01-05 07:25 CST</span>
                </div>
            </footer>
        </div>
    );
}
