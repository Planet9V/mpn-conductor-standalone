# PSYCHOSCORE Custom Model Training Plan
**Created:** 2026-01-04 16:30 CST  
**Hardware:** RTX 5070 Ti (16GB VRAM)  
**Goal:** First model mapping comprehensive psychometric frameworks to symbolic music generation

---

## Executive Summary

PSYCHOSCORE is a novel transformer-based model that generates MIDI music directly from psychometric personality profiles, integrating:
- **McKenney-Lacan Theory** (trauma, entropy, RSI registers)
- **DISC/OCEAN/Big Five** personality dimensions
- **Cognitive Biases** (30+ Kahneman-Tversky types)
- **Dark Triad** (Machiavellianism, Narcissism, Psychopathy)
- **Physics Frameworks** (Hamiltonian, Ising, Granovetter, Lyapunov)

---

## 1. Model Architecture

### 1.1 Base Model Selection (16GB VRAM Constraint)

| Model | VRAM (Train) | VRAM (QLoRA) | Strengths | Recommended |
|-------|-------------|--------------|-----------|-------------|
| **RWKV-MIDI** | ~12GB | ~6GB | Linear scaling, efficient | ✅ **PRIMARY** |
| Music Transformer | ~14GB | ~8GB | Industry standard | ✅ FALLBACK |
| ARIA-Medium | ~10GB | ~5GB | LoRA-friendly | ✅ OPTIONAL |
| MusicGen | >16GB | ~10GB | Audio (not MIDI) | ❌ |

**Recommendation:** Use **RWKV-MIDI** (brianflakes/rwkv-midi-piano) as base, fine-tune with QLoRA.

### 1.2 PSYCHOSCORE Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PSYCHOSCORE TRANSFORMER v1.0                      │
├─────────────────────────────────────────────────────────────────────┤
│ INPUT LAYER                                                          │
│   ├── Psychometric Vector (57 dimensions)                           │
│   │   ├── DISC: 4D (Dominance, Influence, Steadiness, Compliance)   │
│   │   ├── OCEAN: 5D (O, C, E, A, N)                                  │
│   │   ├── RSI: 3D (Real, Symbolic, Imaginary)                        │
│   │   ├── McKenney-Lacan: 2D (trauma τ, entropy H)                   │
│   │   ├── Dark Triad: 3D (Mach, Narc, Psych)                         │
│   │   ├── Cognitive Biases: 30D (one-hot or multi-hot)               │
│   │   └── Physics State: 10D (H_energy, Ising_spin, λ_stability...)  │
│   │                                                                  │
│   └── Musical Context (optional conditioning)                        │
│       ├── Key: 12D (major keys one-hot)                              │
│       ├── Mode: 7D (Ionian...Locrian)                                │
│       └── Tempo: 1D (normalized 40-200 BPM)                          │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ CONDITIONING LAYER                                                   │
│   ├── Linear(57 → 512)                                              │
│   ├── Global Style Token (GST) Embedding (8 heads × 256 dim)        │
│   └── Cross-attention conditioning for transformer blocks            │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ TRANSFORMER DECODER (RWKV-based)                                     │
│   ├── 12 blocks, hidden_dim=1024                                    │
│   ├── QLoRA adapters (rank=32, alpha=64)                            │
│   └── Layer norm + residual connections                              │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ OUTPUT LAYER                                                         │
│   ├── REMI Token Vocabulary (~30,000 tokens)                         │
│   └── Autoregressive generation (512-2048 tokens)                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Custom Tokenizer Design

### 2.1 Extended REMI Tokenization

Using MidiTok library with psychometric prefix extension:

```python
# psychoscore_tokenizer.py
from miditok import REMI, TokenizerConfig

class PsychoscoreTokenizer(REMI):
    """REMI tokenizer with psychometric prefix vocabulary"""
    
    PSYCH_VOCAB = {
        # DISC tokens (quantized 0-10)
        **{f"DISC_D:{i/10:.1f}": 1000 + i for i in range(11)},
        **{f"DISC_I:{i/10:.1f}": 1011 + i for i in range(11)},
        **{f"DISC_S:{i/10:.1f}": 1022 + i for i in range(11)},
        **{f"DISC_C:{i/10:.1f}": 1033 + i for i in range(11)},
        
        # OCEAN tokens
        **{f"OCEAN_O:{i/10:.1f}": 1100 + i for i in range(11)},
        **{f"OCEAN_C:{i/10:.1f}": 1111 + i for i in range(11)},
        **{f"OCEAN_E:{i/10:.1f}": 1122 + i for i in range(11)},
        **{f"OCEAN_A:{i/10:.1f}": 1133 + i for i in range(11)},
        **{f"OCEAN_N:{i/10:.1f}": 1144 + i for i in range(11)},
        
        # Lacanian RSI
        "RSI_REAL_DOM": 1200,
        "RSI_SYMBOLIC_DOM": 1201,
        "RSI_IMAGINARY_DOM": 1202,
        **{f"RSI_R:{i/10:.1f}": 1210 + i for i in range(11)},
        **{f"RSI_S:{i/10:.1f}": 1221 + i for i in range(11)},
        **{f"RSI_I:{i/10:.1f}": 1232 + i for i in range(11)},
        
        # McKenney-Lacan
        **{f"TRAUMA:{i/10:.1f}": 1300 + i for i in range(11)},
        **{f"ENTROPY:{i/10:.1f}": 1311 + i for i in range(11)},
        
        # Dark Triad
        **{f"DARK_MACH:{i/10:.1f}": 1400 + i for i in range(11)},
        **{f"DARK_NARC:{i/10:.1f}": 1411 + i for i in range(11)},
        **{f"DARK_PSYCH:{i/10:.1f}": 1422 + i for i in range(11)},
        
        # Cognitive Biases (30 discrete tokens)
        "BIAS_AUTHORITY": 1500,
        "BIAS_SCARCITY": 1501,
        "BIAS_SOCIAL_PROOF": 1502,
        "BIAS_CONFIRMATION": 1503,
        "BIAS_ANCHORING": 1504,
        "BIAS_AVAILABILITY": 1505,
        "BIAS_LOSS_AVERSION": 1506,
        "BIAS_HINDSIGHT": 1507,
        "BIAS_DUNNING_KRUGER": 1508,
        "BIAS_BANDWAGON": 1509,
        # ... (30 total)
        
        # Physics Framework States
        **{f"HAMILTONIAN:{i/10:.1f}": 1600 + i for i in range(11)},
        **{f"ISING_SPIN:{s}": 1611 + (0 if s == '+' else 1) for s in ['+', '-']},
        **{f"GRANOVETTER:{i/10:.1f}": 1620 + i for i in range(11)},
        **{f"LYAPUNOV:{i/10:.1f}": 1631 + i for i in range(11)},
        
        # Musical Context
        **{f"KEY_{k}": 1700 + i for i, k in enumerate([
            'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'
        ])},
        **{f"MODE_{m}": 1720 + i for i, m in enumerate([
            'Ionian', 'Dorian', 'Phrygian', 'Lydian', 
            'Mixolydian', 'Aeolian', 'Locrian'
        ])},
        **{f"TEMPO_{t}": 1730 + i for i, t in enumerate([
            '40', '60', '80', '100', '120', '140', '160', '180', '200'
        ])},
    }
```

### 2.2 Token Sequence Format

```
[PSYCH_PREFIX (50-100 tokens)] [SEP] [REMI_TOKENS (512-2048 tokens)]

Example:
DISC_D:0.8 DISC_I:0.3 DISC_S:0.4 DISC_C:0.6
OCEAN_O:0.7 OCEAN_C:0.5 OCEAN_E:0.4 OCEAN_A:0.6 OCEAN_N:0.3
RSI_SYMBOLIC_DOM RSI_R:0.2 RSI_S:0.6 RSI_I:0.2
TRAUMA:0.4 ENTROPY:0.3
DARK_MACH:0.2 DARK_NARC:0.1 DARK_PSYCH:0.1
BIAS_AUTHORITY BIAS_CONFIRMATION
HAMILTONIAN:0.5 ISING_SPIN:+ LYAPUNOV:0.3
KEY_D MODE_Lydian TEMPO_120
[SEP]
BAR_0 POS_0/8 PITCH_62 VEL_80 DUR_4 POS_4/8 PITCH_64 ...
```

---

## 3. Training Dataset

### 3.1 Source Datasets

| Dataset | Size | Format | Usage |
|---------|------|--------|-------|
| **EMOPIA** | 1,087 clips | MIDI + emotion | Primary emotion-MIDI pairs |
| **Lakh MIDI** | 170,000 files | MIDI only | Pretraining corpus |
| **VGMIDI** | 200 clips | MIDI + valence/arousal | Validation |
| **MAESTRO** | 1,200 hrs | Piano MIDI | Optional pretraining |
| **MPN Theory** | ~500 entries | Psychometric rules | Synthetic generation |

### 3.2 Synthetic Data Generation

```python
# generate_psychoscore_pairs.py
"""
Generate synthetic psychometric → MIDI training pairs
using MPN theory framework rules.
"""

import random
from typing import Dict, Any

def generate_psychometric_profile() -> Dict[str, Any]:
    """Generate random but coherent psychometric profile"""
    
    # DISC (sum to ~2.0 typical)
    disc = {
        'D': random.betavariate(2, 5),  # Most people low-medium
        'I': random.betavariate(3, 3),
        'S': random.betavariate(3, 3),
        'C': random.betavariate(2, 4),
    }
    
    # OCEAN
    ocean = {k: random.betavariate(3, 3) for k in 'OCEAN'}
    
    # RSI (must sum to 1.0)
    rsi_raw = [random.random() for _ in range(3)]
    rsi_total = sum(rsi_raw)
    rsi = {
        'real': rsi_raw[0] / rsi_total,
        'symbolic': rsi_raw[1] / rsi_total,
        'imaginary': rsi_raw[2] / rsi_total,
    }
    
    # McKenney-Lacan
    trauma = random.betavariate(2, 5)  # Most scenes low trauma
    entropy = random.betavariate(2, 3)
    
    # Dark Triad (rare, mostly low)
    dark = {
        'machiavellianism': random.betavariate(1.5, 8),
        'narcissism': random.betavariate(1.5, 8),
        'psychopathy': random.betavariate(1.2, 10),
    }
    
    # Cognitive biases (select 0-3 active)
    all_biases = [
        'authority', 'scarcity', 'social_proof', 'confirmation',
        'anchoring', 'availability', 'loss_aversion', 'hindsight',
        'dunning_kruger', 'bandwagon', 'recency', 'halo', 'framing',
        'sunk_cost', 'optimism', 'pessimism', 'groupthink', 'blind_spot',
        'self_serving', 'fundamental_attribution', 'negativity',
        'positivity', 'status_quo', 'attribution', 'projection',
        'actor_observer', 'false_consensus', 'illusion_control',
        'just_world', 'spotlight'
    ]
    active_biases = random.sample(all_biases, k=random.randint(0, 3))
    
    # Physics state
    physics = {
        'hamiltonian_energy': random.random(),
        'ising_spin': random.choice(['+', '-']),
        'granovetter_threshold': random.random(),
        'lyapunov_exponent': random.uniform(-0.5, 0.5),
    }
    
    return {
        'disc': disc,
        'ocean': ocean,
        'rsi': rsi,
        'trauma': trauma,
        'entropy': entropy,
        'dark_triad': dark,
        'cognitive_biases': active_biases,
        'physics': physics,
    }


def profile_to_musical_params(profile: Dict) -> Dict[str, Any]:
    """Map psychometric profile to musical parameters using MPN rules"""
    
    # Determine dominant RSI register
    rsi = profile['rsi']
    rsi_dom = max(rsi, key=rsi.get)
    
    # Modal selection based on RSI + trauma
    if rsi_dom == 'real':
        mode = 'Aeolian' if profile['trauma'] > 0.6 else 'Dorian'
    elif rsi_dom == 'symbolic':
        mode = 'Mixolydian' if profile['trauma'] > 0.6 else 'Lydian'
    else:  # imaginary
        mode = 'Locrian' if profile['trauma'] > 0.6 else 'Phrygian'
    
    # Key based on OCEAN Openness
    keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']
    key = keys[int(profile['ocean']['O'] * 11)]
    
    # Tempo based on entropy + extraversion
    base_tempo = 60 + int(profile['entropy'] * 80)  # 60-140
    if profile['ocean']['E'] > 0.7:
        base_tempo += 20
    tempo = min(200, max(40, base_tempo))
    
    # Dynamics based on DISC Dominance
    dynamics = 'ff' if profile['disc']['D'] > 0.7 else (
        'f' if profile['disc']['D'] > 0.5 else (
        'mf' if profile['disc']['D'] > 0.3 else 'p'
    ))
    
    # Instrumentation based on trauma + DISC
    if profile['trauma'] > 0.8:
        instruments = ['brass', 'percussion', 'strings']
    elif profile['trauma'] > 0.5:
        instruments = ['strings', 'woodwinds']
    else:
        instruments = ['piano', 'celesta', 'harp']
    
    return {
        'key': key,
        'mode': mode,
        'tempo': tempo,
        'dynamics': dynamics,
        'instruments': instruments,
        'time_signature': '4/4',
    }
```

### 3.3 Data Preparation Pipeline

```bash
# Step 1: Download base datasets
wget https://zenodo.org/records/4096310/files/EMOPIA_1.0.zip
git clone https://github.com/craffel/lmd.git lakh_midi

# Step 2: Process EMOPIA with emotion labels
python scripts/process_emopia.py --input ./EMOPIA_1.0 --output ./data/emopia_processed

# Step 3: Generate synthetic pairs
python scripts/generate_psychoscore_pairs.py \
    --num_pairs 100000 \
    --output ./data/synthetic_pairs \
    --mpn_rules ./theory/MPN_RULES.json

# Step 4: Tokenize all data
python scripts/tokenize_dataset.py \
    --input ./data \
    --tokenizer psychoscore \
    --output ./data/tokenized

# Step 5: Create train/val/test splits
python scripts/split_dataset.py \
    --input ./data/tokenized \
    --train 0.9 --val 0.05 --test 0.05
```

---

## 4. Training Configuration

### 4.1 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| GPU | RTX 5070 Ti 16GB | RTX 5070 Ti 16GB |
| RAM | 32GB | 64GB |
| Storage | 100GB SSD | 500GB NVMe |
| CUDA | 12.x | 12.x |

### 4.2 QLoRA Training Configuration

```python
# train_psychoscore.py
from peft import LoraConfig, get_peft_model, TaskType
from transformers import TrainingArguments, Trainer
import bitsandbytes as bnb

# LoRA configuration for 16GB VRAM
lora_config = LoraConfig(
    r=32,                      # Rank
    lora_alpha=64,             # Scaling
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
)

# Training arguments
training_args = TrainingArguments(
    output_dir="./checkpoints/psychoscore",
    
    # Batch configuration (16GB VRAM)
    per_device_train_batch_size=2,
    per_device_eval_batch_size=2,
    gradient_accumulation_steps=16,  # Effective batch = 32
    
    # Learning rate
    learning_rate=1e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.1,
    
    # Training duration
    num_train_epochs=10,
    max_steps=-1,
    
    # Memory optimization
    gradient_checkpointing=True,
    fp16=True,  # or bf16=True for newer GPUs
    optim="paged_adamw_8bit",
    
    # Logging
    logging_steps=50,
    eval_strategy="steps",
    eval_steps=500,
    save_strategy="steps",
    save_steps=1000,
    
    # Other
    dataloader_num_workers=4,
    seed=42,
)
```

### 4.3 Training Script

```python
# train_psychoscore.py (continued)
from transformers import AutoModelForCausalLM, AutoTokenizer
from datasets import load_from_disk

def main():
    # Load base model with 4-bit quantization
    model = AutoModelForCausalLM.from_pretrained(
        "brianflakes/rwkv-midi-piano",
        load_in_4bit=True,
        device_map="auto",
        quantization_config=bnb.BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_use_double_quant=True,
        ),
        trust_remote_code=True,
    )
    
    # Apply LoRA
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    # Output: trainable params: 19,988,480 || all params: 1,100,000,000 || 1.8%
    
    # Load tokenizer with extended vocab
    tokenizer = PsychoscoreTokenizer.from_pretrained("./tokenizers/psychoscore")
    
    # Load dataset
    dataset = load_from_disk("./data/tokenized")
    
    # Define data collator
    def collate_fn(batch):
        # Prefix + MIDI concatenation
        input_ids = [item['psych_tokens'] + item['midi_tokens'] for item in batch]
        labels = input_ids.copy()  # Causal LM: predict next token
        return {
            'input_ids': torch.tensor(input_ids),
            'attention_mask': torch.ones_like(torch.tensor(input_ids)),
            'labels': torch.tensor(labels),
        }
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=dataset['train'],
        eval_dataset=dataset['validation'],
        data_collator=collate_fn,
    )
    
    # Train
    trainer.train()
    
    # Save
    trainer.save_model("./models/psychoscore-v1")
    tokenizer.save_pretrained("./models/psychoscore-v1")

if __name__ == "__main__":
    main()
```

---

## 5. Inference Pipeline

### 5.1 Real-Time Generation

```python
# inference.py
import torch
from transformers import AutoModelForCausalLM
from miditok import REMI

class PsychoscoreInference:
    def __init__(self, model_path: str):
        self.model = AutoModelForCausalLM.from_pretrained(
            model_path,
            device_map="auto",
            torch_dtype=torch.float16,
        )
        self.tokenizer = PsychoscoreTokenizer.from_pretrained(model_path)
        self.model.eval()
    
    def generate(
        self,
        psychometric_profile: dict,
        max_bars: int = 32,
        temperature: float = 0.8,
        top_p: float = 0.9,
    ) -> bytes:
        """Generate MIDI from psychometric profile"""
        
        # Build prefix tokens
        prefix = self.tokenizer.encode_psychometric_profile(psychometric_profile)
        
        # Add separator and BOS
        input_ids = torch.tensor([prefix + [self.tokenizer.sep_token_id]])
        
        # Generate
        with torch.no_grad():
            outputs = self.model.generate(
                input_ids.to(self.model.device),
                max_new_tokens=max_bars * 64,  # ~64 tokens per bar
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
            )
        
        # Extract MIDI tokens (after SEP)
        midi_tokens = outputs[0][len(prefix) + 1:].tolist()
        
        # Convert to MIDI
        midi_obj = self.tokenizer.tokens_to_midi([midi_tokens])
        
        return midi_obj.write()  # Returns bytes
```

### 5.2 Integration with MPN Conductor

```typescript
// src/lib/psychoscore_client.ts
export class PsychoscoreClient {
    private endpoint = 'http://localhost:8000/generate';
    
    async generateFromPsychometrics(
        profile: PsychometricState,
        maxBars: number = 32
    ): Promise<ArrayBuffer> {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                disc: profile.discProfile,
                ocean: profile.oceanProfile,
                rsi: profile.rsi,
                trauma: profile.trauma,
                entropy: profile.entropy,
                dark_triad: profile.darkTriad,
                cognitive_biases: profile.activeBiases,
                physics: profile.physicsState,
                max_bars: maxBars,
            }),
        });
        
        return response.arrayBuffer();
    }
}
```

---

## 6. Training Timeline

### Phase 1: Data Preparation (Week 1)
- [ ] Download EMOPIA, Lakh MIDI, VGMIDI datasets
- [ ] Implement PsychoscoreTokenizer with full vocabulary
- [ ] Generate 100k synthetic psychometric→MIDI pairs
- [ ] Create train/val/test splits

### Phase 2: Base Model Setup (Week 2)
- [ ] Set up RWKV-MIDI with 4-bit quantization
- [ ] Implement QLoRA configuration
- [ ] Test memory usage on 5070 Ti
- [ ] Verify gradient checkpointing works

### Phase 3: Training (Weeks 3-4)
- [ ] Initial training run (1 epoch) - validate pipeline
- [ ] Full training run (10 epochs) - ~48-72 hours
- [ ] Monitor loss curves, adjust hyperparameters
- [ ] Save checkpoints every 1000 steps

### Phase 4: Evaluation & Integration (Week 5)
- [ ] Evaluate on held-out EMOPIA test set
- [ ] Manual listening tests for musicality
- [ ] Integrate with MPN Conductor
- [ ] Deploy inference server

---

## 7. Expected Outcomes

### 7.1 Model Capabilities

| Capability | Description |
|------------|-------------|
| **Psychometric → Mode** | High trauma activates Aeolian/Locrian, low activates Lydian |
| **RSI → Texture** | Real=grounded, Symbolic=structured, Imaginary=ethereal |
| **DISC → Dynamics** | High Dominance=fortissimo, high Steadiness=legato |
| **Entropy → Chaos** | High entropy=unpredictable rhythms, modulations |
| **Dark Triad → Dissonance** | High Machiavellianism=hidden voices, chromaticism |

### 7.2 Success Metrics

| Metric | Target |
|--------|--------|
| Emotion classification accuracy (vs EMOPIA labels) | >70% |
| Musicality rating (human eval 1-5) | >3.5 |
| Generation latency (32 bars) | <2 seconds |
| Model size (QLoRA adapters only) | <100MB |

---

## 8. Files to Create

```
mpn-conductor-standalone/
├── ml/
│   ├── psychoscore/
│   │   ├── tokenizer/
│   │   │   ├── __init__.py
│   │   │   ├── psychoscore_tokenizer.py
│   │   │   └── vocab.json
│   │   ├── data/
│   │   │   ├── process_emopia.py
│   │   │   ├── generate_synthetic_pairs.py
│   │   │   └── tokenize_dataset.py
│   │   ├── train/
│   │   │   ├── train_psychoscore.py
│   │   │   ├── config.yaml
│   │   │   └── evaluate.py
│   │   ├── inference/
│   │   │   ├── server.py
│   │   │   └── psychoscore_inference.py
│   │   └── README.md
│   └── requirements.txt
└── src/lib/
    └── psychoscore_client.ts
```

---

## References

- [MidiTok Documentation](https://miditok.readthedocs.io/)
- [EMOPIA Dataset](https://annahung31.github.io/EMOPIA/)
- [RWKV Architecture](https://github.com/BlinkDL/RWKV-LM)
- [QLoRA Paper](https://arxiv.org/abs/2305.14314)
- [Text2midi (AAAI 2025)](https://github.com/AMAAI-Lab/Text2midi)
- [MPN Theory Framework](./RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md)

---

**Status:** Ready for implementation. Begin with Phase 1 data preparation.
