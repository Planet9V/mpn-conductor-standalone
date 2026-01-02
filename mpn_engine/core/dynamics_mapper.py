"""
OCEAN-to-Dynamics Mapper

Maps OCEAN (Big Five) personality dimensions to musical dynamics.
These parameters control HOW the notes are played.

O (Openness) → Tempo variation (rubato vs strict)
C (Conscientiousness) → Articulation precision
E (Extraversion) → Volume/dynamics
A (Agreeableness) → Consonance/dissonance  
N (Neuroticism) → Vibrato/tremolo expression
"""

from dataclasses import dataclass
from typing import Dict
from enum import Enum


class OceanDimension(Enum):
    """The Big Five personality dimensions"""
    O = "openness"          # Imaginative, creative
    C = "conscientiousness"  # Organized, dependable
    E = "extraversion"       # Outgoing, energetic
    A = "agreeableness"      # Friendly, compassionate
    N = "neuroticism"        # Sensitive, nervous


@dataclass
class DynamicProfile:
    """Musical dynamics for a single OCEAN dimension"""
    attribute: str
    high_value: str
    low_value: str
    midi_param: str  # MIDI control change parameter


# The canonical OCEAN → Dynamics mapping
OCEAN_DYNAMICS_MAP: Dict[OceanDimension, DynamicProfile] = {
    OceanDimension.O: DynamicProfile(
        attribute="tempo",
        high_value="rubato",      # Flexible, expressive timing
        low_value="strict",       # Metronomic, precise
        midi_param="tempo"
    ),
    OceanDimension.C: DynamicProfile(
        attribute="articulation",
        high_value="precise",     # Clean note attacks
        low_value="loose",        # Blurred, overlapping
        midi_param="attack"
    ),
    OceanDimension.E: DynamicProfile(
        attribute="volume",
        high_value="forte",       # Loud, projecting
        low_value="piano",        # Quiet, intimate
        midi_param="velocity"
    ),
    OceanDimension.A: DynamicProfile(
        attribute="harmony",
        high_value="consonant",   # Thirds, fifths, stable
        low_value="dissonant",    # Tritones, seconds, tense
        midi_param="pitch_bend"
    ),
    OceanDimension.N: DynamicProfile(
        attribute="expression",
        high_value="tremolo",     # Unstable, nervous
        low_value="steady",       # Controlled, calm
        midi_param="modulation"
    )
}


@dataclass
class OceanProfile:
    """A speaker's OCEAN personality profile (0.0-1.0 for each dimension)"""
    O: float = 0.5  # Openness
    C: float = 0.5  # Conscientiousness
    E: float = 0.5  # Extraversion
    A: float = 0.5  # Agreeableness
    N: float = 0.5  # Neuroticism


@dataclass
class MusicalDynamics:
    """Complete musical dynamics for a moment in time"""
    tempo_style: str         # "rubato" or "strict"
    tempo_bpm: int           # Actual BPM
    articulation: str        # "staccato", "legato", etc.
    velocity: int            # MIDI velocity 0-127
    pitch_bend: int          # Cents deviation (-100 to +100)
    modulation: int          # Vibrato depth 0-127
    dynamic_marking: str     # ppp, pp, p, mp, mf, f, ff, fff


class DynamicsMapper:
    """
    Maps OCEAN profiles to musical dynamics.
    
    Transforms personality dimensions into expressive parameters
    that control how notes are rendered in audio or notation.
    """
    
    # Dynamic marking thresholds based on Extraversion
    DYNAMIC_MARKINGS = [
        (0.0, "ppp"),   # Pianississimo
        (0.15, "pp"),   # Pianissimo  
        (0.3, "p"),     # Piano
        (0.45, "mp"),   # Mezzo-piano
        (0.55, "mf"),   # Mezzo-forte
        (0.7, "f"),     # Forte
        (0.85, "ff"),   # Fortissimo
        (0.95, "fff")   # Fortississimo
    ]
    
    def __init__(self, base_bpm: int = 120):
        """
        Initialize with a base tempo.
        
        Args:
            base_bpm: Default tempo in beats per minute
        """
        self.base_bpm = base_bpm
        self.speaker_profiles: Dict[str, OceanProfile] = {}
    
    def set_speaker_profile(self, speaker: str, profile: OceanProfile):
        """Assign an OCEAN profile to a speaker"""
        self.speaker_profiles[speaker] = profile
    
    def get_dynamics(self, 
                     profile: OceanProfile,
                     trauma_R: float = 0.5,
                     entropy_H: float = 0.5) -> MusicalDynamics:
        """
        Calculate musical dynamics from OCEAN profile and MPN metrics.
        
        Args:
            profile: Speaker's OCEAN profile
            trauma_R: Current trauma level (affects dissonance)
            entropy_H: Current entropy level (affects tempo variation)
            
        Returns:
            Complete dynamics specification
        """
        # Tempo: Openness affects style, Entropy affects variation
        tempo_style = "rubato" if profile.O > 0.5 else "strict"
        tempo_variation = int(entropy_H * 20)  # ±20 BPM max
        tempo_bpm = self.base_bpm + (tempo_variation if profile.O > 0.5 else 0)
        
        # Articulation: Conscientiousness
        if profile.C > 0.7:
            articulation = "staccato"  # Very precise
        elif profile.C > 0.5:
            articulation = "tenuto"    # Held, careful
        elif profile.C > 0.3:
            articulation = "legato"    # Smooth
        else:
            articulation = "slur"      # Very loose
        
        # Velocity: Extraversion → Volume
        base_velocity = int(profile.E * 100 + 27)  # Range 27-127
        # Trauma increases intensity
        trauma_boost = int(trauma_R * 20)
        velocity = min(127, base_velocity + trauma_boost)
        
        # Pitch bend: Low Agreeableness → Dissonance
        # Also affected by trauma
        dissonance_factor = (1 - profile.A) * 0.5 + trauma_R * 0.5
        pitch_bend = int(dissonance_factor * 100)  # Cents
        
        # Modulation: Neuroticism → Vibrato/Tremolo
        modulation = int(profile.N * 127)
        
        # Dynamic marking from Extraversion
        dynamic_marking = "mf"  # Default
        for threshold, marking in self.DYNAMIC_MARKINGS:
            if profile.E >= threshold:
                dynamic_marking = marking
        
        return MusicalDynamics(
            tempo_style=tempo_style,
            tempo_bpm=tempo_bpm,
            articulation=articulation,
            velocity=velocity,
            pitch_bend=pitch_bend,
            modulation=modulation,
            dynamic_marking=dynamic_marking
        )
    
    def infer_profile_from_text(self, texts: list[str]) -> OceanProfile:
        """
        Infer OCEAN profile from text patterns.
        
        Uses linguistic markers to estimate personality:
        - O: Variety of vocabulary, metaphors
        - C: Structured sentences, hedging
        - E: Exclamations, social words
        - A: Positive emotion words, inclusivity
        - N: Negative emotion, uncertainty
        """
        all_text = " ".join(texts).lower()
        
        # Openness: vocabulary diversity and creativity markers
        o_words = ['imagine', 'create', 'perhaps', 'wonder', 'dream', 'art']
        o_score = 0.5 + sum(0.05 for w in o_words if w in all_text)
        
        # Conscientiousness: structure and precision
        c_words = ['therefore', 'because', 'should', 'must', 'plan', 'careful']
        c_score = 0.5 + sum(0.05 for w in c_words if w in all_text)
        
        # Extraversion: energy and social engagement
        e_score = 0.5
        e_score += all_text.count('!') * 0.02
        e_words = ['party', 'friend', 'together', 'exciting', 'fun']
        e_score += sum(0.05 for w in e_words if w in all_text)
        
        # Agreeableness: warmth and cooperation
        a_words = ['love', 'kind', 'help', 'please', 'thank', 'sorry', 'care']
        a_score = 0.5 + sum(0.05 for w in a_words if w in all_text)
        
        # Neuroticism: negative affect and anxiety
        n_words = ['fear', 'worry', 'afraid', 'anxious', 'nervous', 'hate', 'angry']
        n_score = 0.5 + sum(0.05 for w in n_words if w in all_text)
        n_score += all_text.count('?') * 0.01  # Uncertainty
        
        return OceanProfile(
            O=min(1.0, o_score),
            C=min(1.0, c_score),
            E=min(1.0, e_score),
            A=min(1.0, a_score),
            N=min(1.0, n_score)
        )
