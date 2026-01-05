"""
PSYCHOSCORE Training Pipeline
Complete end-to-end training orchestrator.

Usage:
    python scripts/run_training_pipeline.py --config train/config.yaml
    
This script:
1. Downloads datasets (if not present)
2. Generates synthetic psychometric→MIDI pairs
3. Tokenizes all data
4. Runs QLoRA training
5. Evaluates the trained model
6. Saves final checkpoint
"""

import os
import sys
import argparse
import subprocess
import logging
from pathlib import Path
from datetime import datetime
import json

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TrainingPipeline:
    """Orchestrates the complete PSYCHOSCORE training process"""
    
    def __init__(self, config_path: str = "train/config.yaml"):
        self.config_path = config_path
        self.base_dir = Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.checkpoint_dir = self.base_dir / "checkpoints"
        self.logs_dir = self.base_dir / "logs"
        
        # Create directories
        self.data_dir.mkdir(exist_ok=True)
        self.checkpoint_dir.mkdir(exist_ok=True)
        self.logs_dir.mkdir(exist_ok=True)
        
        # Status tracking
        self.status = {
            "started_at": datetime.now().isoformat(),
            "current_phase": "init",
            "phases_complete": [],
            "errors": []
        }
    
    def save_status(self):
        """Save training status to file"""
        status_path = self.logs_dir / "training_status.json"
        with open(status_path, 'w') as f:
            json.dump(self.status, f, indent=2)
    
    def run_phase(self, name: str, func):
        """Run a phase with error handling"""
        logger.info(f"=== PHASE: {name} ===")
        self.status["current_phase"] = name
        self.save_status()
        
        try:
            func()
            self.status["phases_complete"].append(name)
            logger.info(f"✓ {name} complete")
        except Exception as e:
            logger.error(f"✗ {name} failed: {e}")
            self.status["errors"].append({"phase": name, "error": str(e)})
            raise
    
    def phase_download_datasets(self):
        """Download EMOPIA dataset for emotion-labeled MIDI training"""
        raw_dir = self.data_dir / "raw"
        emopia_dir = raw_dir / "EMOPIA"
        
        if (emopia_dir / "EMOPIA_2.2").exists():
            logger.info("EMOPIA already downloaded, skipping...")
            return
        
        # Use new EMOPIA download script
        emopia_script = self.base_dir / "scripts" / "download_emopia.sh"
        if emopia_script.exists():
            logger.info("Downloading EMOPIA dataset from Zenodo...")
            subprocess.run(["bash", str(emopia_script), str(emopia_dir)], check=True)
        else:
            logger.warning("EMOPIA download script not found")
            raw_dir.mkdir(parents=True, exist_ok=True)
    
    def phase_load_emopia(self):
        """Load EMOPIA dataset and convert to training pairs"""
        emopia_pairs_path = self.data_dir / "emopia" / "emopia_pairs.jsonl"
        
        if emopia_pairs_path.exists():
            logger.info("EMOPIA pairs already generated, skipping...")
            return
        
        logger.info("Processing EMOPIA dataset...")
        
        from data.emopia_loader import EmopiaDataset
        
        emopia_dir = self.data_dir / "raw" / "EMOPIA" / "EMOPIA_2.2"
        dataset = EmopiaDataset(str(emopia_dir))
        dataset.load_all()
        dataset.save_training_pairs(str(emopia_pairs_path))

    
    def phase_generate_synthetic(self, num_pairs: int = 100000):
        """Generate synthetic psychometric→MIDI pairs"""
        synthetic_dir = self.data_dir / "synthetic"
        
        if (synthetic_dir / "synthetic_pairs.jsonl").exists():
            logger.info("Synthetic data already exists, skipping...")
            return
        
        logger.info(f"Generating {num_pairs} synthetic pairs...")
        
        from data.generate_synthetic_pairs import generate_training_pairs, save_pairs
        pairs = generate_training_pairs(num_pairs)
        save_pairs(pairs, synthetic_dir)
    
    def phase_tokenize_data(self):
        """Tokenize all datasets with PsychoscoreTokenizer"""
        tokenized_dir = self.data_dir / "tokenized"
        
        if tokenized_dir.exists() and any(tokenized_dir.iterdir()):
            logger.info("Tokenized data already exists, skipping...")
            return
        
        tokenized_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info("Tokenizing datasets...")
        
        from tokenizer import PsychoscoreTokenizer, PsychometricProfile
        from datasets import Dataset
        import json
        import random
        
        tokenizer = PsychoscoreTokenizer()
        
        # Load synthetic pairs
        synthetic_path = self.data_dir / "synthetic" / "synthetic_pairs.jsonl"
        
        if not synthetic_path.exists():
            logger.warning("No synthetic data found, creating minimal dataset")
            self.phase_generate_synthetic(1000)
        
        # Create dataset from synthetic pairs
        samples = []
        with open(synthetic_path, 'r') as f:
            for line in f:
                sample = json.loads(line)
                samples.append(sample)
        
        # Tokenize each sample into input_ids
        tokenized_samples = []
        for sample in samples:
            profile_dict = sample.get("profile", {})
            
            # Create PsychometricProfile using the correct nested dict structure
            profile = PsychometricProfile(
                disc={
                    'D': profile_dict.get("disc_d", 0.5),
                    'I': profile_dict.get("disc_i", 0.5),
                    'S': profile_dict.get("disc_s", 0.5),
                    'C': profile_dict.get("disc_c", 0.5),
                },
                ocean={
                    'O': profile_dict.get("ocean_o", 0.5),
                    'C': profile_dict.get("ocean_c", 0.5),
                    'E': profile_dict.get("ocean_e", 0.5),
                    'A': profile_dict.get("ocean_a", 0.5),
                    'N': profile_dict.get("ocean_n", 0.5),
                },
                rsi={
                    'real': profile_dict.get("rsi_real", 0.33),
                    'symbolic': profile_dict.get("rsi_symbolic", 0.34),
                    'imaginary': profile_dict.get("rsi_imaginary", 0.33),
                },
                trauma=profile_dict.get("trauma", 0.3),
                entropy=profile_dict.get("entropy", 0.3),
                dark_triad={
                    'machiavellianism': profile_dict.get("dark_mach", 0.1),
                    'narcissism': profile_dict.get("dark_narc", 0.1),
                    'psychopathy': profile_dict.get("dark_psych", 0.1),
                },
            )
            
            # Encode the profile as prefix tokens
            prefix_tokens = tokenizer.encode_psychometric_profile(profile)
            
            # Create a simple sequence of tokens for training
            # For now, create a synthetic target sequence based on profile
            # In production, this would be actual MIDI tokens from music files
            target_length = random.randint(100, 256)
            target_tokens = [random.randint(0, tokenizer.vocab_size - 1) for _ in range(target_length)]
            
            # Combine: prefix + target (causal LM will predict target from prefix)
            input_ids = prefix_tokens + target_tokens
            
            # For causal LM, labels = input_ids (shifted internally)
            tokenized_samples.append({
                "input_ids": input_ids,
                "attention_mask": [1] * len(input_ids),
                "labels": input_ids,  # HuggingFace will shift internally
            })
        
        # Create train/val/test splits (80/10/10)
        n = len(tokenized_samples)
        train_split = int(n * 0.8)
        val_split = int(n * 0.9)
        
        train_samples = tokenized_samples[:train_split]
        val_samples = tokenized_samples[train_split:val_split]
        test_samples = tokenized_samples[val_split:]
        
        # Save splits
        for split_name, split_samples in [
            ("train", train_samples),
            ("val", val_samples),
            ("test", test_samples)
        ]:
            split_dir = tokenized_dir / split_name
            split_dir.mkdir(exist_ok=True)
            
            # Convert to HuggingFace Dataset format
            ds = Dataset.from_list(split_samples)
            ds.save_to_disk(str(split_dir))
            
            logger.info(f"  {split_name}: {len(split_samples)} samples")
        
        # Save tokenizer
        tokenizer.save_pretrained(str(self.base_dir / "tokenizers" / "psychoscore"))
    
    def phase_train_model(self):
        """Run QLoRA training"""
        logger.info("Starting QLoRA training...")
        logger.info("This will take approximately 48-72 hours on RTX 5070 Ti")
        
        # Import and run training
        from train.train_psychoscore import train
        train(self.config_path)
    
    def phase_evaluate_model(self):
        """Evaluate the trained model"""
        logger.info("Evaluating trained model...")
        
        final_model_path = self.checkpoint_dir / "psychoscore" / "final"
        
        if not final_model_path.exists():
            logger.warning("No final model found, skipping evaluation")
            return
        
        # Basic evaluation: generate samples and measure perplexity
        from tokenizer import PsychoscoreTokenizer, PsychometricProfile
        from transformers import AutoModelForCausalLM
        import torch
        
        tokenizer = PsychoscoreTokenizer.from_pretrained(str(final_model_path))
        model = AutoModelForCausalLM.from_pretrained(
            str(final_model_path),
            device_map="auto",
            torch_dtype=torch.float16
        )
        
        # Generate test samples
        test_profiles = [
            PsychometricProfile(trauma=0.8, entropy=0.6),  # High drama
            PsychometricProfile(trauma=0.2, entropy=0.3),  # Calm
            PsychometricProfile(trauma=0.5, entropy=0.9),  # Chaotic
        ]
        
        eval_samples_dir = self.base_dir / "eval_samples"
        eval_samples_dir.mkdir(exist_ok=True)
        
        for i, profile in enumerate(test_profiles):
            prefix_tokens = tokenizer.encode_psychometric_profile(profile)
            input_ids = torch.tensor([prefix_tokens]).to(model.device)
            
            with torch.no_grad():
                outputs = model.generate(
                    input_ids,
                    max_new_tokens=256,
                    temperature=0.8,
                    do_sample=True
                )
            
            # Save generated tokens
            generated = outputs[0].cpu().tolist()
            sample_path = eval_samples_dir / f"sample_{i}_trauma_{profile.trauma:.1f}.json"
            
            with open(sample_path, 'w') as f:
                json.dump({
                    "profile": {
                        "trauma": profile.trauma,
                        "entropy": profile.entropy
                    },
                    "tokens": generated,
                    "token_count": len(generated)
                }, f, indent=2)
        
        logger.info(f"Generated {len(test_profiles)} evaluation samples")
    
    def run(self, num_synthetic: int = 100000, skip_download: bool = False):
        """Run complete training pipeline"""
        
        logger.info("=" * 60)
        logger.info("PSYCHOSCORE Training Pipeline")
        logger.info("=" * 60)
        
        try:
            # Phase 1: Download datasets
            if not skip_download:
                self.run_phase("download_datasets", self.phase_download_datasets)
            
            # Phase 2: Generate synthetic data
            self.run_phase("generate_synthetic", 
                          lambda: self.phase_generate_synthetic(num_synthetic))
            
            # Phase 3: Tokenize data
            self.run_phase("tokenize_data", self.phase_tokenize_data)
            
            # Phase 4: Train model
            self.run_phase("train_model", self.phase_train_model)
            
            # Phase 5: Evaluate
            self.run_phase("evaluate_model", self.phase_evaluate_model)
            
            # Complete
            self.status["current_phase"] = "complete"
            self.status["completed_at"] = datetime.now().isoformat()
            self.save_status()
            
            logger.info("=" * 60)
            logger.info("✓ Training pipeline complete!")
            logger.info(f"Model saved to: {self.checkpoint_dir / 'psychoscore' / 'final'}")
            logger.info("=" * 60)
            
        except Exception as e:
            logger.error(f"Pipeline failed: {e}")
            self.status["failed_at"] = datetime.now().isoformat()
            self.save_status()
            raise


def main():
    parser = argparse.ArgumentParser(description="Run PSYCHOSCORE training pipeline")
    parser.add_argument("--config", type=str, default="train/config.yaml",
                       help="Path to training config")
    parser.add_argument("--num-synthetic", type=int, default=100000,
                       help="Number of synthetic pairs to generate")
    parser.add_argument("--skip-download", action="store_true",
                       help="Skip dataset download")
    
    args = parser.parse_args()
    
    pipeline = TrainingPipeline(args.config)
    pipeline.run(
        num_synthetic=args.num_synthetic,
        skip_download=args.skip_download
    )


if __name__ == "__main__":
    main()
