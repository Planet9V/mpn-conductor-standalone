"""
SVG Staff Renderer

Renders MPN scores as SVG musical notation for web display.
Creates visual staff notation with Neo-Riemannian annotations.
"""

from pathlib import Path
from typing import List, Optional, Tuple
from dataclasses import dataclass
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    import svgwrite
    from svgwrite import Drawing
    SVG_AVAILABLE = True
except ImportError:
    SVG_AVAILABLE = False
    print("Warning: svgwrite not installed. SVG generation disabled.")

from core.mpn_calculus import MPNMetrics
from core.tonnetz import Chord, ChordQuality, Tonnetz, PITCH_NAMES


# Visual constants
STAFF_LINE_SPACING = 10
STAFF_MARGIN = 50
NOTE_WIDTH = 30
MEASURE_WIDTH = 120
HEADER_HEIGHT = 60

# Note positions (pitch class to staff line offset from middle line)
# Positive = above, Negative = below
PITCH_POSITIONS = {
    0: 0,    # C (middle line in bass, ledger in treble)
    1: 0.5,  # C#
    2: 1,    # D
    3: 1.5,  # D#
    4: 2,    # E
    5: 2.5,  # F
    6: 3,    # F#
    7: 3.5,  # G
    8: 4,    # G#
    9: 4.5,  # A
    10: 5,   # A#
    11: 5.5, # B
}


@dataclass
class StaffConfig:
    """Configuration for staff rendering"""
    width: int = 1200
    height: int = 200
    margin: int = 50
    staff_y: int = 100
    line_spacing: int = 10
    measures_per_line: int = 8


class StaffRenderer:
    """
    Renders MPN scores as SVG staff notation.
    
    Creates visual representation with:
    - Five-line staff
    - Notes positioned by pitch
    - Note heads sized by duration
    - Color coding for trauma level
    - Neo-Riemannian operation labels
    """
    
    def __init__(self, config: Optional[StaffConfig] = None):
        """
        Initialize renderer.
        
        Args:
            config: Staff configuration (uses defaults if None)
        """
        if not SVG_AVAILABLE:
            raise RuntimeError("svgwrite not installed. Run: pip install svgwrite")
        
        self.config = config or StaffConfig()
        self.current_chord = Chord(0, ChordQuality.MAJOR)
    
    def _draw_staff_lines(self, dwg: Drawing, y: int, width: int):
        """Draw the five staff lines."""
        for i in range(-2, 3):  # 5 lines
            line_y = y + (i * self.config.line_spacing)
            dwg.add(dwg.line(
                start=(self.config.margin, line_y),
                end=(width - self.config.margin, line_y),
                stroke='black',
                stroke_width=1
            ))
    
    def _draw_treble_clef(self, dwg: Drawing, x: int, y: int):
        """Draw a simplified treble clef symbol."""
        # Simplified G clef as text
        dwg.add(dwg.text(
            '𝄞',
            insert=(x, y + 15),
            font_size='40px',
            font_family='serif'
        ))
    
    def _trauma_color(self, trauma: float) -> str:
        """Get color based on trauma level."""
        if trauma < 0.3:
            return '#2E7D32'  # Green - healthy
        elif trauma < 0.6:
            return '#F9A825'  # Yellow - stressed
        elif trauma < 0.8:
            return '#E65100'  # Orange - high trauma
        else:
            return '#C62828'  # Red - crisis
    
    def _draw_note(self, 
                   dwg: Drawing, 
                   x: int, 
                   y: int, 
                   metrics: MPNMetrics,
                   pitch_class: int):
        """Draw a single note."""
        # Vertical position from pitch
        position = PITCH_POSITIONS.get(pitch_class, 0)
        note_y = y - (position * self.config.line_spacing / 2)
        
        # Color from trauma
        color = self._trauma_color(metrics.trauma_R)
        
        # Note head (ellipse)
        # Size based on duration (entropy)
        if metrics.entropy_H > 0.7:
            rx, ry = 4, 3  # Small - sixteenth
        elif metrics.entropy_H > 0.5:
            rx, ry = 5, 4  # Medium - eighth
        else:
            rx, ry = 6, 5  # Large - quarter
        
        # Filled or hollow based on duration
        fill = color if metrics.entropy_H > 0.4 else 'none'
        
        dwg.add(dwg.ellipse(
            center=(x, note_y),
            r=(rx, ry),
            fill=fill,
            stroke=color,
            stroke_width=1.5
        ))
        
        # Stem
        stem_height = 35
        dwg.add(dwg.line(
            start=(x + rx, note_y),
            end=(x + rx, note_y - stem_height),
            stroke=color,
            stroke_width=1.5
        ))
        
        # Accidental if needed (C#, D#, etc.)
        if pitch_class in [1, 3, 6, 8, 10]:
            dwg.add(dwg.text(
                '#',
                insert=(x - 15, note_y + 4),
                font_size='12px',
                fill=color
            ))
    
    def _draw_chord(self,
                    dwg: Drawing,
                    x: int,
                    y: int,
                    metrics: MPNMetrics):
        """Draw a chord (multiple notes stacked)."""
        # Get chord from Neo-Riemannian transformation
        new_chord = Tonnetz.apply_operation(self.current_chord, metrics.neo_riemannian_op)
        
        # Draw notes
        for pitch_class in new_chord.pitches:
            self._draw_note(dwg, x, y, metrics, pitch_class)
        
        # Neo-Riemannian operation label
        dwg.add(dwg.text(
            metrics.neo_riemannian_op,
            insert=(x - 5, y - 35),
            font_size='10px',
            font_weight='bold',
            fill='#1565C0'
        ))
        
        # Health score
        dwg.add(dwg.text(
            metrics.clinical_health_score,
            insert=(x - 8, y + 40),
            font_size='8px',
            fill='#666'
        ))
        
        self.current_chord = new_chord
    
    def render(self,
               metrics: List[MPNMetrics],
               output_path: str,
               title: str = "MPN Score") -> str:
        """
        Render complete score as SVG.
        
        Args:
            metrics: List of MPNMetrics
            output_path: Output file path
            title: Score title
            
        Returns:
            Path to generated file
        """
        # Reset state
        self.current_chord = Chord(0, ChordQuality.MAJOR)
        
        # Calculate dimensions
        measures = len(metrics)
        lines_needed = (measures // self.config.measures_per_line) + 1
        height = HEADER_HEIGHT + (lines_needed * 150)
        
        # Create drawing
        dwg = svgwrite.Drawing(
            output_path,
            size=(self.config.width, height),
            profile='full'
        )
        
        # Background
        dwg.add(dwg.rect(
            insert=(0, 0),
            size=(self.config.width, height),
            fill='#FAFAFA'
        ))
        
        # Title
        dwg.add(dwg.text(
            title,
            insert=(self.config.width / 2, 30),
            text_anchor='middle',
            font_size='20px',
            font_weight='bold',
            font_family='serif'
        ))
        
        # Legend
        legend_y = 50
        for trauma, label, color in [
            (0.1, 'Healthy', '#2E7D32'),
            (0.4, 'Stressed', '#F9A825'),
            (0.7, 'High Trauma', '#E65100'),
            (0.9, 'Crisis', '#C62828')
        ]:
            dwg.add(dwg.circle(
                center=(self.config.width - 120, legend_y),
                r=5,
                fill=color
            ))
            dwg.add(dwg.text(
                label,
                insert=(self.config.width - 110, legend_y + 4),
                font_size='10px'
            ))
            legend_y += 15
        
        # Draw staves and notes
        line_y = HEADER_HEIGHT + 50
        measure_idx = 0
        
        while measure_idx < len(metrics):
            # Draw staff lines
            self._draw_staff_lines(dwg, line_y, self.config.width)
            
            # Treble clef
            self._draw_treble_clef(dwg, self.config.margin + 5, line_y)
            
            # Notes for this line
            x = self.config.margin + 60
            for i in range(self.config.measures_per_line):
                if measure_idx >= len(metrics):
                    break
                
                self._draw_chord(dwg, x, line_y, metrics[measure_idx])
                
                # Measure bar line
                x += MEASURE_WIDTH
                dwg.add(dwg.line(
                    start=(x - 30, line_y - 20),
                    end=(x - 30, line_y + 20),
                    stroke='black',
                    stroke_width=1
                ))
                
                measure_idx += 1
            
            line_y += 120
        
        # Save
        dwg.save()
        return output_path


def main():
    """Command-line interface."""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Render MPN score as SVG notation'
    )
    parser.add_argument('input', help='Input CSV score file')
    parser.add_argument('-o', '--output', help='Output SVG file')
    parser.add_argument('--title', default='MPN Score', help='Score title')
    
    args = parser.parse_args()
    
    from output.csv_generator import load_csv_score
    
    print(f"Loading {args.input}...")
    metrics = load_csv_score(args.input)
    
    # Limit for performance
    if len(metrics) > 50:
        print(f"Limiting to first 50 beats (of {len(metrics)})")
        metrics = metrics[:50]
    
    if args.output:
        output_path = args.output
    else:
        input_path = Path(args.input)
        output_path = str(input_path.with_suffix('.svg'))
    
    renderer = StaffRenderer()
    renderer.render(metrics, output_path, title=args.title)
    
    print(f"Generated: {output_path}")


if __name__ == '__main__':
    main()
