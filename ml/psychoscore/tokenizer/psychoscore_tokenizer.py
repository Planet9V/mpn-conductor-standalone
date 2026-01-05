"""
PSYCHOSCORE Tokenizer
Extended REMI tokenizer with psychometric prefix vocabulary for
mapping DISC/OCEAN/RSI/Dark Triad/Physics to MIDI generation.

Based on MidiTok REMI implementation with custom prefix tokens.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
import json

from miditok import REMI, TokenizerConfig
from miditok.constants import MIDI_INSTRUMENTS
import numpy as np


@dataclass
class PsychometricProfile:
    """Full psychometric profile for PSYCHOSCORE conditioning"""
    
    # DISC Profile (0-1 each)
    disc: Dict[str, float] = field(default_factory=lambda: {
        'D': 0.5, 'I': 0.5, 'S': 0.5, 'C': 0.5
    })
    
    # OCEAN/Big Five (0-1 each)
    ocean: Dict[str, float] = field(default_factory=lambda: {
        'O': 0.5, 'C': 0.5, 'E': 0.5, 'A': 0.5, 'N': 0.5
    })
    
    # Lacanian RSI (must sum to 1.0)
    rsi: Dict[str, float] = field(default_factory=lambda: {
        'real': 0.33, 'symbolic': 0.34, 'imaginary': 0.33
    })
    
    # McKenney-Lacan extensions
    trauma: float = 0.3
    entropy: float = 0.3
    
    # Dark Triad (0-1 each, typically low)
    dark_triad: Dict[str, float] = field(default_factory=lambda: {
        'machiavellianism': 0.1, 'narcissism': 0.1, 'psychopathy': 0.1
    })
    
    # Active cognitive biases (list of bias names)
    cognitive_biases: List[str] = field(default_factory=list)
    
    # Physics framework state
    physics: Dict[str, Any] = field(default_factory=lambda: {
        'hamiltonian_energy': 0.5,
        'ising_spin': '+',
        'granovetter_threshold': 0.5,
        'lyapunov_exponent': 0.0,
    })
    
    # Optional musical context
    key: Optional[str] = None
    mode: Optional[str] = None
    tempo: Optional[int] = None
    
    def validate(self) -> bool:
        """Validate profile constraints"""
        # RSI must sum to ~1.0
        rsi_sum = sum(self.rsi.values())
        if not (0.99 <= rsi_sum <= 1.01):
            return False
        
        # All values in range
        for v in self.disc.values():
            if not (0 <= v <= 1):
                return False
        for v in self.ocean.values():
            if not (0 <= v <= 1):
                return False
        
        return True
    
    def get_rsi_dominant(self) -> str:
        """Get dominant RSI register"""
        return max(self.rsi, key=self.rsi.get)


class PsychoscoreTokenizer(REMI):
    """
    Extended REMI tokenizer with psychometric prefix vocabulary.
    
    Token format:
    [PSYCH_PREFIX (50-100 tokens)] [SEP] [REMI_TOKENS (512-2048 tokens)]
    """
    
    # === PSYCHOMETRIC TOKEN VOCABULARY ===
    
    # DISC tokens (quantized 0.0-1.0 in 0.1 steps)
    DISC_TOKENS = {
        f"DISC_D:{i/10:.1f}": 10000 + i for i in range(11)
    } | {
        f"DISC_I:{i/10:.1f}": 10011 + i for i in range(11)
    } | {
        f"DISC_S:{i/10:.1f}": 10022 + i for i in range(11)
    } | {
        f"DISC_C:{i/10:.1f}": 10033 + i for i in range(11)
    }
    
    # OCEAN tokens
    OCEAN_TOKENS = {
        f"OCEAN_O:{i/10:.1f}": 10100 + i for i in range(11)
    } | {
        f"OCEAN_C:{i/10:.1f}": 10111 + i for i in range(11)
    } | {
        f"OCEAN_E:{i/10:.1f}": 10122 + i for i in range(11)
    } | {
        f"OCEAN_A:{i/10:.1f}": 10133 + i for i in range(11)
    } | {
        f"OCEAN_N:{i/10:.1f}": 10144 + i for i in range(11)
    }
    
    # Lacanian RSI tokens
    RSI_TOKENS = {
        "RSI_REAL_DOM": 10200,
        "RSI_SYMBOLIC_DOM": 10201,
        "RSI_IMAGINARY_DOM": 10202,
    } | {
        f"RSI_R:{i/10:.1f}": 10210 + i for i in range(11)
    } | {
        f"RSI_S:{i/10:.1f}": 10221 + i for i in range(11)
    } | {
        f"RSI_I:{i/10:.1f}": 10232 + i for i in range(11)
    }
    
    # McKenney-Lacan tokens
    MCKENNEY_TOKENS = {
        f"TRAUMA:{i/10:.1f}": 10300 + i for i in range(11)
    } | {
        f"ENTROPY:{i/10:.1f}": 10311 + i for i in range(11)
    }
    
    # Dark Triad tokens
    DARK_TRIAD_TOKENS = {
        f"DARK_MACH:{i/10:.1f}": 10400 + i for i in range(11)
    } | {
        f"DARK_NARC:{i/10:.1f}": 10411 + i for i in range(11)
    } | {
        f"DARK_PSYCH:{i/10:.1f}": 10422 + i for i in range(11)
    }
    
    # Cognitive Bias tokens (30 biases from Kahneman-Tversky)
    BIAS_NAMES = [
        'authority', 'scarcity', 'social_proof', 'confirmation',
        'anchoring', 'availability', 'loss_aversion', 'hindsight',
        'dunning_kruger', 'bandwagon', 'recency', 'halo', 'framing',
        'sunk_cost', 'optimism', 'pessimism', 'groupthink', 'blind_spot',
        'self_serving', 'fundamental_attribution', 'negativity',
        'positivity', 'status_quo', 'attribution', 'projection',
        'actor_observer', 'false_consensus', 'illusion_control',
        'just_world', 'spotlight'
    ]
    BIAS_TOKENS = {
        f"BIAS_{name.upper()}": 10500 + i 
        for i, name in enumerate(BIAS_NAMES)
    }
    
    # Physics Framework tokens
    PHYSICS_TOKENS = {
        f"HAMILTONIAN:{i/10:.1f}": 10600 + i for i in range(11)
    } | {
        "ISING_SPIN_UP": 10611,
        "ISING_SPIN_DOWN": 10612,
    } | {
        f"GRANOVETTER:{i/10:.1f}": 10620 + i for i in range(11)
    } | {
        f"LYAPUNOV:{i/10:.1f}": 10631 + i for i in range(11)
    }
    
    # Musical Context tokens
    KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    MODES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']
    TEMPOS = ['40', '60', '80', '100', '120', '140', '160', '180', '200']
    
    MUSIC_CONTEXT_TOKENS = {
        f"KEY_{k}": 10700 + i for i, k in enumerate(KEYS)
    } | {
        f"MODE_{m}": 10720 + i for i, m in enumerate(MODES)
    } | {
        f"TEMPO_{t}": 10730 + i for i, t in enumerate(TEMPOS)
    }
    
    # Special tokens
    SPECIAL_TOKENS = {
        "PSYCH_START": 10800,
        "PSYCH_END": 10801,
        "SEP": 10802,
    }
    
    # Combined vocabulary
    PSYCH_VOCAB = (
        DISC_TOKENS | OCEAN_TOKENS | RSI_TOKENS | MCKENNEY_TOKENS |
        DARK_TRIAD_TOKENS | BIAS_TOKENS | PHYSICS_TOKENS |
        MUSIC_CONTEXT_TOKENS | SPECIAL_TOKENS
    )
    
    def __init__(self, config: Optional[TokenizerConfig] = None, **kwargs):
        """Initialize with extended vocabulary"""
        if config is None:
            config = TokenizerConfig(
                use_programs=True,
                use_time_signatures=True,
                use_tempos=True,
                use_rests=True,
                num_velocities=32,
                num_tempos=32,
            )
        
        super().__init__(config, **kwargs)
        
        # Extend vocabulary with psychometric tokens
        self._extend_vocab_with_psych_tokens()
    
    def _extend_vocab_with_psych_tokens(self):
        """Add psychometric tokens to the vocabulary"""
        # Add all psychometric tokens to vocab
        for token, idx in self.PSYCH_VOCAB.items():
            if token not in self.vocab:
                self.vocab[token] = idx
        
        # Update inverse vocab
        self._vocab_inv = {v: k for k, v in self.vocab.items()}
    
    @staticmethod
    def quantize(value: float, bins: int = 10) -> float:
        """Quantize a 0-1 value to discrete bins"""
        return round(value * bins) / bins
    
    def encode_psychometric_profile(
        self, 
        profile: PsychometricProfile
    ) -> List[int]:
        """
        Encode a psychometric profile into prefix tokens.
        
        Returns list of token IDs forming the psychometric prefix.
        """
        tokens = []
        
        # Start marker
        tokens.append(self.vocab["PSYCH_START"])
        
        # === DISC ===
        for dim in ['D', 'I', 'S', 'C']:
            q_val = self.quantize(profile.disc[dim])
            token = f"DISC_{dim}:{q_val:.1f}"
            tokens.append(self.vocab[token])
        
        # === OCEAN ===
        for dim in 'OCEAN':
            q_val = self.quantize(profile.ocean[dim])
            token = f"OCEAN_{dim}:{q_val:.1f}"
            tokens.append(self.vocab[token])
        
        # === RSI ===
        # Add dominant register marker
        dominant = profile.get_rsi_dominant()
        tokens.append(self.vocab[f"RSI_{dominant.upper()}_DOM"])
        
        # Add continuous RSI values
        for reg, prefix in [('real', 'R'), ('symbolic', 'S'), ('imaginary', 'I')]:
            q_val = self.quantize(profile.rsi[reg])
            token = f"RSI_{prefix}:{q_val:.1f}"
            tokens.append(self.vocab[token])
        
        # === McKenney-Lacan ===
        tokens.append(self.vocab[f"TRAUMA:{self.quantize(profile.trauma):.1f}"])
        tokens.append(self.vocab[f"ENTROPY:{self.quantize(profile.entropy):.1f}"])
        
        # === Dark Triad ===
        tokens.append(self.vocab[f"DARK_MACH:{self.quantize(profile.dark_triad['machiavellianism']):.1f}"])
        tokens.append(self.vocab[f"DARK_NARC:{self.quantize(profile.dark_triad['narcissism']):.1f}"])
        tokens.append(self.vocab[f"DARK_PSYCH:{self.quantize(profile.dark_triad['psychopathy']):.1f}"])
        
        # === Cognitive Biases (up to 5) ===
        for bias in profile.cognitive_biases[:5]:
            token = f"BIAS_{bias.upper()}"
            if token in self.vocab:
                tokens.append(self.vocab[token])
        
        # === Physics State ===
        h_energy = profile.physics.get('hamiltonian_energy', 0.5)
        tokens.append(self.vocab[f"HAMILTONIAN:{self.quantize(h_energy):.1f}"])
        
        spin = profile.physics.get('ising_spin', '+')
        tokens.append(self.vocab["ISING_SPIN_UP" if spin == '+' else "ISING_SPIN_DOWN"])
        
        granov = profile.physics.get('granovetter_threshold', 0.5)
        tokens.append(self.vocab[f"GRANOVETTER:{self.quantize(granov):.1f}"])
        
        lyap = profile.physics.get('lyapunov_exponent', 0.0)
        lyap_norm = (lyap + 0.5)  # Normalize from [-0.5, 0.5] to [0, 1]
        tokens.append(self.vocab[f"LYAPUNOV:{self.quantize(lyap_norm):.1f}"])
        
        # === Musical Context (optional) ===
        if profile.key:
            tokens.append(self.vocab[f"KEY_{profile.key}"])
        if profile.mode:
            tokens.append(self.vocab[f"MODE_{profile.mode}"])
        if profile.tempo:
            # Find closest tempo bin
            tempo_bins = [40, 60, 80, 100, 120, 140, 160, 180, 200]
            closest = min(tempo_bins, key=lambda x: abs(x - profile.tempo))
            tokens.append(self.vocab[f"TEMPO_{closest}"])
        
        # End marker
        tokens.append(self.vocab["PSYCH_END"])
        
        return tokens
    
    def decode_psychometric_prefix(
        self, 
        tokens: List[int]
    ) -> Tuple[PsychometricProfile, int]:
        """
        Decode psychometric prefix from token sequence.
        
        Returns (profile, end_index) where end_index is position after SEP.
        """
        profile = PsychometricProfile()
        
        end_idx = 0
        for i, tok_id in enumerate(tokens):
            tok = self._vocab_inv.get(tok_id, "")
            
            if tok == "PSYCH_END":
                end_idx = i + 1
                break
            
            # Parse DISC
            if tok.startswith("DISC_"):
                dim, val = tok[5], float(tok.split(":")[1])
                profile.disc[dim] = val
            
            # Parse OCEAN
            elif tok.startswith("OCEAN_"):
                dim, val = tok[6], float(tok.split(":")[1])
                profile.ocean[dim] = val
            
            # Parse RSI
            elif tok.startswith("RSI_R:"):
                profile.rsi['real'] = float(tok.split(":")[1])
            elif tok.startswith("RSI_S:"):
                profile.rsi['symbolic'] = float(tok.split(":")[1])
            elif tok.startswith("RSI_I:"):
                profile.rsi['imaginary'] = float(tok.split(":")[1])
            
            # Parse McKenney-Lacan
            elif tok.startswith("TRAUMA:"):
                profile.trauma = float(tok.split(":")[1])
            elif tok.startswith("ENTROPY:"):
                profile.entropy = float(tok.split(":")[1])
            
            # Parse Dark Triad
            elif tok.startswith("DARK_MACH:"):
                profile.dark_triad['machiavellianism'] = float(tok.split(":")[1])
            elif tok.startswith("DARK_NARC:"):
                profile.dark_triad['narcissism'] = float(tok.split(":")[1])
            elif tok.startswith("DARK_PSYCH:"):
                profile.dark_triad['psychopathy'] = float(tok.split(":")[1])
            
            # Parse biases
            elif tok.startswith("BIAS_"):
                bias_name = tok[5:].lower()
                profile.cognitive_biases.append(bias_name)
            
            # Parse physics
            elif tok.startswith("HAMILTONIAN:"):
                profile.physics['hamiltonian_energy'] = float(tok.split(":")[1])
            elif tok == "ISING_SPIN_UP":
                profile.physics['ising_spin'] = '+'
            elif tok == "ISING_SPIN_DOWN":
                profile.physics['ising_spin'] = '-'
            elif tok.startswith("GRANOVETTER:"):
                profile.physics['granovetter_threshold'] = float(tok.split(":")[1])
            elif tok.startswith("LYAPUNOV:"):
                profile.physics['lyapunov_exponent'] = float(tok.split(":")[1]) - 0.5
            
            # Parse musical context
            elif tok.startswith("KEY_"):
                profile.key = tok[4:]
            elif tok.startswith("MODE_"):
                profile.mode = tok[5:]
            elif tok.startswith("TEMPO_"):
                profile.tempo = int(tok[6:])
        
        return profile, end_idx
    
    def save_pretrained(self, save_directory: str):
        """Save tokenizer to directory"""
        save_path = Path(save_directory)
        save_path.mkdir(parents=True, exist_ok=True)
        
        # Save base REMI config
        super().save_pretrained(save_directory)
        
        # Save psychometric vocab
        psych_vocab_path = save_path / "psych_vocab.json"
        with open(psych_vocab_path, 'w') as f:
            json.dump(self.PSYCH_VOCAB, f, indent=2)
    
    @classmethod
    def from_pretrained(cls, load_directory: str) -> 'PsychoscoreTokenizer':
        """Load tokenizer from directory"""
        load_path = Path(load_directory)
        
        # Load base config
        tokenizer = cls()
        
        # Load psychometric vocab if exists
        psych_vocab_path = load_path / "psych_vocab.json"
        if psych_vocab_path.exists():
            with open(psych_vocab_path, 'r') as f:
                psych_vocab = json.load(f)
                for token, idx in psych_vocab.items():
                    tokenizer.vocab[token] = idx
                tokenizer._vocab_inv = {v: k for k, v in tokenizer.vocab.items()}
        
        return tokenizer


# === CONVENIENCE FUNCTIONS ===

def create_default_tokenizer() -> PsychoscoreTokenizer:
    """Create tokenizer with default configuration"""
    return PsychoscoreTokenizer()


def profile_to_tokens(profile: PsychometricProfile) -> List[int]:
    """Shorthand for encoding a profile"""
    tokenizer = create_default_tokenizer()
    return tokenizer.encode_psychometric_profile(profile)
