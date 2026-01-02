"""
MIDI Generator

Converts MPN scores to MIDI files for audio playback.
Uses Neo-Riemannian chord progressions and dynamics from metrics.
"""

from pathlib import Path
from typing import List, Optional, Tuple
from dataclasses import dataclass

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from midiutil import MIDIFile
    MIDI_AVAILABLE = True
except ImportError:
    MIDI_AVAILABLE = False
    print("Warning: midiutil not installed. MIDI generation disabled.")

from core.mpn_calculus import MPNMetrics
from core.tonnetz import Chord, ChordQuality, Tonnetz


# MIDI General settings
DEFAULT_BPM = 120
DEFAULT_VOLUME = 100
TICKS_PER_BEAT = 480

# Instrument assignments (General MIDI program numbers)
GM_INSTRUMENTS = {
    'piano': 0,
    'cello': 42,
    'violin': 40,
    'viola': 41,
    'trumpet': 56,
    'trombone': 57,
    'french_horn': 60,
    'flute': 73,
    'clarinet': 71,
    'oboe': 68,
    'timpani': 47,
    'strings': 48,  # String ensemble
}


@dataclass
class MIDINote:
    """Represents a single MIDI note event"""
    pitch: int          # MIDI note number (0-127)
    velocity: int       # Volume (0-127)
    start_time: float   # In beats
    duration: float     # In beats
    channel: int = 0    # MIDI channel (0-15)


class MIDIGenerator:
    """
    Generates MIDI files from MPN scores.
    
    Converts trauma levels to harmonic changes via Neo-Riemannian
    operations, and entropy/dynamics to note timing and velocity.
    """
    
    def __init__(self, 
                 bpm: int = DEFAULT_BPM,
                 base_instrument: str = 'strings'):
        """
        Initialize generator.
        
        Args:
            bpm: Tempo in beats per minute
            base_instrument: Default instrument for playback
        """
        if not MIDI_AVAILABLE:
            raise RuntimeError("midiutil not installed. Run: pip install midiutil")
        
        self.bpm = bpm
        self.base_instrument = base_instrument
        self.current_chord = Chord(0, ChordQuality.MAJOR)  # Start at C Major
    
    def metrics_to_notes(self, metrics: List[MPNMetrics]) -> List[MIDINote]:
        """
        Convert MPN metrics to MIDI notes.
        
        Args:
            metrics: List of MPNMetrics from scoring
            
        Returns:
            List of MIDINote objects
        """
        notes: List[MIDINote] = []
        current_time = 0.0
        
        for m in metrics:
            # Apply Neo-Riemannian transformation
            new_chord = Tonnetz.apply_operation(self.current_chord, m.neo_riemannian_op)
            
            # Get chord pitches (MIDI note numbers)
            midi_notes = new_chord.midi_notes
            
            # Calculate velocity from trauma (more trauma = louder)
            base_velocity = 60
            trauma_boost = int(m.trauma_R * 40)  # Add up to 40
            velocity = min(127, base_velocity + trauma_boost)
            
            # Calculate duration from entropy (high entropy = shorter notes)
            base_duration = 1.0  # Quarter note
            if m.entropy_H > 0.7:
                duration = 0.25  # Sixteenth
            elif m.entropy_H > 0.5:
                duration = 0.5   # Eighth
            else:
                duration = base_duration
            
            # Add notes for the chord
            for pitch in midi_notes:
                notes.append(MIDINote(
                    pitch=pitch,
                    velocity=velocity,
                    start_time=current_time,
                    duration=duration,
                    channel=0
                ))
            
            # Advance time
            current_time += duration
            self.current_chord = new_chord
        
        return notes
    
    def generate(self,
                 metrics: List[MPNMetrics],
                 output_path: str,
                 title: str = "MPN Score") -> str:
        """
        Generate complete MIDI file from metrics.
        
        Args:
            metrics: List of MPNMetrics
            output_path: Output file path
            title: Track name
            
        Returns:
            Path to generated file
        """
        # Reset state
        self.current_chord = Chord(0, ChordQuality.MAJOR)
        
        # Create MIDI file
        midi = MIDIFile(1)  # One track
        track = 0
        channel = 0
        time = 0  # Start at beginning
        
        # Set track name and tempo
        midi.addTrackName(track, time, title)
        midi.addTempo(track, time, self.bpm)
        
        # Set instrument
        program = GM_INSTRUMENTS.get(self.base_instrument, 48)
        midi.addProgramChange(track, channel, time, program)
        
        # Convert to notes and add to MIDI
        notes = self.metrics_to_notes(metrics)
        
        for note in notes:
            midi.addNote(
                track=track,
                channel=note.channel,
                pitch=note.pitch,
                time=note.start_time,
                duration=note.duration,
                volume=note.velocity
            )
        
        # Write file
        with open(output_path, 'wb') as f:
            midi.writeFile(f)
        
        return output_path
    
    def generate_progression_only(self,
                                   metrics: List[MPNMetrics],
                                   output_path: str) -> str:
        """
        Generate MIDI with just the chord progression (one chord per beat).
        
        Useful for hearing the harmonic journey without note density.
        """
        self.current_chord = Chord(0, ChordQuality.MAJOR)
        
        midi = MIDIFile(1)
        track = 0
        channel = 0
        
        midi.addTrackName(track, 0, "Chord Progression")
        midi.addTempo(track, 0, self.bpm)
        midi.addProgramChange(track, channel, 0, GM_INSTRUMENTS['piano'])
        
        time = 0.0
        for m in metrics:
            new_chord = Tonnetz.apply_operation(self.current_chord, m.neo_riemannian_op)
            midi_notes = new_chord.midi_notes
            
            # Add whole note chord
            for pitch in midi_notes:
                midi.addNote(track, channel, pitch, time, 4.0, 80)
            
            time += 4.0  # One measure per chord
            self.current_chord = new_chord
        
        with open(output_path, 'wb') as f:
            midi.writeFile(f)
        
        return output_path


def main():
    """Command-line interface."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Generate MIDI from MPN CSV score'
    )
    parser.add_argument('input', help='Input CSV score file')
    parser.add_argument('-o', '--output', help='Output MIDI file')
    parser.add_argument('--bpm', type=int, default=120, help='Tempo')
    parser.add_argument('--progression', action='store_true',
                        help='Generate chord progression only')
    
    args = parser.parse_args()
    
    # Import CSV loader
    from output.csv_generator import load_csv_score
    
    # Load metrics
    print(f"Loading {args.input}...")
    metrics = load_csv_score(args.input)
    
    # Determine output path
    if args.output:
        output_path = args.output
    else:
        input_path = Path(args.input)
        output_path = str(input_path.with_suffix('.mid'))
    
    # Generate
    generator = MIDIGenerator(bpm=args.bpm)
    
    if args.progression:
        generator.generate_progression_only(metrics, output_path)
    else:
        generator.generate(metrics, output_path)
    
    print(f"Generated: {output_path}")


if __name__ == '__main__':
    main()
