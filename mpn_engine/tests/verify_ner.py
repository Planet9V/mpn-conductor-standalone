
import sys
import os
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.mpn_calculus import MPNCalculus

def test_ner_integration():
    print("=== Testing NER Integration ===")
    
    calc = MPNCalculus()
    
    # Test Case 1: Plain text (Control)
    text_control = "Hello, this is a normal conversation."
    score_control = calc.calculate_trauma_R(1, 100, text_control)
    print(f"\n[Control] Text: '{text_control}'")
    print(f"Trauma Score: {score_control}")
    
    # Test Case 2: Psychometric Text
    # "Cognitive Dissonance" should trigger NER extraction for COGNITIVE_BIAS (+0.15)
    text_psycho = "The subject is experiencing severe Cognitive Dissonance regarding the event."
    score_psycho = calc.calculate_trauma_R(1, 100, text_psycho)
    print(f"\n[Test] Text: '{text_psycho}'")
    print(f"Trauma Score: {score_psycho}")
    
    delta = score_psycho - score_control
    print(f"\nDelta (Psychometric - Control): {delta:.4f}")
    
    if delta > 0.1:
        print("\n✅ SUCCESS: NER API correctly influenced the trauma score.")
    else:
        print("\n❌ FAILURE: NER API did not significantly influence the trauma score.")
        print("Check if the NER container is running on port 8000 and the model detects 'Cognitive Dissonance'.")

if __name__ == "__main__":
    test_ner_integration()
