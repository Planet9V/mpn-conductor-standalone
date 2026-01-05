"""
EMOPIA Dataset Loader for PSYCHOSCORE Training

Loads the EMOPIA dataset (Emotion-labeled MIDI performances) and converts
emotion labels to psychometric profiles for training.

EMOPIA Emotion Classes:
- Q1: High Arousal, High Valence (HAHV) - excited, happy
- Q2: High Arousal, Low Valence (HALV) - angry, tense  
- Q3: Low Arousal, High Valence (LAHV) - calm, relaxed
- Q4: Low Arousal, Low Valence (LALV) - sad, depressed

References:
- Hung et al. "EMOPIA: A Multi-Modal Pop Piano Dataset" (ISMIR 2021)
- https://annahung31.github.io/EMOPIA/
"""

import os
import re
import json
import random
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, asdict

try:
    from mido import MidiFile
except ImportError:
    MidiFile = None
    
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# === EMOTION TO PSYCHOMETRIC MAPPING ===

# EMOPIA quadrant mapping to McKenney-Lacan psychometric space
EMOTION_TO_PSYCHOMETRICS = {
    # Q1: High Arousal, High Valence (excited, happy)
    'Q1': {
        'trauma': (0.1, 0.3),      # Low trauma
        'entropy': (0.7, 0.9),     # High entropy (energetic)
        'rsi_weights': {'real': 0.2, 'symbolic': 0.6, 'imaginary': 0.2},
        'disc_bias': {'D': 0.6, 'I': 0.7, 'S': 0.3, 'C': 0.4},
        'ocean_bias': {'O': 0.7, 'C': 0.4, 'E': 0.8, 'A': 0.6, 'N': 0.2},
    },
    # Q2: High Arousal, Low Valence (angry, tense)
    'Q2': {
        'trauma': (0.6, 0.9),      # High trauma
        'entropy': (0.6, 0.8),     # High entropy (chaotic)
        'rsi_weights': {'real': 0.6, 'symbolic': 0.2, 'imaginary': 0.2},
        'disc_bias': {'D': 0.8, 'I': 0.3, 'S': 0.2, 'C': 0.5},
        'ocean_bias': {'O': 0.5, 'C': 0.6, 'E': 0.6, 'A': 0.2, 'N': 0.8},
    },
    # Q3: Low Arousal, High Valence (calm, relaxed)
    'Q3': {
        'trauma': (0.1, 0.3),      # Low trauma
        'entropy': (0.2, 0.4),     # Low entropy (stable)
        'rsi_weights': {'real': 0.3, 'symbolic': 0.5, 'imaginary': 0.2},
        'disc_bias': {'D': 0.3, 'I': 0.5, 'S': 0.7, 'C': 0.5},
        'ocean_bias': {'O': 0.6, 'C': 0.5, 'E': 0.4, 'A': 0.7, 'N': 0.2},
    },
    # Q4: Low Arousal, Low Valence (sad, depressed)
    'Q4': {
        'trauma': (0.7, 0.9),      # High trauma
        'entropy': (0.1, 0.3),     # Low entropy (withdrawn)
        'rsi_weights': {'real': 0.2, 'symbolic': 0.2, 'imaginary': 0.6},
        'disc_bias': {'D': 0.2, 'I': 0.2, 'S': 0.6, 'C': 0.6},
        'ocean_bias': {'O': 0.4, 'C': 0.5, 'E': 0.2, 'A': 0.5, 'N': 0.7},
    },
}


@dataclass
class EmopiaClip:
    """A single EMOPIA MIDI clip with metadata"""
    path: Path
    emotion_class: str  # Q1, Q2, Q3, Q4
    youtube_id: str
    segment_id: str
    quadrant: int  # 1, 2, 3, 4
    
    # Generated psychometric profile
    profile: Optional[Dict[str, Any]] = None
    midi_tokens: Optional[List[int]] = None


def parse_emopia_filename(filename: str) -> Optional[Dict[str, str]]:
    """
    Parse EMOPIA filename to extract emotion class and metadata.
    
    Format: Q{class}_{YouTubeID}_{segID}.mid
    Example: Q1_abc123def456_001.mid
    
    Returns:
        Dict with 'emotion_class', 'youtube_id', 'segment_id'
        or None if parsing fails
    """
    # Pattern: Q followed by digit, underscore, alphanumeric ID, underscore, segment
    pattern = r'^Q([1-4])_([A-Za-z0-9_-]+)_(\d+)\.mid$'
    match = re.match(pattern, filename)
    
    if match:
        return {
            'emotion_class': f'Q{match.group(1)}',
            'quadrant': int(match.group(1)),
            'youtube_id': match.group(2),
            'segment_id': match.group(3),
        }
    return None


def generate_profile_from_emotion(emotion_class: str, seed: Optional[int] = None) -> Dict[str, Any]:
    """
    Generate a psychometric profile from EMOPIA emotion class.
    
    Uses the emotion→psychometric mapping with random variation.
    """
    if seed is not None:
        random.seed(seed)
    
    mapping = EMOTION_TO_PSYCHOMETRICS.get(emotion_class)
    if not mapping:
        raise ValueError(f"Unknown emotion class: {emotion_class}")
    
    # Trauma/entropy from ranges
    trauma = random.uniform(*mapping['trauma'])
    entropy = random.uniform(*mapping['entropy'])
    
    # RSI with variation
    rsi_raw = {
        k: v + random.uniform(-0.1, 0.1) 
        for k, v in mapping['rsi_weights'].items()
    }
    rsi_total = sum(rsi_raw.values())
    rsi = {k: max(0.05, v / rsi_total) for k, v in rsi_raw.items()}
    
    # DISC with variation
    disc = {
        k: max(0.05, min(0.95, v + random.uniform(-0.15, 0.15)))
        for k, v in mapping['disc_bias'].items()
    }
    
    # OCEAN with variation
    ocean = {
        k: max(0.05, min(0.95, v + random.uniform(-0.15, 0.15)))
        for k, v in mapping['ocean_bias'].items()
    }
    
    # Dark Triad (mostly low, varies by quadrant)
    dark_base = 0.1 if emotion_class in ['Q1', 'Q3'] else 0.25
    dark_triad = {
        'machiavellianism': max(0, dark_base + random.uniform(-0.1, 0.1)),
        'narcissism': max(0, dark_base + random.uniform(-0.1, 0.1)),
        'psychopathy': max(0, dark_base * 0.5 + random.uniform(-0.05, 0.05)),
    }
    
    # Cognitive biases (emotion-appropriate)
    bias_pools = {
        'Q1': ['optimism', 'positivity', 'halo', 'bandwagon'],
        'Q2': ['negativity', 'loss_aversion', 'anchoring', 'fundamental_attribution'],
        'Q3': ['status_quo', 'hindsight', 'confirmation', 'availability'],
        'Q4': ['pessimism', 'negativity', 'projection', 'self_serving'],
    }
    active_biases = random.sample(bias_pools.get(emotion_class, []), k=random.randint(0, 2))
    
    return {
        'disc': disc,
        'ocean': ocean,
        'rsi': rsi,
        'trauma': trauma,
        'entropy': entropy,
        'dark_triad': dark_triad,
        'cognitive_biases': active_biases,
        'emotion_source': emotion_class,
    }


def extract_midi_tokens(midi_path: Path, max_tokens: int = 512) -> List[int]:
    """
    Extract token representation from MIDI file.
    
    Uses a simplified tokenization: pitch + velocity + duration buckets.
    In production, would use REMI or Compound Word tokenization.
    """
    if MidiFile is None:
        # Fallback if mido not available: return random tokens
        return [random.randint(0, 511) for _ in range(random.randint(64, max_tokens))]
    
    try:
        midi = MidiFile(str(midi_path))
    except Exception as e:
        logger.warning(f"Failed to load MIDI {midi_path}: {e}")
        return [random.randint(0, 511) for _ in range(random.randint(64, max_tokens))]
    
    tokens = []
    
    for track in midi.tracks:
        for msg in track:
            if msg.type == 'note_on' and msg.velocity > 0:
                # Simple tokenization: pitch (0-127) + velocity bucket (0-3)
                pitch_token = msg.note  # 0-127
                velocity_bucket = min(3, msg.velocity // 32)  # 0-3
                token = pitch_token + velocity_bucket * 128  # 0-511
                tokens.append(token)
                
                if len(tokens) >= max_tokens:
                    break
        if len(tokens) >= max_tokens:
            break
    
    # Pad if too short
    while len(tokens) < 32:
        tokens.append(0)  # Padding token
    
    return tokens[:max_tokens]


class EmopiaDataset:
    """
    EMOPIA dataset loader for PSYCHOSCORE training.
    
    Usage:
        dataset = EmopiaDataset("./data/raw/EMOPIA/EMOPIA_2.2")
        clips = dataset.load_all()
        pairs = dataset.to_training_pairs()
    """
    
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.clips: List[EmopiaClip] = []
        
    def load_all(self) -> List[EmopiaClip]:
        """Load all EMOPIA MIDI files"""
        self.clips = []
        
        if not self.data_dir.exists():
            logger.error(f"EMOPIA directory not found: {self.data_dir}")
            logger.info("Run: bash scripts/download_emopia.sh")
            return []
        
        # Find all MIDI files
        midi_files = list(self.data_dir.rglob("*.mid"))
        midi_files = [f for f in midi_files if not str(f).startswith('__')]
        
        logger.info(f"Found {len(midi_files)} MIDI files in {self.data_dir}")
        
        for midi_path in midi_files:
            metadata = parse_emopia_filename(midi_path.name)
            
            if metadata:
                clip = EmopiaClip(
                    path=midi_path,
                    emotion_class=metadata['emotion_class'],
                    quadrant=metadata['quadrant'],
                    youtube_id=metadata['youtube_id'],
                    segment_id=metadata['segment_id'],
                )
                self.clips.append(clip)
            else:
                logger.debug(f"Skipping non-EMOPIA file: {midi_path.name}")
        
        logger.info(f"Loaded {len(self.clips)} EMOPIA clips")
        self._log_distribution()
        
        return self.clips
    
    def _log_distribution(self):
        """Log emotion class distribution"""
        counts = {}
        for clip in self.clips:
            counts[clip.emotion_class] = counts.get(clip.emotion_class, 0) + 1
        
        logger.info("Emotion distribution:")
        for ec, count in sorted(counts.items()):
            logger.info(f"  {ec}: {count} clips")
    
    def to_training_pairs(self, seed: int = 42) -> List[Dict[str, Any]]:
        """
        Convert EMOPIA clips to PSYCHOSCORE training pairs.
        
        Returns list of dicts with:
        - profile: psychometric profile dict
        - midi_tokens: list of MIDI tokens
        - source: 'emopia'
        - emotion_class: original EMOPIA class
        """
        if not self.clips:
            self.load_all()
        
        pairs = []
        random.seed(seed)
        
        for i, clip in enumerate(self.clips):
            # Generate psychometric profile from emotion
            profile = generate_profile_from_emotion(
                clip.emotion_class, 
                seed=seed + i
            )
            
            # Extract MIDI tokens
            midi_tokens = extract_midi_tokens(clip.path)
            
            # Flatten profile for training
            flat_profile = {
                'disc_d': profile['disc']['D'],
                'disc_i': profile['disc']['I'],
                'disc_s': profile['disc']['S'],
                'disc_c': profile['disc']['C'],
                'ocean_o': profile['ocean']['O'],
                'ocean_c': profile['ocean']['C'],
                'ocean_e': profile['ocean']['E'],
                'ocean_a': profile['ocean']['A'],
                'ocean_n': profile['ocean']['N'],
                'rsi_real': profile['rsi']['real'],
                'rsi_symbolic': profile['rsi']['symbolic'],
                'rsi_imaginary': profile['rsi']['imaginary'],
                'trauma': profile['trauma'],
                'entropy': profile['entropy'],
                'dark_mach': profile['dark_triad']['machiavellianism'],
                'dark_narc': profile['dark_triad']['narcissism'],
                'dark_psych': profile['dark_triad']['psychopathy'],
            }
            
            pairs.append({
                'profile': flat_profile,
                'midi_tokens': midi_tokens,
                'source': 'emopia',
                'emotion_class': clip.emotion_class,
            })
        
        logger.info(f"Generated {len(pairs)} training pairs from EMOPIA")
        return pairs
    
    def save_training_pairs(self, output_path: str):
        """Save training pairs to JSONL file"""
        pairs = self.to_training_pairs()
        
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            for pair in pairs:
                f.write(json.dumps(pair) + '\n')
        
        logger.info(f"Saved {len(pairs)} pairs to {output_path}")
        
        # Save stats
        stats_path = output_path.parent / "emopia_stats.json"
        stats = {
            'total_clips': len(pairs),
            'source': 'EMOPIA_2.2',
            'emotion_distribution': {},
        }
        for pair in pairs:
            ec = pair['emotion_class']
            stats['emotion_distribution'][ec] = stats['emotion_distribution'].get(ec, 0) + 1
        
        with open(stats_path, 'w') as f:
            json.dump(stats, f, indent=2)


def main():
    """CLI for EMOPIA dataset processing"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Process EMOPIA dataset for PSYCHOSCORE")
    parser.add_argument("--data-dir", default="./data/raw/EMOPIA/EMOPIA_2.2", 
                        help="Path to EMOPIA directory")
    parser.add_argument("--output", default="./data/emopia/emopia_pairs.jsonl",
                        help="Output JSONL file")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    
    args = parser.parse_args()
    
    dataset = EmopiaDataset(args.data_dir)
    dataset.load_all()
    dataset.save_training_pairs(args.output)


if __name__ == "__main__":
    main()
