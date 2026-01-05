"""
PSYCHOSCORE Training Script
QLoRA fine-tuning on RWKV-MIDI for psychometric→MIDI generation.

Usage:
    python train_psychoscore.py --config config.yaml
"""

import os
import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, Any, Optional

import yaml
import torch
from datasets import load_from_disk, Dataset
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
)
from peft import (
    LoraConfig,
    get_peft_model,
    TaskType,
    prepare_model_for_kbit_training,
)
import bitsandbytes as bnb

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))
from tokenizer import PsychoscoreTokenizer

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_config(config_path: str) -> Dict[str, Any]:
    """Load YAML configuration"""
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)


def create_quantization_config(config: Dict):
    """Create BitsAndBytes quantization config"""
    from transformers import BitsAndBytesConfig
    
    q_config = config.get('quantization', {})
    
    return BitsAndBytesConfig(
        load_in_4bit=q_config.get('load_in_4bit', True),
        bnb_4bit_compute_dtype=getattr(torch, q_config.get('bnb_4bit_compute_dtype', 'float16')),
        bnb_4bit_quant_type=q_config.get('bnb_4bit_quant_type', 'nf4'),
        bnb_4bit_use_double_quant=q_config.get('bnb_4bit_use_double_quant', True),
    )


def create_lora_config(config: Dict) -> LoraConfig:
    """Create LoRA configuration"""
    lora_cfg = config.get('lora', {})
    
    return LoraConfig(
        r=lora_cfg.get('r', 32),
        lora_alpha=lora_cfg.get('lora_alpha', 64),
        lora_dropout=lora_cfg.get('lora_dropout', 0.05),
        target_modules=lora_cfg.get('target_modules', [
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj"
        ]),
        bias=lora_cfg.get('bias', 'none'),
        task_type=TaskType.CAUSAL_LM,
    )


def create_training_args(config: Dict) -> TrainingArguments:
    """Create HuggingFace TrainingArguments"""
    train_cfg = config.get('training', {})
    
    return TrainingArguments(
        output_dir=train_cfg.get('output_dir', './checkpoints/psychoscore'),
        
        # Batch size
        per_device_train_batch_size=train_cfg.get('per_device_train_batch_size', 2),
        per_device_eval_batch_size=train_cfg.get('per_device_eval_batch_size', 2),
        gradient_accumulation_steps=train_cfg.get('gradient_accumulation_steps', 16),
        
        # Learning rate
        learning_rate=train_cfg.get('learning_rate', 1e-4),
        lr_scheduler_type=train_cfg.get('lr_scheduler_type', 'cosine'),
        warmup_ratio=train_cfg.get('warmup_ratio', 0.1),
        weight_decay=train_cfg.get('weight_decay', 0.01),
        
        # Duration
        num_train_epochs=train_cfg.get('num_train_epochs', 10),
        max_steps=train_cfg.get('max_steps', -1),
        
        # Memory optimization
        gradient_checkpointing=train_cfg.get('gradient_checkpointing', True),
        fp16=train_cfg.get('fp16', True),
        optim=train_cfg.get('optim', 'paged_adamw_8bit'),
        
        # Logging
        logging_steps=train_cfg.get('logging_steps', 50),
        logging_first_step=train_cfg.get('logging_first_step', True),
        
        # Evaluation
        eval_strategy=train_cfg.get('eval_strategy', 'steps'),
        eval_steps=train_cfg.get('eval_steps', 500),
        
        # Checkpointing
        save_strategy=train_cfg.get('save_strategy', 'steps'),
        save_steps=train_cfg.get('save_steps', 1000),
        save_total_limit=train_cfg.get('save_total_limit', 3),
        
        # Other
        dataloader_num_workers=train_cfg.get('dataloader_num_workers', 4),
        seed=train_cfg.get('seed', 42),
        report_to=train_cfg.get('report_to', 'tensorboard'),
        
        # Required for gradient checkpointing
        ddp_find_unused_parameters=False,
    )


def load_base_model(config: Dict):
    """Load and prepare base model with quantization"""
    model_cfg = config.get('model', {})
    base_model_name = model_cfg.get('base_model', 'brianflakes/rwkv-midi-piano')
    
    logger.info(f"Loading base model: {base_model_name}")
    
    # Create quantization config
    bnb_config = create_quantization_config(config)
    
    # Load model with 4-bit quantization
    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=model_cfg.get('trust_remote_code', True),
    )
    
    # Prepare for k-bit training
    model = prepare_model_for_kbit_training(model)
    
    # Apply LoRA
    lora_config = create_lora_config(config)
    model = get_peft_model(model, lora_config)
    
    # Print trainable parameters
    model.print_trainable_parameters()
    
    return model


def load_dataset(config: Dict) -> tuple:
    """Load tokenized dataset"""
    data_cfg = config.get('data', {})
    
    train_path = data_cfg.get('train_path', './data/tokenized/train')
    val_path = data_cfg.get('val_path', './data/tokenized/val')
    
    logger.info(f"Loading training data from: {train_path}")
    logger.info(f"Loading validation data from: {val_path}")
    
    train_dataset = load_from_disk(train_path)
    val_dataset = load_from_disk(val_path)
    
    return train_dataset, val_dataset


def create_data_collator(tokenizer, config: Dict):
    """Create custom data collator for pre-tokenized data with padding"""
    max_length = config.get('training', {}).get('max_seq_length', 1024)
    pad_token_id = tokenizer.pad_token_id
    
    def collate_fn(features):
        """Custom collate function that properly pads sequences"""
        import torch
        
        # Get max length in batch
        max_len = min(max(len(f['input_ids']) for f in features), max_length)
        
        batch_input_ids = []
        batch_attention_mask = []
        batch_labels = []
        
        for f in features:
            input_ids = f['input_ids'][:max_len]  # Truncate if needed
            labels = f['labels'][:max_len] if 'labels' in f else input_ids
            
            # Pad to max_len
            padding_len = max_len - len(input_ids)
            
            padded_input_ids = input_ids + [pad_token_id] * padding_len
            attention_mask = [1] * len(input_ids) + [0] * padding_len
            padded_labels = labels + [-100] * padding_len  # -100 is ignored in loss
            
            batch_input_ids.append(padded_input_ids)
            batch_attention_mask.append(attention_mask)
            batch_labels.append(padded_labels)
        
        return {
            'input_ids': torch.tensor(batch_input_ids, dtype=torch.long),
            'attention_mask': torch.tensor(batch_attention_mask, dtype=torch.long),
            'labels': torch.tensor(batch_labels, dtype=torch.long),
        }
    
    return collate_fn


def train(config_path: str):
    """Main training function"""
    logger.info(f"Loading config from: {config_path}")
    config = load_config(config_path)
    
    # Load GPT-2 tokenizer for data collation (has pad method)
    model_cfg = config.get('model', {})
    base_model_name = model_cfg.get('base_model', 'openai-community/gpt2')
    logger.info(f"Loading GPT-2 tokenizer from: {base_model_name}")
    
    from transformers import AutoTokenizer
    hf_tokenizer = AutoTokenizer.from_pretrained(base_model_name)
    hf_tokenizer.pad_token = hf_tokenizer.eos_token  # GPT-2 doesn't have pad token
    
    # Load model
    model = load_base_model(config)
    
    # Load dataset
    train_dataset, val_dataset = load_dataset(config)
    
    # Create training arguments
    training_args = create_training_args(config)
    
    # Create data collator using HuggingFace tokenizer
    data_collator = create_data_collator(hf_tokenizer, config)
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        data_collator=data_collator,
    )
    
    # Train
    logger.info("Starting training...")
    trainer.train()
    
    # Save final model
    output_dir = config.get('training', {}).get('output_dir', './checkpoints/psychoscore')
    final_path = Path(output_dir) / 'final'
    
    logger.info(f"Saving final model to: {final_path}")
    trainer.save_model(str(final_path))
    hf_tokenizer.save_pretrained(str(final_path))
    
    logger.info("Training complete!")
    return trainer


def main():
    parser = argparse.ArgumentParser(description="Train PSYCHOSCORE model")
    parser.add_argument(
        "--config", 
        type=str, 
        default="config.yaml",
        help="Path to config YAML file"
    )
    parser.add_argument(
        "--resume",
        type=str,
        default=None,
        help="Path to checkpoint to resume from"
    )
    
    args = parser.parse_args()
    
    # Set environment variables for memory efficiency
    os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "max_split_size_mb:128"
    
    # Check CUDA
    if torch.cuda.is_available():
        logger.info(f"CUDA available: {torch.cuda.get_device_name(0)}")
        logger.info(f"CUDA memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    else:
        logger.warning("CUDA not available, training will be slow!")
    
    train(args.config)


if __name__ == "__main__":
    main()
