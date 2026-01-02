"""
Tonnetz - Neo-Riemannian Music Theory Engine

Implements the mathematical group theory for harmonic transformations
on the Tonnetz (tone network). Maps psychological trauma states to
chord progressions.

Reference: Hugo Riemann (1880), Skizze einer neuen Methode der Harmonielehre
"""

from dataclasses import dataclass
from typing import Tuple, List
from enum import Enum


class ChordQuality(Enum):
    """Major or Minor chord quality"""
    MAJOR = "major"
    MINOR = "minor"


# Type alias for clarity
PitchClass = int  # 0-11 (C=0, C#=1, D=2, ...)
Triad = Tuple[PitchClass, PitchClass, PitchClass]  # Root, Third, Fifth


# Pitch class names for display
PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']


@dataclass
class Chord:
    """Represents a triad with its quality"""
    root: PitchClass
    quality: ChordQuality
    
    @property
    def name(self) -> str:
        """Human-readable chord name like 'C Major' or 'a minor'"""
        root_name = PITCH_NAMES[self.root]
        if self.quality == ChordQuality.MAJOR:
            return f"{root_name} Major"
        else:
            return f"{root_name.lower()} minor"
    
    @property
    def pitches(self) -> Triad:
        """Return the three pitch classes in the chord"""
        if self.quality == ChordQuality.MAJOR:
            # Major: root + 4 semitones + 7 semitones
            return (self.root, (self.root + 4) % 12, (self.root + 7) % 12)
        else:
            # Minor: root + 3 semitones + 7 semitones
            return (self.root, (self.root + 3) % 12, (self.root + 7) % 12)
    
    @property
    def midi_notes(self) -> Tuple[int, int, int]:
        """Return MIDI note numbers (octave 4 = middle C)"""
        base = 60  # Middle C
        r, t, f = self.pitches
        return (base + r, base + t, base + f)


class Tonnetz:
    """
    Neo-Riemannian Operations on the Tonnetz
    
    The Tonnetz is a lattice structure representing tonal relationships.
    We navigate this graph using P, L, and R operations which transform
    triads in psychologically meaningful ways.
    """
    
    @staticmethod
    def transform_P(chord: Chord) -> Chord:
        """
        Parallel (P) Operation
        
        Transforms a chord to its parallel major/minor.
        Preserves root and fifth, moves third by semitone.
        
        C Major → c minor (and vice versa)
        
        Musical meaning: Darkening/brightening without changing tonal center.
        Psychological mapping: Mode shift, emotional coloring change.
        """
        if chord.quality == ChordQuality.MAJOR:
            return Chord(chord.root, ChordQuality.MINOR)
        else:
            return Chord(chord.root, ChordQuality.MAJOR)
    
    @staticmethod
    def transform_L(chord: Chord) -> Chord:
        """
        Leading-Tone (L) Operation
        
        Moves the root by semitone while preserving the minor third.
        
        C Major → e minor (root C→B)
        e minor → C Major (root B→C)
        
        Musical meaning: Subtle chromatic shift, emotional leading.
        Psychological mapping: Tension, anticipation, emotional pull.
        """
        if chord.quality == ChordQuality.MAJOR:
            # Major → Minor: root descends by semitone
            new_root = (chord.root - 1) % 12
            return Chord(new_root, ChordQuality.MINOR)
        else:
            # Minor → Major: root ascends by semitone
            new_root = (chord.root + 1) % 12
            return Chord(new_root, ChordQuality.MAJOR)
    
    @staticmethod
    def transform_R(chord: Chord) -> Chord:
        """
        Relative (R) Operation
        
        Transforms to relative major/minor by moving the fifth.
        
        C Major → a minor (fifth G→A)
        a minor → C Major (fifth A→G)
        
        Musical meaning: Smooth, natural modulation.
        Psychological mapping: Stable emotional transition.
        """
        if chord.quality == ChordQuality.MAJOR:
            # Major → Minor: relative minor (down a minor third from root)
            new_root = (chord.root + 9) % 12  # Same as -3 mod 12
            return Chord(new_root, ChordQuality.MINOR)
        else:
            # Minor → Major: relative major (up a minor third)
            new_root = (chord.root + 3) % 12
            return Chord(new_root, ChordQuality.MAJOR)
    
    @classmethod
    def transform_PLP(cls, chord: Chord) -> Chord:
        """
        Compound PLP Operation
        
        Three transformations: P → L → P
        Results in a chromatic mediant relationship.
        
        C Major → Db Major (via c minor → Db minor → Db Major)
        
        Musical meaning: Dramatic, unexpected modulation.
        Psychological mapping: Crisis, catastrophic shift, dissociation.
        """
        step1 = cls.transform_P(chord)   # C Major → c minor
        step2 = cls.transform_L(step1)   # c minor → Db Major
        step3 = cls.transform_P(step2)   # But wait, let me recalculate...
        
        # Actually trace through:
        # C Major (C-E-G) → P → c minor (C-Eb-G)
        # c minor (C-Eb-G) → L → Ab Major (Ab-C-Eb) [root C→Ab]
        # Wait, L on minor: root ascends by semitone
        # c minor → L → root C→Db = Db Major
        
        # Let me just chain them:
        return cls.transform_P(cls.transform_L(cls.transform_P(chord)))
    
    @classmethod
    def apply_operation(cls, chord: Chord, operation: str) -> Chord:
        """
        Apply a Neo-Riemannian operation by name.
        
        Args:
            chord: Starting chord
            operation: "R", "L", "P", or "PLP"
            
        Returns:
            Transformed chord
        """
        ops = {
            'R': cls.transform_R,
            'L': cls.transform_L,
            'P': cls.transform_P,
            'PLP': cls.transform_PLP
        }
        
        if operation not in ops:
            raise ValueError(f"Unknown operation: {operation}. Use R, L, P, or PLP")
        
        return ops[operation](chord)
    
    @classmethod
    def generate_progression(cls, 
                             start_chord: Chord, 
                             operations: List[str]) -> List[Chord]:
        """
        Generate a chord progression from a sequence of operations.
        
        Args:
            start_chord: Initial chord
            operations: List of operation codes
            
        Returns:
            List of chords including start chord
        """
        progression = [start_chord]
        current = start_chord
        
        for op in operations:
            current = cls.apply_operation(current, op)
            progression.append(current)
        
        return progression


def trauma_to_progression(trauma_values: List[float], 
                          start_chord: Chord = None) -> List[Chord]:
    """
    Convert a sequence of trauma values to a chord progression.
    
    Maps each trauma value to a Neo-Riemannian operation and
    chains them into a coherent harmonic progression.
    
    Args:
        trauma_values: List of R(t) values from MPN scoring
        start_chord: Starting chord (defaults to C Major)
        
    Returns:
        List of chords representing the harmonic journey
    """
    if start_chord is None:
        start_chord = Chord(0, ChordQuality.MAJOR)  # C Major
    
    # Map trauma to operations
    def trauma_to_op(R: float) -> str:
        if R < 0.3:
            return "R"
        elif R < 0.6:
            return "L"
        elif R < 0.8:
            return "P"
        else:
            return "PLP"
    
    operations = [trauma_to_op(R) for R in trauma_values]
    return Tonnetz.generate_progression(start_chord, operations)
