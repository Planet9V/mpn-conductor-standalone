"""
PSYCHOSCORE Inference Server Tests (Live Server)

Pytest tests for the PSYCHOSCORE inference server using HTTP requests.
These tests require a running PSYCHOSCORE inference server.

Run with: pytest tests/test_server_live.py -v
"""

import pytest
import json
import base64
import requests
import time
from pathlib import Path

# Server endpoint
SERVER_URL = "http://localhost:8001"


def server_available():
    """Check if server is available"""
    try:
        resp = requests.get(f"{SERVER_URL}/health", timeout=5)
        return resp.status_code == 200
    except:
        return False


# Skip all tests if server is not available
pytestmark = pytest.mark.skipif(
    not server_available(),
    reason=f"PSYCHOSCORE server not available at {SERVER_URL}"
)


# === FIXTURES ===

@pytest.fixture
def sample_profile():
    """Sample psychometric profile for testing"""
    return {
        "disc": {"D": 0.8, "I": 0.3, "S": 0.2, "C": 0.5},
        "ocean": {"O": 0.7, "C": 0.4, "E": 0.6, "A": 0.5, "N": 0.3},
        "rsi": {"real": 0.5, "symbolic": 0.3, "imaginary": 0.2},
        "trauma": 0.7,
        "entropy": 0.5,
        "max_bars": 8,
        "temperature": 0.8,
        "top_p": 0.9
    }


@pytest.fixture
def high_trauma_profile():
    """High trauma profile for edge case testing"""
    return {
        "rsi": {"real": 0.8, "symbolic": 0.1, "imaginary": 0.1},
        "trauma": 0.95,
        "entropy": 0.9,
        "dark_triad": {
            "machiavellianism": 0.8,
            "narcissism": 0.7,
            "psychopathy": 0.6
        },
        "max_bars": 4
    }


@pytest.fixture  
def minimal_profile():
    """Minimal valid profile"""
    return {"max_bars": 4}


# === HEALTH CHECK TESTS ===

class TestHealthCheck:
    """Tests for /health endpoint"""
    
    def test_health_check_returns_ok(self):
        """Health endpoint should return 200"""
        response = requests.get(f"{SERVER_URL}/health")
        assert response.status_code == 200
    
    def test_health_check_has_required_fields(self):
        """Health response should have status, model_loaded, device"""
        response = requests.get(f"{SERVER_URL}/health")
        data = response.json()
        
        assert "status" in data
        assert "model_loaded" in data
        assert "device" in data
    
    def test_health_check_status_healthy(self):
        """Status should be 'healthy'"""
        response = requests.get(f"{SERVER_URL}/health")
        data = response.json()
        
        assert data["status"] == "healthy"
        assert data["model_loaded"] == True


# === GENERATE ENDPOINT TESTS ===

class TestGenerateEndpoint:
    """Tests for /generate endpoint"""
    
    def test_generate_with_full_profile(self, sample_profile):
        """Generate endpoint should accept full profile"""
        response = requests.post(
            f"{SERVER_URL}/generate",
            json=sample_profile
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "success" in data
        assert data["success"] == True
    
    def test_generate_returns_midi_base64(self, sample_profile):
        """Successful generation should return base64 MIDI"""
        response = requests.post(
            f"{SERVER_URL}/generate",
            json=sample_profile
        )
        data = response.json()
        
        assert data["success"] == True
        assert "midi_base64" in data
        assert data["midi_base64"] is not None
        
        # Verify it's valid base64
        decoded = base64.b64decode(data["midi_base64"])
        assert len(decoded) > 0
        
        # Verify MIDI header
        assert decoded[:4] == b"MThd", "MIDI should start with MThd header"
    
    def test_generate_returns_parameters(self, sample_profile):
        """Successful generation should return parameters"""
        response = requests.post(
            f"{SERVER_URL}/generate",
            json=sample_profile
        )
        data = response.json()
        
        assert data["success"] == True
        assert "parameters" in data
    
    def test_generate_with_minimal_profile(self, minimal_profile):
        """Generate should work with minimal profile"""
        response = requests.post(
            f"{SERVER_URL}/generate",
            json=minimal_profile
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
    
    def test_generate_with_high_trauma(self, high_trauma_profile):
        """Generate should handle high trauma profiles"""
        response = requests.post(
            f"{SERVER_URL}/generate",
            json=high_trauma_profile
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
    
    def test_generate_empty_request(self):
        """Generate should handle empty request body"""
        response = requests.post(
            f"{SERVER_URL}/generate",
            json={}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True


# === RSI DOMINANT TESTS ===

class TestRSIDominance:
    """Tests for RSI register dominance detection"""
    
    def test_real_dominant(self):
        """Real-dominant profile should return 'real' as dominant"""
        profile = {
            "rsi": {"real": 0.8, "symbolic": 0.1, "imaginary": 0.1},
            "max_bars": 4
        }
        response = requests.post(f"{SERVER_URL}/generate", json=profile)
        data = response.json()
        
        assert data["success"] == True
        assert data["parameters"].get("rsi_dominant") == "real"
    
    def test_symbolic_dominant(self):
        """Symbolic-dominant profile should return 'symbolic' as dominant"""
        profile = {
            "rsi": {"real": 0.1, "symbolic": 0.8, "imaginary": 0.1},
            "max_bars": 4
        }
        response = requests.post(f"{SERVER_URL}/generate", json=profile)
        data = response.json()
        
        assert data["success"] == True
        assert data["parameters"].get("rsi_dominant") == "symbolic"
    
    def test_imaginary_dominant(self):
        """Imaginary-dominant profile should return 'imaginary' as dominant"""
        profile = {
            "rsi": {"real": 0.1, "symbolic": 0.1, "imaginary": 0.8},
            "max_bars": 4
        }
        response = requests.post(f"{SERVER_URL}/generate", json=profile)
        data = response.json()
        
        assert data["success"] == True
        assert data["parameters"].get("rsi_dominant") == "imaginary"


# === PERFORMANCE TESTS ===

class TestPerformance:
    """Basic performance tests"""
    
    def test_health_check_fast(self):
        """Health check should be fast (< 1 second)"""
        start = time.time()
        response = requests.get(f"{SERVER_URL}/health")
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 1.0, f"Health check too slow: {elapsed:.2f}s"
    
    def test_generate_reasonable_time(self, minimal_profile):
        """Generation should complete in reasonable time"""
        start = time.time()
        response = requests.post(f"{SERVER_URL}/generate", json=minimal_profile)
        elapsed = time.time() - start
        
        assert response.status_code == 200
        assert elapsed < 10.0, f"Generation too slow: {elapsed:.2f}s"


# === MIDI QUALITY TESTS ===

class TestMIDIQuality:
    """Tests for MIDI output quality"""
    
    def test_midi_file_size(self, sample_profile):
        """Generated MIDI should have reasonable size"""
        response = requests.post(f"{SERVER_URL}/generate", json=sample_profile)
        data = response.json()
        
        midi_bytes = base64.b64decode(data["midi_base64"])
        
        # MIDI for 8 bars should be at least 100 bytes
        assert len(midi_bytes) >= 100, f"MIDI too small: {len(midi_bytes)} bytes"
        
        # But not unreasonably large (< 100KB for 8 bars)
        assert len(midi_bytes) < 100000, f"MIDI too large: {len(midi_bytes)} bytes"
    
    def test_midi_has_track_chunks(self, sample_profile):
        """MIDI should have track chunks"""
        response = requests.post(f"{SERVER_URL}/generate", json=sample_profile)
        data = response.json()
        
        midi_bytes = base64.b64decode(data["midi_base64"])
        
        # MIDI track chunks start with "MTrk"
        assert b"MTrk" in midi_bytes, "MIDI should have MTrk track chunks"


# === RUN TESTS ===

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
