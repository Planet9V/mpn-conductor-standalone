# MPN Engine - Musical Psychometric Notation

A Python application that transforms dialogue and text into musical notation using the McKenney-Lacan Symphonic Calculus.

## Overview

The MPN Engine analyzes text (plays, scripts, conversations) and generates:
- **CSV Score**: Quantified metrics for each dialogue beat
- **MusicXML**: Standard notation format for score rendering
- **MIDI**: Playable audio files
- **SVG Staff**: Visual staff notation

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Analyze a play
python -m text.batch_scorer examples/hamlet.txt --output output/hamlet_score.csv

# Generate MusicXML
python -m output.musicxml_generator output/hamlet_score.csv --output output/hamlet.musicxml

# Generate MIDI
python -m output.midi_generator output/hamlet_score.csv --output output/hamlet.mid
```

## Theory

See [RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md](../mckenney-lacan_theory/RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md) for complete theoretical foundation.

### Core Equation
```
Note(t) = Σ[ DISC_instrument × OCEAN_dynamics × RSI_chord ]
```

### Metrics
| Metric | Symbol | Musical Expression |
|--------|--------|-------------------|
| Trauma (R) | R(t) | Dissonance, accidentals |
| Entropy (H) | H(t) | Rhythmic complexity |
| Baseline (B) | B(t) | Key signature stability |
| Arrhythmia (α) | α(t) | Tempo/speaker changes |

## Directory Structure

```
mpn_engine/
├── core/           # Calculus engine
├── text/           # Text/play analysis
├── output/         # Output generators
├── examples/       # Sample inputs
└── tests/          # Unit tests
```

## License

Part of the AEON Cyber Digital Twin project.
