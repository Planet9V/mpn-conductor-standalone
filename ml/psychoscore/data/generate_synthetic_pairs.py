"""
Synthetic Psychometric → MIDI Pair Generator
Generates training pairs using MPN theory rules.
"""

import random
import json
import argparse
from dataclasses import dataclass, asdict
from typing import Dict, List, Any, Optional
from pathlib import Path
from tqdm import tqdm

# Add parent to path for imports
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from tokenizer import PsychometricProfile


# === MPN THEORY RULES ===

# Mode selection based on RSI dominant register + trauma
MODE_RULES = {
    ('real', 'low_trauma'): 'Dorian',
    ('real', 'high_trauma'): 'Aeolian',
    ('symbolic', 'low_trauma'): 'Lydian',
    ('symbolic', 'high_trauma'): 'Mixolydian',
    ('imaginary', 'low_trauma'): 'Phrygian',
    ('imaginary', 'high_trauma'): 'Locrian',
}

# Key selection based on OCEAN Openness
# High openness = sharps, Low openness = flats
KEY_MAP = {
    0.0: 'C', 0.1: 'F', 0.2: 'Bb', 0.3: 'Eb',
    0.4: 'Ab', 0.5: 'Db', 0.6: 'Gb', 0.7: 'B',
    0.8: 'E', 0.9: 'A', 1.0: 'D'
}

# Tempo rules based on entropy + DISC
def calculate_tempo(entropy: float, disc_d: float, ocean_e: float) -> int:
    """Calculate tempo from psychometric state"""
    base = 60 + int(entropy * 80)  # 60-140 base
    
    # High Dominance adds energy
    if disc_d > 0.7:
        base += 20
    
    # High Extraversion adds speed
    if ocean_e > 0.7:
        base += 15
    
    return min(200, max(40, base))

# Dynamics rules based on DISC
def calculate_dynamics(disc: Dict[str, float], trauma: float) -> str:
    """Calculate dynamics from DISC profile"""
    d = disc['D']
    
    if trauma > 0.8:
        return 'ff'  # Crisis = loud
    elif d > 0.7:
        return 'f'
    elif d > 0.5:
        return 'mf'
    elif d > 0.3:
        return 'mp'
    else:
        return 'p'

# Instrumentation rules
def select_instruments(
    trauma: float, 
    entropy: float, 
    rsi_dominant: str,
    disc: Dict[str, float]
) -> List[str]:
    """Select instruments based on psychometric state"""
    instruments = []
    
    # RSI register determines base family
    if rsi_dominant == 'real':
        base = ['cello', 'double_bass', 'bassoon']
    elif rsi_dominant == 'symbolic':
        base = ['piano', 'violin', 'clarinet']
    else:  # imaginary
        base = ['celesta', 'harp', 'flute']
    
    instruments.extend(random.sample(base, k=min(2, len(base))))
    
    # High trauma adds brass/percussion
    if trauma > 0.6:
        instruments.append(random.choice(['trumpet', 'french_horn', 'trombone']))
    if trauma > 0.8:
        instruments.append('timpani')
    
    # High entropy adds variety
    if entropy > 0.7:
        instruments.append(random.choice(['oboe', 'english_horn', 'vibraphone']))
    
    # High Dominance adds brass
    if disc['D'] > 0.7:
        if 'trumpet' not in instruments:
            instruments.append('trumpet')
    
    # High Influence adds woodwinds
    if disc['I'] > 0.7:
        instruments.append(random.choice(['flute', 'clarinet', 'oboe']))
    
    return list(set(instruments))[:6]  # Max 6 instruments


@dataclass
class MusicParameters:
    """Musical parameters derived from psychometric profile"""
    key: str
    mode: str
    tempo: int
    dynamics: str
    instruments: List[str]
    time_signature: str = '4/4'
    
    # Additional derived parameters
    articulation: str = 'legato'
    rhythm_complexity: float = 0.5
    harmonic_density: float = 0.5


def profile_to_music_params(profile: PsychometricProfile) -> MusicParameters:
    """
    Map psychometric profile to musical parameters using MPN theory rules.
    """
    # Get RSI dominant and trauma level
    rsi_dominant = profile.get_rsi_dominant()
    trauma_level = 'high_trauma' if profile.trauma > 0.6 else 'low_trauma'
    
    # Mode from RSI + trauma
    mode = MODE_RULES.get((rsi_dominant, trauma_level), 'Ionian')
    
    # Key from OCEAN Openness
    openness_q = round(profile.ocean['O'], 1)
    key = KEY_MAP.get(openness_q, 'C')
    
    # Tempo from entropy + DISC
    tempo = calculate_tempo(
        profile.entropy, 
        profile.disc['D'],
        profile.ocean['E']
    )
    
    # Dynamics from DISC + trauma
    dynamics = calculate_dynamics(profile.disc, profile.trauma)
    
    # Instruments from multiple factors
    instruments = select_instruments(
        profile.trauma,
        profile.entropy,
        rsi_dominant,
        profile.disc
    )
    
    # Articulation from OCEAN Conscientiousness
    if profile.ocean['C'] > 0.7:
        articulation = 'staccato'
    elif profile.ocean['C'] < 0.3:
        articulation = 'legato'
    else:
        articulation = 'normal'
    
    # Rhythm complexity from entropy
    rhythm_complexity = profile.entropy * 0.8 + 0.1
    
    # Harmonic density from OCEAN Openness
    harmonic_density = profile.ocean['O'] * 0.7 + 0.2
    
    return MusicParameters(
        key=key,
        mode=mode,
        tempo=tempo,
        dynamics=dynamics,
        instruments=instruments,
        articulation=articulation,
        rhythm_complexity=rhythm_complexity,
        harmonic_density=harmonic_density,
    )


def generate_random_profile() -> PsychometricProfile:
    """Generate random but coherent psychometric profile"""
    
    # DISC (use beta distribution for realistic values)
    disc = {
        'D': random.betavariate(2, 5),
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
    dark_triad = {
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
        'positivity', 'status_quo', 'attribution', 'projection'
    ]
    active_biases = random.sample(all_biases, k=random.randint(0, 3))
    
    # Physics state
    physics = {
        'hamiltonian_energy': random.random(),
        'ising_spin': random.choice(['+', '-']),
        'granovetter_threshold': random.random(),
        'lyapunov_exponent': random.uniform(-0.5, 0.5),
    }
    
    return PsychometricProfile(
        disc=disc,
        ocean=ocean,
        rsi=rsi,
        trauma=trauma,
        entropy=entropy,
        dark_triad=dark_triad,
        cognitive_biases=active_biases,
        physics=physics,
    )


@dataclass
class TrainingPair:
    """A single training pair: profile + music parameters"""
    profile: PsychometricProfile
    music_params: MusicParameters
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'profile': asdict(self.profile),
            'music_params': asdict(self.music_params),
        }


def generate_training_pairs(num_pairs: int) -> List[TrainingPair]:
    """Generate multiple training pairs"""
    pairs = []
    
    for _ in tqdm(range(num_pairs), desc="Generating pairs"):
        profile = generate_random_profile()
        music_params = profile_to_music_params(profile)
        
        # Add derived context back to profile
        profile.key = music_params.key
        profile.mode = music_params.mode
        profile.tempo = music_params.tempo
        
        pairs.append(TrainingPair(profile=profile, music_params=music_params))
    
    return pairs


def save_pairs(pairs: List[TrainingPair], output_dir: Path):
    """Save training pairs to disk"""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save as JSONL
    jsonl_path = output_dir / "synthetic_pairs.jsonl"
    with open(jsonl_path, 'w') as f:
        for pair in pairs:
            f.write(json.dumps(pair.to_dict()) + '\n')
    
    # Save summary stats
    stats = {
        'num_pairs': len(pairs),
        'mode_distribution': {},
        'key_distribution': {},
        'avg_trauma': sum(p.profile.trauma for p in pairs) / len(pairs),
        'avg_entropy': sum(p.profile.entropy for p in pairs) / len(pairs),
    }
    
    for pair in pairs:
        mode = pair.music_params.mode
        key = pair.music_params.key
        stats['mode_distribution'][mode] = stats['mode_distribution'].get(mode, 0) + 1
        stats['key_distribution'][key] = stats['key_distribution'].get(key, 0) + 1
    
    stats_path = output_dir / "stats.json"
    with open(stats_path, 'w') as f:
        json.dump(stats, f, indent=2)
    
    print(f"Saved {len(pairs)} pairs to {jsonl_path}")
    print(f"Stats saved to {stats_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic training pairs")
    parser.add_argument("--num_pairs", type=int, default=10000, help="Number of pairs to generate")
    parser.add_argument("--output", type=str, default="./data/synthetic", help="Output directory")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    
    args = parser.parse_args()
    
    random.seed(args.seed)
    
    print(f"Generating {args.num_pairs} synthetic psychometric→music pairs...")
    pairs = generate_training_pairs(args.num_pairs)
    
    save_pairs(pairs, Path(args.output))
    
    # Print sample
    print("\n=== Sample Pair ===")
    sample = pairs[0]
    print(f"Trauma: {sample.profile.trauma:.2f}")
    print(f"Entropy: {sample.profile.entropy:.2f}")
    print(f"RSI: R={sample.profile.rsi['real']:.2f}, S={sample.profile.rsi['symbolic']:.2f}, I={sample.profile.rsi['imaginary']:.2f}")
    print(f"→ Mode: {sample.music_params.mode}")
    print(f"→ Key: {sample.music_params.key}")
    print(f"→ Tempo: {sample.music_params.tempo}")
    print(f"→ Dynamics: {sample.music_params.dynamics}")
    print(f"→ Instruments: {sample.music_params.instruments}")


if __name__ == "__main__":
    main()
