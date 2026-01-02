"""
CSV Generator

Exports MPN scores to CSV format compatible with existing
McKenney-Lacan scoring infrastructure.
"""

import csv
from pathlib import Path
from typing import List, Optional, TextIO, Union
from dataclasses import dataclass

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.mpn_calculus import MPNMetrics


# Standard column headers matching existing CSV format
CSV_HEADERS = [
    'BEAT',
    'SPEAKER', 
    'TEXT',
    'TRAUMA_R',
    'ENTROPY_H',
    'BASELINE_B',
    'ARRHYTHMIA_α',
    'NEO_RIEMANNIAN_OP',
    'CLINICAL_HEALTH_SCORE'
]


def metrics_to_csv_row(metrics: MPNMetrics) -> dict:
    """Convert MPNMetrics to CSV row dictionary."""
    return {
        'BEAT': metrics.beat,
        'SPEAKER': metrics.speaker,
        'TEXT': metrics.text[:200],  # Truncate long text
        'TRAUMA_R': round(metrics.trauma_R, 2),
        'ENTROPY_H': round(metrics.entropy_H, 2),
        'BASELINE_B': round(metrics.baseline_B, 2),
        'ARRHYTHMIA_α': round(metrics.arrhythmia_alpha, 2),
        'NEO_RIEMANNIAN_OP': metrics.neo_riemannian_op,
        'CLINICAL_HEALTH_SCORE': metrics.clinical_health_score
    }


class CSVGenerator:
    """
    Generates CSV files from MPN scores.
    
    Output format matches existing McKenney-Lacan CSV scores
    for compatibility with the Maximus Engine and other tools.
    """
    
    def __init__(self, output_path: Optional[str] = None):
        """
        Initialize generator.
        
        Args:
            output_path: Default output file path
        """
        self.output_path = output_path
        self._writer: Optional[csv.DictWriter] = None
        self._file: Optional[TextIO] = None
    
    def generate(self, 
                 metrics: List[MPNMetrics], 
                 output_path: Optional[str] = None,
                 title: Optional[str] = None) -> str:
        """
        Generate complete CSV file from metrics.
        
        Args:
            metrics: List of MPNMetrics to export
            output_path: Output file path (overrides default)
            title: Optional title for the score
            
        Returns:
            Path to generated file
        """
        path = output_path or self.output_path
        if not path:
            raise ValueError("No output path specified")
        
        with open(path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=CSV_HEADERS)
            writer.writeheader()
            
            for m in metrics:
                writer.writerow(metrics_to_csv_row(m))
        
        return path
    
    def open_stream(self, output_path: str):
        """
        Open a streaming CSV writer for incremental output.
        
        Args:
            output_path: Output file path
        """
        self._file = open(output_path, 'w', newline='', encoding='utf-8')
        self._writer = csv.DictWriter(self._file, fieldnames=CSV_HEADERS)
        self._writer.writeheader()
    
    def write_beat(self, metrics: MPNMetrics):
        """Write a single beat to the stream."""
        if self._writer is None:
            raise RuntimeError("Stream not open. Call open_stream() first.")
        self._writer.writerow(metrics_to_csv_row(metrics))
    
    def close_stream(self):
        """Close the streaming writer."""
        if self._file:
            self._file.close()
            self._file = None
            self._writer = None
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close_stream()


def load_csv_score(filepath: str) -> List[MPNMetrics]:
    """
    Load an existing CSV score back into MPNMetrics objects.
    
    Args:
        filepath: Path to CSV file
        
    Returns:
        List of MPNMetrics
    """
    metrics = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            m = MPNMetrics(
                beat=int(row['BEAT']),
                speaker=row['SPEAKER'],
                text=row['TEXT'],
                trauma_R=float(row['TRAUMA_R']),
                entropy_H=float(row['ENTROPY_H']),
                baseline_B=float(row['BASELINE_B']),
                arrhythmia_alpha=float(row['ARRHYTHMIA_α']),
                neo_riemannian_op=row['NEO_RIEMANNIAN_OP'],
                clinical_health_score=row['CLINICAL_HEALTH_SCORE']
            )
            metrics.append(m)
    
    return metrics


def merge_csv_scores(*filepaths: str, output_path: str) -> str:
    """
    Merge multiple CSV scores into one.
    
    Useful for combining multiple scenes or acts.
    
    Args:
        *filepaths: Paths to CSV files to merge
        output_path: Output path for merged file
        
    Returns:
        Path to merged file
    """
    all_metrics = []
    beat_offset = 0
    
    for filepath in filepaths:
        metrics = load_csv_score(filepath)
        
        # Adjust beat numbers
        for m in metrics:
            m.beat += beat_offset
        
        all_metrics.extend(metrics)
        beat_offset = len(all_metrics)
    
    generator = CSVGenerator()
    return generator.generate(all_metrics, output_path)
