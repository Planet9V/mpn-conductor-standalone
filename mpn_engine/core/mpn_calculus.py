"""
McKenney-Lacan Psychometric Calculus Engine

Core implementation of the Symphonic Calculus metrics:
- Trauma (R): Riemann Curvature
- Entropy (H): Shannon Entropy  
- Baseline (B): Structural Integrity
- Arrhythmia (α): Rhythm Disruption
"""

from dataclasses import dataclass
from typing import Optional
import re
from .ner_client import NerClient


@dataclass
class MPNMetrics:
    """Container for all MPN calculus metrics for a single beat"""
    beat: int
    speaker: str
    text: str
    trauma_R: float
    entropy_H: float
    baseline_B: float
    arrhythmia_alpha: float
    neo_riemannian_op: str
    clinical_health_score: str
    
    def to_dict(self) -> dict:
        return {
            'BEAT': self.beat,
            'SPEAKER': self.speaker,
            'TEXT': self.text[:200],  # Truncate for CSV
            'TRAUMA_R': round(self.trauma_R, 2),
            'ENTROPY_H': round(self.entropy_H, 2),
            'BASELINE_B': round(self.baseline_B, 2),
            'ARRHYTHMIA_α': round(self.arrhythmia_alpha, 2),
            'NEO_RIEMANNIAN_OP': self.neo_riemannian_op,
            'CLINICAL_HEALTH_SCORE': self.clinical_health_score
        }


class MPNCalculus:
    """
    McKenney-Lacan Calculus Engine
    
    Calculates psychometric metrics for dramatic dialogue, mapping
    psychological states to musical parameters.
    
    Theory Reference: RSCH-39-MUSICAL_PSYCHOMETRIC_NOTATION.md
    """
    
    # Trauma-inducing keywords (weighted by severity)
    TRAUMA_KEYWORDS = {
        # Severity 1.0 - Death/Violence
        'death': 1.0, 'kill': 1.0, 'murder': 1.0, 'die': 1.0, 'dead': 1.0,
        'blood': 0.9, 'slaughter': 1.0, 'execution': 1.0,
        # Severity 0.8 - Psychological
        'revenge': 0.8, 'mad': 0.8, 'insane': 0.8, 'cursed': 0.8,
        'despair': 0.8, 'doom': 0.8, 'damned': 0.8,
        # Severity 0.6 - Emotional distress
        'hate': 0.6, 'fear': 0.6, 'terror': 0.6, 'horror': 0.6,
        'betray': 0.6, 'treachery': 0.6, 'poison': 0.7,
        # Severity 0.4 - Mild distress
        'grief': 0.4, 'sorrow': 0.4, 'pain': 0.4, 'suffer': 0.4,
        'weep': 0.3, 'cry': 0.3, 'tears': 0.3
    }

    # NER Label Weights for Psychometric Impact
    NER_TRAUMA_WEIGHTS = {
        'COGNITIVE_BIAS': 0.15,
        'THREAT_PERCEPTION': 0.25,
        'LACANIAN': 0.20,
        'PERSONALITY': 0.10,   # Assuming negative context or volatility
        'IMPACT': 0.15,
        'HAZARD_ANALYSIS': 0.15,
        'THREAT_MODELING': 0.20
    }
    
    def __init__(self, 
                 base_trauma: float = 0.0,
                 trauma_progress_weight: float = 0.8,
                 trauma_keyword_weight: float = 0.1):
        """
        Initialize calculus engine with configurable parameters.
        
        Args:
            base_trauma: Starting trauma level (0.0-1.0)
            trauma_progress_weight: How much narrative progress affects trauma
            trauma_keyword_weight: Weight per trauma keyword detected
        """
        self.base_trauma = base_trauma
        self.trauma_progress_weight = trauma_progress_weight
        self.trauma_keyword_weight = trauma_keyword_weight
        self.ner_client = NerClient()
    
    def calculate_trauma_R(self, beat: int, total_beats: int, text: str) -> float:
        """
        Riemann Curvature - Measures psychological "warping" from trauma.
        
        The trauma score increases naturally through the narrative arc
        and spikes when trauma keywords are detected.
        
        Args:
            beat: Current beat number (1-indexed)
            total_beats: Total beats in the work
            text: Dialogue text for this beat
            
        Returns:
            Trauma score 0.0-1.0+ (can exceed 1.0 in extreme cases)
        """
        # Progress through narrative (tragedy builds toward climax)
        progress = beat / max(total_beats, 1)
        base_R = self.base_trauma + (progress * self.trauma_progress_weight)
        
        # Detect trauma keywords with weighted scoring
        text_lower = text.lower()
        trauma_score = 0.0
        for word, weight in self.TRAUMA_KEYWORDS.items():
            # Count occurrences
            count = len(re.findall(rf'\b{word}\w*\b', text_lower))
            trauma_score += count * weight * self.trauma_keyword_weight
            
        # Add NER-based psychometric impact
        ner_entities = self.ner_client.analyze_text(text)
        for entity in ner_entities:
            if entity.label in self.NER_TRAUMA_WEIGHTS:
                # Add weight directly for each found entity
                trauma_score += self.NER_TRAUMA_WEIGHTS[entity.label]
        
        R = base_R + trauma_score
        return min(1.0, max(0.0, R))  # Clamp to [0, 1]
    
    def calculate_entropy_H(self, text: str) -> float:
        """
        Shannon Entropy - Measures disorder/chaos in communication.
        
        High entropy indicates fragmented, uncertain, or agitated speech.
        
        Args:
            text: Dialogue text
            
        Returns:
            Entropy score 0.0-1.0+
        """
        base_H = 0.3  # Baseline communication noise
        
        # Questions indicate uncertainty
        question_count = text.count('?')
        # Exclamations indicate agitation
        exclamation_count = text.count('!')
        # Interruptions (dashes, ellipses) indicate fragmentation
        interruption_count = text.count('--') + text.count('...')
        # Multiple punctuation indicates extreme emotion
        multi_punct = len(re.findall(r'[?!]{2,}', text))
        
        H = base_H + (
            question_count * 0.2 +
            exclamation_count * 0.15 +
            interruption_count * 0.1 +
            multi_punct * 0.25
        )
        
        return min(1.0, max(0.0, H))
    
    def calculate_baseline_B(self, beat: int, total_beats: int) -> float:
        """
        Structural Integrity - Order collapse over narrative arc.
        
        Baseline starts at 1.0 (intact world) and degrades toward 0.0
        as the tragedy progresses.
        
        Args:
            beat: Current beat number
            total_beats: Total beats in work
            
        Returns:
            Baseline score 1.0→0.0
        """
        return max(0.0, 1.0 - (beat / max(total_beats, 1)))
    
    def calculate_arrhythmia_alpha(self, 
                                   speaker: str, 
                                   prev_speaker: Optional[str]) -> float:
        """
        Dialogue Rhythm Disruption - Measures conversational flow breaks.
        
        Same speaker continuing = smooth (low α)
        Speaker switch = rhythm break (high α)
        
        Args:
            speaker: Current speaker
            prev_speaker: Previous speaker (None if first beat)
            
        Returns:
            Arrhythmia score 0.2-0.7
        """
        if prev_speaker is None:
            return 0.5  # First beat - neutral
        elif speaker.upper() == prev_speaker.upper():
            return 0.2  # Same speaker - smooth continuation
        else:
            return 0.7  # Speaker switch - rhythm break
    
    def get_neo_riemannian_op(self, trauma_R: float) -> str:
        """
        Determine Neo-Riemannian harmonic transformation based on trauma.
        
        Maps trauma levels to chord transformations on the Tonnetz:
        - R (Relative): Smooth transition (C Major → a minor)
        - L (Leading-Tone): Emotional shift (C Major → e minor)
        - P (Parallel): Darkening (C Major → c minor)
        - PLP (Compound): Crisis modulation (C Major → Db Major)
        
        Args:
            trauma_R: Current trauma score
            
        Returns:
            Operation code: "R", "L", "P", or "PLP"
        """
        if trauma_R < 0.3:
            return "R"   # Relative - calm, stable
        elif trauma_R < 0.6:
            return "L"   # Leading-tone - emotional tension
        elif trauma_R < 0.8:
            return "P"   # Parallel - darkness, minor mode
        else:
            return "PLP"  # Compound - catastrophic shift
    
    def calculate_clinical_health(self, trauma_R: float) -> str:
        """
        Clinical Health Score - Inverse of trauma, scaled 0-10.
        
        10/10 = Symphonic, healthy
        7/10 = Stressed but functional
        3/10 = Toxic, critical
        0/10 = Death, void
        
        Args:
            trauma_R: Current trauma score
            
        Returns:
            Health string like "8/10"
        """
        health = int((1.0 - min(1.0, trauma_R)) * 10)
        return f"{health}/10"
    
    def score_beat(self, 
                   beat: int, 
                   total_beats: int,
                   speaker: str,
                   text: str,
                   prev_speaker: Optional[str] = None) -> MPNMetrics:
        """
        Calculate all MPN metrics for a single dialogue beat.
        
        Args:
            beat: Current beat number (1-indexed)
            total_beats: Total beats in work
            speaker: Speaker name
            text: Dialogue text
            prev_speaker: Previous speaker for arrhythmia calculation
            
        Returns:
            MPNMetrics dataclass with all calculated values
        """
        trauma_R = self.calculate_trauma_R(beat, total_beats, text)
        entropy_H = self.calculate_entropy_H(text)
        baseline_B = self.calculate_baseline_B(beat, total_beats)
        arrhythmia_alpha = self.calculate_arrhythmia_alpha(speaker, prev_speaker)
        neo_op = self.get_neo_riemannian_op(trauma_R)
        health = self.calculate_clinical_health(trauma_R)
        
        return MPNMetrics(
            beat=beat,
            speaker=speaker,
            text=text,
            trauma_R=trauma_R,
            entropy_H=entropy_H,
            baseline_B=baseline_B,
            arrhythmia_alpha=arrhythmia_alpha,
            neo_riemannian_op=neo_op,
            clinical_health_score=health
        )


# Convenience function for quick scoring
def score_dialogue(dialogue: list[tuple[str, str]]) -> list[MPNMetrics]:
    """
    Score a complete dialogue sequence.
    
    Args:
        dialogue: List of (speaker, text) tuples
        
    Returns:
        List of MPNMetrics for each beat
    """
    calc = MPNCalculus()
    total = len(dialogue)
    results = []
    prev_speaker = None
    
    for i, (speaker, text) in enumerate(dialogue, 1):
        metrics = calc.score_beat(i, total, speaker, text, prev_speaker)
        results.append(metrics)
        prev_speaker = speaker
    
    return results
