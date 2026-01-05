'use client';

import Link from 'next/link';
import { ArrowLeft, Zap, Terminal, BarChart3, Settings, Clock, CheckCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * PSYCHOSCORE Training Pipeline Documentation
 * 
 * Detailed documentation of the QLoRA training process, hyperparameters,
 * and training results.
 * 
 * Updated: 2026-01-05 07:20 CST
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

export default function TrainingPage() {
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
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold">Training Pipeline</h1>
                                <p className="text-xs text-white/40">PSYCHOSCORE → Training</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {/* Title */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                        <span className="text-blue-400">QLoRA</span> Training Pipeline
                    </h2>
                    <p className="text-lg text-white/60">
                        Complete documentation of the PSYCHOSCORE training process using Quantized Low-Rank
                        Adaptation (QLoRA) for efficient fine-tuning on consumer hardware.
                    </p>
                </div>

                {/* Pipeline Diagram */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">1</span>
                        Training Pipeline Stages
                    </h3>
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <div className="mermaid">
                            {`flowchart LR
    subgraph Phase1["Phase 1: Data Preparation"]
        Generate["Generate Synthetic Pairs"]
        Tokenize["Tokenize Profiles"]
    end

    subgraph Phase2["Phase 2: Model Setup"]  
        LoadBase["Load GPT-2 Base"]
        Quantize["4-bit Quantization (NF4)"]
        ApplyLoRA["Apply LoRA Adapters"]
    end

    subgraph Phase3["Phase 3: Training"]
        DataLoader["Create DataLoader"]
        Train["Training Loop"]
        Checkpoint["Save Checkpoints"]
    end

    subgraph Phase4["Phase 4: Export"]
        Merge["Merge Adapters"]
        Export["Export Final Model"]
        Eval["Evaluate Samples"]
    end

    Generate --> Tokenize
    Tokenize --> LoadBase
    LoadBase --> Quantize
    Quantize --> ApplyLoRA
    ApplyLoRA --> DataLoader
    DataLoader --> Train
    Train --> Checkpoint
    Checkpoint --> Merge
    Merge --> Export
    Export --> Eval`}
                        </div>
                    </div>
                </section>

                {/* QLoRA Configuration */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">2</span>
                        QLoRA Configuration
                    </h3>
                    <CodeBlock code={`# train/config.yaml

# Base Model Configuration
model:
  name: "openai-community/gpt2"
  max_length: 512
  dtype: "float16"

# Quantization (4-bit NF4)
quantization:
  load_in_4bit: true
  bnb_4bit_compute_dtype: "float16"
  bnb_4bit_quant_type: "nf4"
  bnb_4bit_use_double_quant: true

# LoRA Configuration
lora:
  r: 16                    # Rank
  lora_alpha: 32           # Alpha scaling
  target_modules:
    - "c_attn"             # Q, K, V projections
    - "c_proj"             # Output projection
  lora_dropout: 0.05
  bias: "none"
  task_type: "CAUSAL_LM"

# Training Hyperparameters
training:
  num_synthetic_pairs: 15000
  batch_size: 4
  gradient_accumulation_steps: 4
  effective_batch_size: 16  # 4 × 4
  learning_rate: 2.0e-4
  weight_decay: 0.01
  warmup_ratio: 0.03
  num_epochs: 10
  max_steps: -1
  logging_steps: 10
  save_steps: 500
  
# Hardware Optimization
optimization:
  gradient_checkpointing: true
  fp16: true
  optim: "paged_adamw_8bit"
  dataloader_num_workers: 4
  pin_memory: true`} language="yaml" />
                </section>

                {/* Training Results */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">3</span>
                        Production Training Results
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle className="w-6 h-6 text-emerald-400" />
                                <h4 className="font-semibold text-emerald-400">Training Complete</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Total Steps</span>
                                    <span className="font-mono">3,750</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Training Time</span>
                                    <span className="font-mono">~2 hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">GPU Memory</span>
                                    <span className="font-mono">14.2 GB</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/10">
                            <div className="flex items-center gap-3 mb-4">
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                                <h4 className="font-semibold text-blue-400">Loss Metrics</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Initial Loss</span>
                                    <span className="font-mono">9.99</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Final Loss</span>
                                    <span className="font-mono text-emerald-400">6.09</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Reduction</span>
                                    <span className="font-mono text-emerald-400">39%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loss Curve */}
                    <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                        <h4 className="font-semibold mb-4">Training Loss Curve</h4>
                        <div className="h-48 flex items-end justify-around gap-1">
                            {[9.99, 9.2, 8.5, 7.8, 7.2, 6.8, 6.5, 6.3, 6.15, 6.09].map((loss, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div
                                        className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                                        style={{ height: `${(loss / 10) * 150}px` }}
                                    />
                                    <span className="text-xs text-white/40">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-xs text-white/40 mt-2">Epoch (1-10)</p>
                    </div>
                </section>

                {/* Run Commands */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">4</span>
                        Running Training
                    </h3>
                    <CodeBlock code={`# Navigate to PSYCHOSCORE directory
cd ml/psychoscore

# Build Docker image (first time only)
docker compose build psychoscore-train

# Run training with 15k synthetic pairs
docker compose run psychoscore-train \\
  python scripts/run_training_pipeline.py \\
  --num-synthetic 15000

# Monitor training (in another terminal)
docker compose logs -f psychoscore-train

# Check training status
cat logs/training_status.json

# View checkpoints
ls -la checkpoints/psychoscore/

# Scale to 50k pairs (production)
docker compose run psychoscore-train \\
  python scripts/run_training_pipeline.py \\
  --num-synthetic 50000`} language="bash" />
                </section>

                {/* Improvement Recommendations */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">5</span>
                        Improvement Recommendations (ICE Scores)
                    </h3>
                    <p className="text-white/70 mb-4">
                        Prioritized recommendations to improve PSYCHOSCORE accuracy beyond the baseline 70% target:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-[#FFD700]">#</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Recommendation</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Impact</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Confidence</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">Ease</th>
                                    <th className="text-left py-3 px-4 text-[#FFD700]">ICE</th>
                                </tr>
                            </thead>
                            <tbody className="text-white/80">
                                <tr className="border-b border-white/10 bg-emerald-500/5">
                                    <td className="py-3 px-4">1</td>
                                    <td className="py-3 px-4 font-medium">Train on EMOPIA dataset (real emotion-MIDI)</td>
                                    <td className="py-3 px-4 text-green-400">High</td>
                                    <td className="py-3 px-4 text-green-400">High</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4 font-bold text-emerald-400">8.5</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">2</td>
                                    <td className="py-3 px-4 font-medium">Scale synthetic pairs to 50k+</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4 text-green-400">High</td>
                                    <td className="py-3 px-4 text-green-400">High</td>
                                    <td className="py-3 px-4 font-bold text-blue-400">7.5</td>
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="py-3 px-4">3</td>
                                    <td className="py-3 px-4 font-medium">Temperature scheduling (entropy-based)</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4 text-green-400">High</td>
                                    <td className="py-3 px-4 font-bold text-blue-400">6.5</td>
                                </tr>
                                <tr>
                                    <td className="py-3 px-4">4</td>
                                    <td className="py-3 px-4 font-medium">Contrastive learning (profile similarity)</td>
                                    <td className="py-3 px-4 text-green-400">High</td>
                                    <td className="py-3 px-4 text-amber-400">Medium</td>
                                    <td className="py-3 px-4 text-red-400">Low</td>
                                    <td className="py-3 px-4 font-bold text-purple-400">6.0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Hardware Details */}
                <section className="mb-12">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-[#FFD700]/20 flex items-center justify-center text-sm">6</span>
                        Training Hardware
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Settings className="w-4 h-4 text-cyan-400" />
                                <span className="font-medium text-cyan-400">GPU</span>
                            </div>
                            <p className="text-sm text-white/70">RTX 5060 Ti (Blackwell)</p>
                            <p className="text-xs text-white/40">16GB GDDR7, sm_120</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal className="w-4 h-4 text-purple-400" />
                                <span className="font-medium text-purple-400">CUDA</span>
                            </div>
                            <p className="text-sm text-white/70">CUDA 13.0</p>
                            <p className="text-xs text-white/40">cuDNN 9.3</p>
                        </div>
                        <div className="p-4 rounded-lg border border-white/10 bg-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span className="font-medium text-amber-400">Framework</span>
                            </div>
                            <p className="text-sm text-white/70">PyTorch 2.9.1</p>
                            <p className="text-xs text-white/40">Transformers 4.48</p>
                        </div>
                    </div>
                </section>

                {/* Related */}
                <section className="p-6 rounded-xl border border-white/10 bg-white/5">
                    <h3 className="text-lg font-semibold mb-4">Related Documentation</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <Link href="/wiki/ai/psychoscore/architecture" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">System Architecture</h4>
                            <p className="text-xs text-white/50 mt-1">Model structure and file organization</p>
                        </Link>
                        <Link href="/wiki/ai/psychoscore/api" className="p-4 rounded-lg hover:bg-white/5 border border-white/10 transition">
                            <h4 className="font-medium text-[#FFD700]">Inference API</h4>
                            <p className="text-xs text-white/50 mt-1">Deploy and use the trained model</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-6 mt-16">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-white/40">
                    <span>MPN Wiki • PSYCHOSCORE Training Pipeline</span>
                    <span>Last updated: 2026-01-05 07:20 CST</span>
                </div>
            </footer>
        </div>
    );
}
