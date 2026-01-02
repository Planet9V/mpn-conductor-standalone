"""
DISC-to-Instrument Mapper

Maps DISC personality dimensions to orchestral instrument families.
Each speaker's behavioral profile determines their sonic identity.

D (Dominance) → Brass (commanding, bold)
I (Influence) → Woodwinds (expressive, social)
S (Steadiness) → Strings (stable, warm)
C (Conscientiousness) → Percussion (precise, methodical)
"""

from dataclasses import dataclass
from typing import Optional, Dict, List
from enum import Enum


class DISCDimension(Enum):
    """The four DISC personality dimensions"""
    D = "dominance"      # Bold, direct, results-oriented
    I = "influence"      # Enthusiastic, optimistic, collaborative
    S = "steadiness"     # Patient, reliable, team-oriented
    C = "conscientiousness"  # Analytical, reserved, precise


class InstrumentFamily(Enum):
    """Orchestral instrument families"""
    BRASS = "brass"          # Trumpet, Trombone, French Horn
    WOODWIND = "woodwind"    # Flute, Clarinet, Oboe
    STRINGS = "strings"      # Violin, Viola, Cello
    PERCUSSION = "percussion"  # Timpani, Marimba, Vibraphone


@dataclass
class InstrumentProfile:
    """Complete instrument mapping for a DISC dimension"""
    family: InstrumentFamily
    primary_instrument: str
    alternate_instruments: List[str]
    register: str  # "high", "mid", "low"
    articulation: str  # Default playing style
    clef: str  # Musical notation clef


# The canonical DISC → Instrument mapping
DISC_INSTRUMENT_MAP: Dict[DISCDimension, InstrumentProfile] = {
    DISCDimension.D: InstrumentProfile(
        family=InstrumentFamily.BRASS,
        primary_instrument="trumpet",
        alternate_instruments=["trombone", "french_horn", "tuba"],
        register="high",
        articulation="marcato",  # Strong, emphatic
        clef="treble"
    ),
    DISCDimension.I: InstrumentProfile(
        family=InstrumentFamily.WOODWIND,
        primary_instrument="flute",
        alternate_instruments=["clarinet", "oboe", "saxophone"],
        register="high",
        articulation="legato",  # Smooth, connected
        clef="treble"
    ),
    DISCDimension.S: InstrumentProfile(
        family=InstrumentFamily.STRINGS,
        primary_instrument="cello",
        alternate_instruments=["viola", "violin", "double_bass"],
        register="mid",
        articulation="sostenuto",  # Sustained, full
        clef="bass"
    ),
    DISCDimension.C: InstrumentProfile(
        family=InstrumentFamily.PERCUSSION,
        primary_instrument="timpani",
        alternate_instruments=["marimba", "vibraphone", "xylophone"],
        register="low",
        articulation="staccato",  # Short, precise
        clef="bass"
    )
}


@dataclass
class DISCProfile:
    """A speaker's DISC personality profile (0.0-1.0 for each dimension)"""
    D: float = 0.5  # Dominance
    I: float = 0.5  # Influence
    S: float = 0.5  # Steadiness
    C: float = 0.5  # Conscientiousness
    
    def primary_dimension(self) -> DISCDimension:
        """Return the dominant DISC dimension"""
        scores = {
            DISCDimension.D: self.D,
            DISCDimension.I: self.I,
            DISCDimension.S: self.S,
            DISCDimension.C: self.C
        }
        return max(scores, key=scores.get)
    
    def secondary_dimension(self) -> Optional[DISCDimension]:
        """Return the second-highest DISC dimension"""
        scores = {
            DISCDimension.D: self.D,
            DISCDimension.I: self.I,
            DISCDimension.S: self.S,
            DISCDimension.C: self.C
        }
        sorted_dims = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        if len(sorted_dims) > 1 and sorted_dims[1][1] > 0.3:
            return sorted_dims[1][0]
        return None


class InstrumentMapper:
    """
    Maps speaker DISC profiles to orchestral instruments.
    
    Each speaker in a dialogue is assigned instruments based on
    their personality profile, creating a unique sonic identity.
    """
    
    def __init__(self):
        self.speaker_profiles: Dict[str, DISCProfile] = {}
    
    def set_speaker_profile(self, speaker: str, profile: DISCProfile):
        """Assign a DISC profile to a speaker"""
        self.speaker_profiles[speaker] = profile
    
    def infer_profile_from_text(self, speaker: str, texts: List[str]) -> DISCProfile:
        """
        Infer DISC profile from dialogue patterns.
        
        Uses heuristics based on language patterns:
        - D: Commands, short sentences, decisive language
        - I: Exclamations, questions, social references
        - S: Hedging, inclusive language, calm tone
        - C: Precise language, conditionals, data references
        """
        all_text = " ".join(texts).lower()
        word_count = len(all_text.split())
        
        # D indicators: commands, short declarative statements
        d_score = 0.5
        d_words = ['must', 'will', 'demand', 'order', 'command', 'now', 'immediately']
        d_score += sum(0.05 for w in d_words if w in all_text)
        if word_count > 0 and word_count / len(texts) < 10:  # Short sentences
            d_score += 0.1
        
        # I indicators: social, enthusiastic
        i_score = 0.5
        i_words = ['love', 'friend', 'together', 'wonderful', 'exciting', 'great']
        i_score += sum(0.05 for w in i_words if w in all_text)
        i_score += all_text.count('!') * 0.02  # Exclamations
        
        # S indicators: calm, supportive
        s_score = 0.5
        s_words = ['perhaps', 'maybe', 'we', 'help', 'support', 'together', 'gentle']
        s_score += sum(0.05 for w in s_words if w in all_text)
        
        # C indicators: analytical, precise
        c_score = 0.5
        c_words = ['therefore', 'because', 'however', 'precisely', 'exactly', 'analyze']
        c_score += sum(0.05 for w in c_words if w in all_text)
        c_score += all_text.count('?') * 0.01  # Questions (seeking info)
        
        profile = DISCProfile(
            D=min(1.0, d_score),
            I=min(1.0, i_score),
            S=min(1.0, s_score),
            C=min(1.0, c_score)
        )
        
        self.speaker_profiles[speaker] = profile
        return profile
    
    def get_instrument(self, speaker: str) -> InstrumentProfile:
        """
        Get the instrument assignment for a speaker.
        
        If no profile is set, returns a default balanced profile.
        """
        if speaker not in self.speaker_profiles:
            # Default: balanced profile → Strings (most neutral)
            return DISC_INSTRUMENT_MAP[DISCDimension.S]
        
        profile = self.speaker_profiles[speaker]
        primary_dim = profile.primary_dimension()
        return DISC_INSTRUMENT_MAP[primary_dim]
    
    def get_ensemble(self, speakers: List[str]) -> Dict[str, InstrumentProfile]:
        """
        Get instrument assignments for all speakers in a dialogue.
        
        Ensures variety by assigning alternate instruments when
        multiple speakers share the same primary dimension.
        """
        assignments: Dict[str, InstrumentProfile] = {}
        used_primaries: Dict[InstrumentFamily, int] = {}
        
        for speaker in speakers:
            profile = self.get_instrument(speaker)
            family = profile.family
            
            # Track how many speakers use each family
            used_primaries[family] = used_primaries.get(family, 0) + 1
            
            if used_primaries[family] > 1 and len(profile.alternate_instruments) > 0:
                # Assign alternate instrument
                alt_idx = (used_primaries[family] - 2) % len(profile.alternate_instruments)
                alt_name = profile.alternate_instruments[alt_idx]
                assignments[speaker] = InstrumentProfile(
                    family=profile.family,
                    primary_instrument=alt_name,
                    alternate_instruments=profile.alternate_instruments,
                    register=profile.register,
                    articulation=profile.articulation,
                    clef=profile.clef
                )
            else:
                assignments[speaker] = profile
        
        return assignments
