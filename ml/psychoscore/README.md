# PSYCHOSCORE ML Training

Custom psychometric-to-MIDI model for MPN Conductor.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

## Directory Structure

```
ml/psychoscore/
├── tokenizer/           # REMI + psychometric tokenizer
├── data/               # Data processing scripts
├── train/              # Training scripts
├── inference/          # Inference server
└── checkpoints/        # Model checkpoints (gitignored)
```

## Training on RTX 5070 Ti (16GB)

```bash
# Step 1: Prepare data
python data/process_emopia.py --input ./datasets/EMOPIA_1.0 --output ./data/processed
python data/generate_synthetic_pairs.py --num_pairs 100000 --output ./data/synthetic

# Step 2: Tokenize
python data/tokenize_dataset.py --input ./data --output ./data/tokenized

# Step 3: Train with QLoRA
python train/train_psychoscore.py --config train/config.yaml

# Step 4: Run inference server
python inference/server.py --model ./checkpoints/psychoscore-v1 --port 8000
```

## Hardware Requirements

- GPU: RTX 5070 Ti 16GB (or equivalent)
- RAM: 32GB minimum
- Storage: 100GB SSD
- CUDA: 12.x

## Citation

```bibtex
@misc{psychoscore2026,
  title={PSYCHOSCORE: Psychometric-Conditioned Symbolic Music Generation},
  author={MPN Team},
  year={2026}
}
```
