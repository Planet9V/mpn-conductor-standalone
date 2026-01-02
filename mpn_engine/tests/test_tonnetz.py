"""
Tests for Tonnetz and Neo-Riemannian Operations
"""

import pytest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from core.tonnetz import (
    Chord, ChordQuality, Tonnetz, PITCH_NAMES,
    trauma_to_progression
)


class TestChord:
    """Test suite for Chord class"""
    
    def test_major_chord_pitches(self):
        """C Major should be C-E-G (0-4-7)"""
        chord = Chord(0, ChordQuality.MAJOR)
        assert chord.pitches == (0, 4, 7)
    
    def test_minor_chord_pitches(self):
        """c minor should be C-Eb-G (0-3-7)"""
        chord = Chord(0, ChordQuality.MINOR)
        assert chord.pitches == (0, 3, 7)
    
    def test_chord_name_major(self):
        """Major chord names should be uppercase"""
        chord = Chord(0, ChordQuality.MAJOR)
        assert chord.name == "C Major"
    
    def test_chord_name_minor(self):
        """Minor chord names should be lowercase"""
        chord = Chord(0, ChordQuality.MINOR)
        assert chord.name == "c minor"
    
    def test_midi_notes(self):
        """MIDI notes should be in octave 4"""
        chord = Chord(0, ChordQuality.MAJOR)
        notes = chord.midi_notes
        assert notes[0] == 60  # Middle C


class TestTonnetz:
    """Test suite for Neo-Riemannian operations"""
    
    def test_transform_P_major_to_minor(self):
        """P should transform C Major to c minor"""
        c_major = Chord(0, ChordQuality.MAJOR)
        result = Tonnetz.transform_P(c_major)
        
        assert result.root == 0
        assert result.quality == ChordQuality.MINOR
    
    def test_transform_P_minor_to_major(self):
        """P should transform c minor to C Major"""
        c_minor = Chord(0, ChordQuality.MINOR)
        result = Tonnetz.transform_P(c_minor)
        
        assert result.root == 0
        assert result.quality == ChordQuality.MAJOR
    
    def test_transform_P_is_involution(self):
        """P applied twice should return to original"""
        original = Chord(0, ChordQuality.MAJOR)
        after_pp = Tonnetz.transform_P(Tonnetz.transform_P(original))
        
        assert after_pp.root == original.root
        assert after_pp.quality == original.quality
    
    def test_transform_L_major(self):
        """L on C Major should give result with root descended by semitone"""
        c_major = Chord(0, ChordQuality.MAJOR)
        result = Tonnetz.transform_L(c_major)
        
        assert result.root == 11  # B
        assert result.quality == ChordQuality.MINOR
    
    def test_transform_L_minor(self):
        """L on minor should ascend root by semitone"""
        b_minor = Chord(11, ChordQuality.MINOR)
        result = Tonnetz.transform_L(b_minor)
        
        assert result.root == 0  # C
        assert result.quality == ChordQuality.MAJOR
    
    def test_transform_R_major(self):
        """R on C Major should give a minor (relative minor)"""
        c_major = Chord(0, ChordQuality.MAJOR)
        result = Tonnetz.transform_R(c_major)
        
        assert result.root == 9  # A
        assert result.quality == ChordQuality.MINOR
    
    def test_transform_R_minor(self):
        """R on a minor should give C Major (relative major)"""
        a_minor = Chord(9, ChordQuality.MINOR)
        result = Tonnetz.transform_R(a_minor)
        
        assert result.root == 0  # C
        assert result.quality == ChordQuality.MAJOR
    
    def test_apply_operation_R(self):
        """apply_operation should work with string 'R'"""
        c_major = Chord(0, ChordQuality.MAJOR)
        result = Tonnetz.apply_operation(c_major, 'R')
        
        assert result.root == 9
        assert result.quality == ChordQuality.MINOR
    
    def test_apply_operation_invalid(self):
        """Invalid operation should raise ValueError"""
        c_major = Chord(0, ChordQuality.MAJOR)
        
        with pytest.raises(ValueError):
            Tonnetz.apply_operation(c_major, 'X')
    
    def test_generate_progression(self):
        """Should generate correct chord progression"""
        c_major = Chord(0, ChordQuality.MAJOR)
        progression = Tonnetz.generate_progression(c_major, ['R', 'L', 'P'])
        
        assert len(progression) == 4  # Start + 3 operations
        assert progression[0].name == "C Major"


class TestTraumaToProg:
    """Test trauma to progression mapping"""
    
    def test_low_trauma_uses_R(self):
        """Low trauma values should result in smooth progressions"""
        progression = trauma_to_progression([0.1, 0.1, 0.1])
        
        # All R operations, so we stay in the same key area
        assert len(progression) == 4
    
    def test_high_trauma_uses_PLP(self):
        """High trauma should trigger crisis modulation"""
        progression = trauma_to_progression([0.9])
        
        assert len(progression) == 2


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
