"""
MusicXML Generator

Converts MPN scores to MusicXML format for notation software.
Produces standard musical notation viewable in MuseScore, Finale, etc.
"""

from pathlib import Path
from typing import List, Optional, Dict
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

from core.mpn_calculus import MPNMetrics
from core.tonnetz import Chord, ChordQuality, Tonnetz, PITCH_NAMES


# MusicXML note name mapping
PITCH_TO_MUSICXML = {
    0: ('C', 0),   # C
    1: ('C', 1),   # C#
    2: ('D', 0),   # D
    3: ('D', 1),   # D#/Eb
    4: ('E', 0),   # E
    5: ('F', 0),   # F
    6: ('F', 1),   # F#
    7: ('G', 0),   # G
    8: ('G', 1),   # G#
    9: ('A', 0),   # A
    10: ('A', 1),  # A#/Bb
    11: ('B', 0),  # B
}

# Duration type mapping
DURATION_TYPES = {
    4.0: 'whole',
    2.0: 'half',
    1.0: 'quarter',
    0.5: 'eighth',
    0.25: '16th',
    0.125: '32nd'
}


class MusicXMLGenerator:
    """
    Generates MusicXML files from MPN scores.
    
    Creates standard notation with:
    - Notes derived from Neo-Riemannian chord progressions
    - Dynamics based on trauma/entropy
    - Annotations for MPN metrics
    """
    
    def __init__(self, title: str = "MPN Score"):
        """
        Initialize generator.
        
        Args:
            title: Score title
        """
        self.title = title
        self.current_chord = Chord(0, ChordQuality.MAJOR)
        self.divisions = 4  # Divisions per quarter note
    
    def create_score_partwise(self) -> Element:
        """Create the root score-partwise element."""
        root = Element('score-partwise', version='4.0')
        
        # Work title
        work = SubElement(root, 'work')
        SubElement(work, 'work-title').text = self.title
        
        # Part list
        part_list = SubElement(root, 'part-list')
        score_part = SubElement(part_list, 'score-part', id='P1')
        SubElement(score_part, 'part-name').text = 'MPN Voice'
        
        return root
    
    def create_measure(self, 
                       number: int, 
                       metrics: MPNMetrics,
                       include_attributes: bool = False) -> Element:
        """
        Create a measure element from MPN metrics.
        
        Args:
            number: Measure number
            metrics: MPN metrics for this measure
            include_attributes: Include clef, key, time signature
        """
        measure = Element('measure', number=str(number))
        
        # First measure includes attributes
        if include_attributes:
            attributes = SubElement(measure, 'attributes')
            SubElement(attributes, 'divisions').text = str(self.divisions)
            
            # Key signature (changes with trauma)
            key = SubElement(attributes, 'key')
            fifths = int((1 - metrics.trauma_R) * 7) - 3  # -3 to +4
            SubElement(key, 'fifths').text = str(max(-7, min(7, fifths)))
            SubElement(key, 'mode').text = 'major' if metrics.trauma_R < 0.5 else 'minor'
            
            # Time signature
            time = SubElement(attributes, 'time')
            SubElement(time, 'beats').text = '4'
            SubElement(time, 'beat-type').text = '4'
            
            # Clef
            clef = SubElement(attributes, 'clef')
            SubElement(clef, 'sign').text = 'G'
            SubElement(clef, 'line').text = '2'
        
        # Direction for dynamics
        direction = SubElement(measure, 'direction', placement='below')
        direction_type = SubElement(direction, 'direction-type')
        dynamics = SubElement(direction_type, 'dynamics')
        
        # Dynamic marking from trauma
        if metrics.trauma_R < 0.3:
            SubElement(dynamics, 'p')
        elif metrics.trauma_R < 0.6:
            SubElement(dynamics, 'mf')
        elif metrics.trauma_R < 0.8:
            SubElement(dynamics, 'f')
        else:
            SubElement(dynamics, 'ff')
        
        # Apply Neo-Riemannian transformation
        new_chord = Tonnetz.apply_operation(self.current_chord, metrics.neo_riemannian_op)
        
        # Create notes for chord
        pitches = new_chord.pitches
        for i, pitch_class in enumerate(pitches):
            note = SubElement(measure, 'note')
            
            # Chord notation (not first note)
            if i > 0:
                SubElement(note, 'chord')
            
            # Pitch
            pitch = SubElement(note, 'pitch')
            step, alter = PITCH_TO_MUSICXML[pitch_class]
            SubElement(pitch, 'step').text = step
            if alter != 0:
                SubElement(pitch, 'alter').text = str(alter)
            SubElement(pitch, 'octave').text = '4'  # Middle octave
            
            # Duration based on entropy
            if metrics.entropy_H > 0.7:
                duration = 1  # Eighth
                note_type = 'eighth'
            elif metrics.entropy_H > 0.5:
                duration = 2  # Quarter
                note_type = 'quarter'
            else:
                duration = 4  # Half
                note_type = 'half'
            
            SubElement(note, 'duration').text = str(duration)
            SubElement(note, 'type').text = note_type
        
        # Lyric with speaker and text excerpt
        note = measure.find('note')
        if note is not None:
            lyric = SubElement(note, 'lyric', number='1')
            SubElement(lyric, 'syllabic').text = 'single'
            text = metrics.text[:30] + '...' if len(metrics.text) > 30 else metrics.text
            SubElement(lyric, 'text').text = f"{metrics.speaker}: {text}"
        
        self.current_chord = new_chord
        return measure
    
    def generate(self,
                 metrics: List[MPNMetrics],
                 output_path: str) -> str:
        """
        Generate complete MusicXML file.
        
        Args:
            metrics: List of MPNMetrics
            output_path: Output file path
            
        Returns:
            Path to generated file
        """
        # Reset state
        self.current_chord = Chord(0, ChordQuality.MAJOR)
        
        # Create document
        root = self.create_score_partwise()
        part = SubElement(root, 'part', id='P1')
        
        # Create measures
        for i, m in enumerate(metrics, 1):
            measure = self.create_measure(i, m, include_attributes=(i == 1))
            part.append(measure)
        
        # Pretty print
        rough = tostring(root, encoding='unicode')
        pretty = minidom.parseString(rough).toprettyxml(indent='  ')
        
        # Add doctype
        doctype = '''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
'''
        # Remove XML declaration from pretty print (we add our own with doctype)
        pretty_lines = pretty.split('\n')[1:]
        content = doctype + '\n'.join(pretty_lines)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return output_path


def main():
    """Command-line interface."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Generate MusicXML from MPN CSV score'
    )
    parser.add_argument('input', help='Input CSV score file')
    parser.add_argument('-o', '--output', help='Output MusicXML file')
    parser.add_argument('--title', default='MPN Score', help='Score title')
    
    args = parser.parse_args()
    
    # Import CSV loader
    from output.csv_generator import load_csv_score
    
    print(f"Loading {args.input}...")
    metrics = load_csv_score(args.input)
    
    # Limit to first 50 measures for performance
    if len(metrics) > 50:
        print(f"Limiting to first 50 beats (of {len(metrics)})")
        metrics = metrics[:50]
    
    if args.output:
        output_path = args.output
    else:
        input_path = Path(args.input)
        output_path = str(input_path.with_suffix('.musicxml'))
    
    generator = MusicXMLGenerator(title=args.title)
    generator.generate(metrics, output_path)
    
    print(f"Generated: {output_path}")


if __name__ == '__main__':
    main()
