'use client';

import Link from 'next/link';
import { ArrowLeft, Cpu, Layers, Database, Zap, Server, Code } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * PSYCHOSCORE Architecture Documentation
 * 
 * Detailed system architecture, model structure, and inference pipeline.
 * 
 * Updated: 2026-01-05 07:10 CST
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

export default function ArchitecturePage() {
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
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Cpu className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">System Architecture</h1>
                                <p className="text-xs text-white/40">PSYCHOSCORE → Architecture</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-purple-400">System</span> Architecture
                    </h2>
                    <p className="text-lg text-white/60">
                        Complete technical architecture of the PSYCHOSCORE model, training infrastructure,
                        and inference pipeline.
                    </p>
                </div>

                {/* High-Level Architecture */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        High-Level Architecture
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart TB
    subgraph Client["🖥️ CLIENT LAYER"]
        Frontend["Next.js Frontend"]
        TSClient["PsychoscoreClient.ts"]
    end

    subgraph API["🌐 API LAYER"]
        FastAPI["FastAPI Server"]
        Health["/health"]
        Generate["/generate"]
    end

    subgraph Model["🧠 MODEL LAYER"]
        Tokenizer["PsychoscoreTokenizer"]
        GPT2["GPT-2 Base Model"]
        LoRA["QLoRA Adapters"]
        Decoder["MIDI Decoder"]
    end

    subgraph Infra["🐳 INFRASTRUCTURE"]
        Docker["Docker Container"]
        CUDA["CUDA 13.0"]
        GPU["RTX 5060 Ti"]
    end

    Frontend --> TSClient
    TSClient -->|HTTP POST| FastAPI
    FastAPI --> Health
    FastAPI --> Generate
    Generate --> Tokenizer
    Tokenizer --> GPT2
    GPT2 --> LoRA
    LoRA --> Decoder
    
    Docker --> FastAPI
    Docker --> Model
    CUDA --> GPU
    GPU --> Model`}
                        </div>
                    </div>
                </section>

                {/* Model Architecture */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        Model Architecture
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-4">
                        <div className="mermaid">
                            {`flowchart LR
    subgraph Input["INPUT"]
        Profile["Psychometric Profile (57D)"]
    end

    subgraph Encoding["ENCODING"]
        TokenEmbed["Token Embedding (768D)"]
        PosEmbed["Position Embedding"]
    end

    subgraph Transformer["GPT-2 TRANSFORMER"]
        direction TB
        Block1["Transformer Block 1"]
        Block2["Transformer Block 2"]
        BlockN["... (12 blocks)"]
        Block1 --> Block2 --> BlockN
    end

    subgraph LoRA["QLoRA ADAPTERS"]
        LoraQ["LoRA Q-proj (r=16)"]
        LoraV["LoRA V-proj (r=16)"]
    end

    subgraph Output["OUTPUT"]
        LMHead["LM Head"]
        MIDI["MIDI Tokens"]
    end

    Profile --> TokenEmbed
    TokenEmbed --> PosEmbed
    PosEmbed --> Block1
    BlockN --> LMHead
    LoRA -.-> Transformer
    LMHead --> MIDI`}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Component</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Specification</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Parameters</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Base Model</td>
                                    <td className="py-3 px-4 font-mono">GPT-2 (openai-community/gpt2)</td>
                                    <td className="py-3 px-4">124M</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Hidden Dimension</td>
                                    <td className="py-3 px-4 font-mono">768</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Attention Heads</td>
                                    <td className="py-3 px-4 font-mono">12</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">Transformer Blocks</td>
                                    <td className="py-3 px-4 font-mono">12</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">LoRA Rank (r)</td>
                                    <td className="py-3 px-4 font-mono">16</td>
                                    <td className="py-3 px-4">6.35M trainable</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">LoRA Alpha</td>
                                    <td className="py-3 px-4 font-mono">32</td>
                                    <td className="py-3 px-4">-</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">Target Modules</td>
                                    <td className="py-3 px-4 font-mono">c_attn, c_proj</td>
                                    <td className="py-3 px-4">Q, K, V projections</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* File Structure */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Project File Structure
                    </h3>
                    <CodeBlock code={`ml/psychoscore/
├── Dockerfile                          # CUDA 13.0 + Python 3.11
├── docker-compose.yml                  # GPU-enabled services
├── requirements.txt                    # Python dependencies + midiutil
├── .env                                # API keys (HuggingFace, W&B)
│
├── tokenizer/
│   ├── __init__.py
│   └── psychoscore_tokenizer.py        # 1,700+ token vocabulary
│       ├── PsychometricProfile         # Pydantic model for 57D input
│       ├── PsychoscoreTokenizer        # Encode/decode logic
│       └── Token vocabulary            # DISC, OCEAN, RSI, biases
│
├── data/
│   └── generate_synthetic_pairs.py     # MPN theory → music rules
│
├── scripts/
│   ├── download_datasets.sh            # EMOPIA + Lakh MIDI
│   └── run_training_pipeline.py        # 5-phase orchestrator
│
├── train/
│   ├── config.yaml                     # 16GB GPU optimized config
│   └── train_psychoscore.py            # QLoRA training script
│       ├── create_quantization_config  # 4-bit NF4
│       ├── create_lora_config          # r=16, alpha=32
│       └── train()                     # Training loop
│
├── inference/
│   └── server.py                       # FastAPI inference server
│       ├── /health                     # GPU/model status
│       ├── /generate                   # MIDI generation endpoint
│       └── Rule-based MIDI generator   # Psychometric → MIDI mapping
│
├── checkpoints/
│   └── psychoscore/
│       └── final/                      # Trained model (180MB)
│           ├── adapter_config.json
│           ├── adapter_model.safetensors
│           └── tokenizer files
│
└── tests/
    ├── __init__.py
    └── test_server.py                  # Pytest (16 tests)`} language="plaintext" />
                </section>

                {/* Inference Pipeline */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Inference Pipeline
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5 mb-4">
                        <div className="mermaid">
                            {`sequenceDiagram
    participant C as Client
    participant S as FastAPI Server
    participant T as Tokenizer
    participant M as Model (GPU)
    participant G as MIDI Generator
    
    C->>S: POST /generate {profile}
    S->>S: Validate request
    S->>T: Encode profile
    T->>T: Map to tokens
    T-->>S: input_ids
    S->>M: Generate (autoregressive)
    M->>M: GPT-2 + LoRA forward
    M-->>S: output tokens
    S->>G: Rule-based MIDI generation
    G->>G: Map trauma/entropy → notes
    G->>G: Map RSI → mode/scale
    G-->>S: MIDI binary
    S->>S: Base64 encode
    S-->>C: {success, midi_base64, parameters}`}
                        </div>
                    </div>
                    <p className="text-white/60 text-sm">
                        <strong>Note:</strong> Current implementation uses rule-based MIDI generation from
                        psychometric parameters. Future versions will decode learned MIDI tokens directly
                        from model output using REMI tokenization.
                    </p>
                </section>

                {/* Docker Infrastructure */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">5</span>
                        Docker Infrastructure
                    </h3>
                    <CodeBlock code={`# docker-compose.yml (inference profile)
services:
  psychoscore-inference:
    build: .
    profiles: ["inference"]
    ports:
      - "8001:8000"           # External:Internal
    volumes:
      - ./checkpoints:/app/checkpoints:ro
      - ./inference:/app/inference:ro
    environment:
      - MODEL_PATH=/app/checkpoints/psychoscore/final
      - DEVICE=cuda
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    command: python -m uvicorn inference.server:app --host 0.0.0.0 --port 8000`} language="yaml" />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Server className="w-4 h-4 text-emerald-400" />
                                <span className="font-medium text-emerald-400">Production</span>
                            </div>
                            <p className="text-xs text-white/60">Port 8001, GPU-accelerated, ~30ms latency</p>
                        </div>
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Code className="w-4 h-4 text-blue-400" />
                                <span className="font-medium text-blue-400">Development</span>
                            </div>
                            <p className="text-xs text-white/60">Hot-reload, debug logging, CPU fallback</p>
                        </div>
                    </div>
                </section>

                {/* Hardware Requirements */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">6</span>
                        Hardware Requirements
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Component</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Minimum</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Recommended</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">GPU VRAM</td>
                                    <td className="py-3 px-4">8GB</td>
                                    <td className="py-3 px-4 text-emerald-400">16GB (RTX 5060 Ti)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">CUDA Version</td>
                                    <td className="py-3 px-4">12.0</td>
                                    <td className="py-3 px-4 text-emerald-400">13.0 (Blackwell)</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">PyTorch</td>
                                    <td className="py-3 px-4">2.0+</td>
                                    <td className="py-3 px-4 text-emerald-400">2.9.1</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">System RAM</td>
                                    <td className="py-3 px-4">16GB</td>
                                    <td className="py-3 px-4">32GB</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">Disk Space</td>
                                    <td className="py-3 px-4">5GB</td>
                                    <td className="py-3 px-4">20GB (with datasets)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/psychoscore/training" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Training Pipeline</h4>
                            <p className="text-xs text-white/50 mt-1">QLoRA configuration and hyperparameters</p>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/api" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Inference API</h4>
                            <p className="text-xs text-white/50 mt-1">FastAPI endpoints and TypeScript client</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • PSYCHOSCORE Architecture</span>
                    <span>Last updated: 2026-01-05 07:10 CST</span>
                </div>
            </footer>
        </div>
    );
}
