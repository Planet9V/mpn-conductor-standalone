"""
Tests for MPN Calculus Engine
"""

import pytest
import sys
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.mpn_calculus import MPNCalculus, MPNMetrics, score_dialogue


class TestMPNCalculus:
    """Test suite for core calculus functions"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.calc = MPNCalculus()
    
    def test_trauma_R_increases_with_progress(self):
        """Trauma should increase as we progress through the text"""
        early = self.calc.calculate_trauma_R(10, 100, "Hello there.")
        late = self.calc.calculate_trauma_R(90, 100, "Hello there.")
        
        assert late > early
        assert 0 <= early <= 1
        assert 0 <= late <= 1
    
    def test_trauma_R_increases_with_keywords(self):
        """Trauma should increase when trauma keywords are present"""
        normal = self.calc.calculate_trauma_R(50, 100, "The weather is nice today.")
        trauma = self.calc.calculate_trauma_R(50, 100, "Murder! Death and blood everywhere!")
        
        assert trauma > normal
    
    def test_entropy_H_baseline(self):
        """Baseline entropy should be 0.3 for plain text"""
        H = self.calc.calculate_entropy_H("This is a simple statement")
        assert abs(H - 0.3) < 0.01
    
    def test_entropy_H_increases_with_questions(self):
        """Questions should increase entropy"""
        statement = self.calc.calculate_entropy_H("This is a statement.")
        question = self.calc.calculate_entropy_H("Is this a question?")
        
        assert question > statement
    
    def test_entropy_H_increases_with_exclamations(self):
        """Exclamations should increase entropy"""
        calm = self.calc.calculate_entropy_H("I am calm.")
        excited = self.calc.calculate_entropy_H("I am excited!")
        
        assert excited > calm
    
    def test_baseline_B_degrades(self):
        """Baseline should degrade from 1.0 to 0.0"""
        start = self.calc.calculate_baseline_B(1, 100)
        end = self.calc.calculate_baseline_B(100, 100)
        
        assert start > 0.9
        assert end < 0.1
    
    def test_arrhythmia_same_speaker(self):
        """Same speaker should have low arrhythmia"""
        alpha = self.calc.calculate_arrhythmia_alpha("HAMLET", "HAMLET")
        assert alpha == 0.2
    
    def test_arrhythmia_speaker_switch(self):
        """Speaker switch should have high arrhythmia"""
        alpha = self.calc.calculate_arrhythmia_alpha("HAMLET", "GHOST")
        assert alpha == 0.7
    
    def test_neo_riemannian_low_trauma(self):
        """Low trauma should use R (Relative) operation"""
        op = self.calc.get_neo_riemannian_op(0.1)
        assert op == "R"
    
    def test_neo_riemannian_medium_trauma(self):
        """Medium trauma should use L (Leading-tone) operation"""
        op = self.calc.get_neo_riemannian_op(0.4)
        assert op == "L"
    
    def test_neo_riemannian_high_trauma(self):
        """High trauma should use P (Parallel) operation"""
        op = self.calc.get_neo_riemannian_op(0.7)
        assert op == "P"
    
    def test_neo_riemannian_crisis(self):
        """Crisis trauma should use PLP operation"""
        op = self.calc.get_neo_riemannian_op(0.9)
        assert op == "PLP"
    
    def test_clinical_health_score(self):
        """Health score should be inverse of trauma"""
        low_trauma_health = self.calc.calculate_clinical_health(0.1)
        high_trauma_health = self.calc.calculate_clinical_health(0.9)
        
        assert low_trauma_health == "9/10"
        assert high_trauma_health == "1/10"
    
    def test_score_beat_returns_metrics(self):
        """score_beat should return MPNMetrics object"""
        metrics = self.calc.score_beat(
            beat=1,
            total_beats=100,
            speaker="HAMLET",
            text="To be or not to be, that is the question.",
            prev_speaker=None
        )
        
        assert isinstance(metrics, MPNMetrics)
        assert metrics.beat == 1
        assert metrics.speaker == "HAMLET"


class TestScoreDialogue:
    """Test suite for dialogue scoring convenience function"""
    
    def test_score_simple_dialogue(self):
        """Should score a simple dialogue"""
        dialogue = [
            ("ALICE", "Hello!"),
            ("BOB", "Hi there!"),
            ("ALICE", "How are you?")
        ]
        
        results = score_dialogue(dialogue)
        
        assert len(results) == 3
        assert results[0].speaker == "ALICE"
        assert results[1].speaker == "BOB"
    
    def test_arrhythmia_tracking(self):
        """Should correctly track speaker switches"""
        dialogue = [
            ("A", "Line 1"),
            ("A", "Line 2"),  # Same speaker
            ("B", "Line 3"),  # Switch
        ]
        
        results = score_dialogue(dialogue)
        
        assert results[1].arrhythmia_alpha == 0.2  # Same speaker
        assert results[2].arrhythmia_alpha == 0.7  # Switch


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
