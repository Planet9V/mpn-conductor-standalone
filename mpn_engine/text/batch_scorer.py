"""
Batch Scorer

Processes complete plays/scripts and generates MPN scores.
Main entry point for text-to-music conversion.
"""

import csv
import json
from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import asdict

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.mpn_calculus import MPNCalculus, MPNMetrics
from core.tonnetz import Chord, ChordQuality, Tonnetz
from core.instrument_mapper import InstrumentMapper, DISCProfile
from core.dynamics_mapper import DynamicsMapper, OceanProfile
from text.dialogue_parser import DialogueParser, DialogueBeat, parse_dialogue


class BatchScorer:
    """
    Batch processor for MPN scoring.
    
    Takes a play/script and generates complete MPN analysis
    including metrics, chord progressions, and ensemble assignments.
    """
    
    def __init__(self):
        self.calculus = MPNCalculus()
        self.instrument_mapper = InstrumentMapper()
        self.dynamics_mapper = DynamicsMapper()
        self.parser = DialogueParser()
    
    def score_file(self, filepath: str) -> List[MPNMetrics]:
        """
        Score a complete play/script file.
        
        Args:
            filepath: Path to the text file
            
        Returns:
            List of MPNMetrics for each beat
        """
        beats = self.parser.parse_file(filepath)
        return self.score_beats(beats)
    
    def score_text(self, text: str) -> List[MPNMetrics]:
        """
        Score raw text.
        
        Args:
            text: Complete play/script text
            
        Returns:
            List of MPNMetrics for each beat
        """
        beats = self.parser.parse_text(text)
        return self.score_beats(beats)
    
    def score_beats(self, beats: List[DialogueBeat]) -> List[MPNMetrics]:
        """
        Score a list of DialogueBeat objects.
        
        Args:
            beats: List of parsed dialogue beats
            
        Returns:
            List of MPNMetrics for each beat
        """
        total = len(beats)
        results: List[MPNMetrics] = []
        prev_speaker: Optional[str] = None
        
        for i, beat in enumerate(beats, 1):
            metrics = self.calculus.score_beat(
                beat=i,
                total_beats=total,
                speaker=beat.speaker,
                text=beat.text,
                prev_speaker=prev_speaker
            )
            results.append(metrics)
            prev_speaker = beat.speaker
        
        return results
    
    def export_csv(self, metrics: List[MPNMetrics], output_path: str):
        """
        Export scored metrics to CSV file.
        
        Args:
            metrics: List of MPNMetrics
            output_path: Path for output CSV
        """
        if not metrics:
            return
        
        fieldnames = [
            'BEAT', 'SPEAKER', 'TEXT',
            'TRAUMA_R', 'ENTROPY_H', 'BASELINE_B', 'ARRHYTHMIA_α',
            'NEO_RIEMANNIAN_OP', 'CLINICAL_HEALTH_SCORE'
        ]
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for m in metrics:
                writer.writerow(m.to_dict())
        
        print(f"Exported {len(metrics)} beats to {output_path}")
    
    def export_json(self, metrics: List[MPNMetrics], output_path: str):
        """
        Export scored metrics to JSON file.
        
        Args:
            metrics: List of MPNMetrics
            output_path: Path for output JSON
        """
        data = {
            'meta': {
                'total_beats': len(metrics),
                'version': '1.0'
            },
            'beats': [m.to_dict() for m in metrics]
        }
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print(f"Exported {len(metrics)} beats to {output_path}")
    
    def generate_chord_progression(self, 
                                    metrics: List[MPNMetrics],
                                    start_chord: Chord = None) -> List[Dict]:
        """
        Generate chord progression from scored metrics.
        
        Args:
            metrics: List of MPNMetrics
            start_chord: Starting chord (default: C Major)
            
        Returns:
            List of chord data dictionaries
        """
        if start_chord is None:
            start_chord = Chord(0, ChordQuality.MAJOR)  # C Major
        
        progression = []
        current_chord = start_chord
        
        for m in metrics:
            # Apply the Neo-Riemannian operation
            new_chord = Tonnetz.apply_operation(current_chord, m.neo_riemannian_op)
            
            progression.append({
                'beat': m.beat,
                'chord': new_chord.name,
                'pitches': new_chord.pitches,
                'midi_notes': new_chord.midi_notes,
                'operation': m.neo_riemannian_op,
                'trauma': m.trauma_R
            })
            
            current_chord = new_chord
        
        return progression
    
    def get_statistics(self, metrics: List[MPNMetrics]) -> Dict:
        """
        Calculate summary statistics for the scored work.
        
        Args:
            metrics: List of MPNMetrics
            
        Returns:
            Dictionary of statistics
        """
        if not metrics:
            return {}
        
        trauma_values = [m.trauma_R for m in metrics]
        entropy_values = [m.entropy_H for m in metrics]
        
        # Count Neo-Riemannian operations
        op_counts = {'R': 0, 'L': 0, 'P': 0, 'PLP': 0}
        for m in metrics:
            op_counts[m.neo_riemannian_op] = op_counts.get(m.neo_riemannian_op, 0) + 1
        
        # Unique speakers
        speakers = set(m.speaker for m in metrics if m.speaker not in ('STAGE', 'SCENE'))
        
        return {
            'total_beats': len(metrics),
            'unique_speakers': len(speakers),
            'speakers': sorted(list(speakers)),
            'trauma': {
                'min': min(trauma_values),
                'max': max(trauma_values),
                'mean': sum(trauma_values) / len(trauma_values),
                'final': trauma_values[-1]
            },
            'entropy': {
                'min': min(entropy_values),
                'max': max(entropy_values),
                'mean': sum(entropy_values) / len(entropy_values)
            },
            'neo_riemannian_ops': op_counts,
            'crisis_beats': len([m for m in metrics if m.neo_riemannian_op == 'PLP'])
        }


def main():
    """Command-line interface for batch scoring."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='MPN Batch Scorer - Convert plays to musical scores'
    )
    parser.add_argument('input', help='Input text file')
    parser.add_argument('-o', '--output', help='Output file path')
    parser.add_argument('-f', '--format', choices=['csv', 'json'], 
                        default='csv', help='Output format')
    parser.add_argument('--stats', action='store_true', 
                        help='Print statistics')
    
    args = parser.parse_args()
    
    # Score the file
    scorer = BatchScorer()
    print(f"Scoring {args.input}...")
    metrics = scorer.score_file(args.input)
    
    # Determine output path
    input_path = Path(args.input)
    if args.output:
        output_path = args.output
    else:
        output_path = str(input_path.parent / f"MCKENNEY_LACAN_SCORE_{input_path.stem.upper()}.{args.format}")
    
    # Export
    if args.format == 'csv':
        scorer.export_csv(metrics, output_path)
    else:
        scorer.export_json(metrics, output_path)
    
    # Print statistics
    if args.stats:
        stats = scorer.get_statistics(metrics)
        print("\n--- Statistics ---")
        print(f"Total Beats: {stats['total_beats']}")
        print(f"Speakers: {', '.join(stats['speakers'][:5])}...")
        print(f"Trauma Range: {stats['trauma']['min']:.2f} - {stats['trauma']['max']:.2f}")
        print(f"Crisis Beats (PLP): {stats['crisis_beats']}")
        print(f"Operations: R={stats['neo_riemannian_ops']['R']}, "
              f"L={stats['neo_riemannian_ops']['L']}, "
              f"P={stats['neo_riemannian_ops']['P']}, "
              f"PLP={stats['neo_riemannian_ops']['PLP']}")


if __name__ == '__main__':
    main()
