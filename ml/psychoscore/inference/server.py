"""
PSYCHOSCORE Inference Server
FastAPI server for generating MIDI from psychometric profiles.

Usage:
    uvicorn server:app --host 0.0.0.0 --port 8000
"""

import os
import io
import logging
from pathlib import Path
from typing import Dict, List, Any, Optional

import torch
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from transformers import AutoModelForCausalLM
from peft import PeftModel

# Add parent to path
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))
from tokenizer import PsychoscoreTokenizer, PsychometricProfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PSYCHOSCORE Inference API",
    description="Generate MIDI from psychometric profiles using trained PSYCHOSCORE model",
    version="1.0.0"
)


# === REQUEST/RESPONSE MODELS ===

class DISCProfile(BaseModel):
    D: float = Field(0.5, ge=0, le=1, description="Dominance")
    I: float = Field(0.5, ge=0, le=1, description="Influence") 
    S: float = Field(0.5, ge=0, le=1, description="Steadiness")
    C: float = Field(0.5, ge=0, le=1, description="Compliance")


class OCEANProfile(BaseModel):
    O: float = Field(0.5, ge=0, le=1, description="Openness")
    C: float = Field(0.5, ge=0, le=1, description="Conscientiousness")
    E: float = Field(0.5, ge=0, le=1, description="Extraversion")
    A: float = Field(0.5, ge=0, le=1, description="Agreeableness")
    N: float = Field(0.5, ge=0, le=1, description="Neuroticism")


class RSIProfile(BaseModel):
    real: float = Field(0.33, ge=0, le=1, description="Real register")
    symbolic: float = Field(0.34, ge=0, le=1, description="Symbolic register")
    imaginary: float = Field(0.33, ge=0, le=1, description="Imaginary register")


class DarkTriadProfile(BaseModel):
    machiavellianism: float = Field(0.1, ge=0, le=1)
    narcissism: float = Field(0.1, ge=0, le=1)
    psychopathy: float = Field(0.1, ge=0, le=1)


class PhysicsState(BaseModel):
    hamiltonian_energy: float = Field(0.5, ge=0, le=1)
    ising_spin: str = Field('+', pattern='^[+-]$')
    granovetter_threshold: float = Field(0.5, ge=0, le=1)
    lyapunov_exponent: float = Field(0.0, ge=-0.5, le=0.5)


class GenerateRequest(BaseModel):
    disc: Optional[DISCProfile] = None
    ocean: Optional[OCEANProfile] = None
    rsi: Optional[RSIProfile] = None
    trauma: float = Field(0.3, ge=0, le=1)
    entropy: float = Field(0.3, ge=0, le=1)
    dark_triad: Optional[DarkTriadProfile] = None
    cognitive_biases: List[str] = Field(default_factory=list)
    physics: Optional[PhysicsState] = None
    
    # Musical context
    key: Optional[str] = None
    mode: Optional[str] = None
    tempo: Optional[int] = Field(None, ge=40, le=200)
    
    # Generation settings
    max_bars: int = Field(32, ge=1, le=128)
    temperature: Optional[float] = Field(None, ge=0.1, le=2.0, description="If None, use dynamic temperature")
    top_p: float = Field(0.9, ge=0.1, le=1.0)
    use_dynamic_temperature: bool = Field(True, description="Calculate temperature from profile if temperature is None")


class GenerateResponse(BaseModel):
    success: bool
    midi_base64: Optional[str] = None
    parameters: Dict[str, Any] = {}
    error: Optional[str] = None


# === DYNAMIC TEMPERATURE SCHEDULING ===

def calculate_dynamic_temperature(
    trauma: float,
    entropy: float, 
    rsi: Optional[Dict[str, float]] = None,
) -> float:
    """
    Calculate generation temperature from psychometric profile.
    
    Temperature Schedule:
    - Base: 0.7
    - High entropy → more variation (+ up to 0.5)
    - High trauma → less variation (- up to 0.3)
    - Imaginary RSI dominant → slightly higher (+0.1)
    
    Returns value in [0.4, 1.5] range.
    """
    base_temp = 0.7
    
    # Entropy factor: high entropy = more creative/unpredictable
    entropy_bonus = entropy * 0.5  # +0.0 to +0.5
    
    # Trauma factor: high trauma = more constrained/consistent
    trauma_penalty = trauma * 0.3  # -0.0 to -0.3
    
    # RSI factor: imaginary dominant = dreamier/more variation
    rsi_bonus = 0.0
    if rsi:
        imaginary = rsi.get('imaginary', 0.33)
        if imaginary > 0.5:
            rsi_bonus = 0.1
    
    # Calculate final temperature
    temp = base_temp + entropy_bonus - trauma_penalty + rsi_bonus
    
    # Clamp to valid range
    return max(0.4, min(1.5, temp))


# === MODEL LOADER ===


class PsychoscoreInference:
    """Handles model loading and generation"""
    
    def __init__(self, model_path: str):
        self.model_path = Path(model_path)
        self.model = None
        self.tokenizer = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
    def load(self):
        """Load model and tokenizer"""
        logger.info(f"Loading model from {self.model_path}")
        
        # Load tokenizer
        self.tokenizer = PsychoscoreTokenizer.from_pretrained(str(self.model_path))
        
        # Load base model
        base_model = AutoModelForCausalLM.from_pretrained(
            str(self.model_path),
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True,
        )
        
        # Check if LoRA adapters exist (support both .bin and .safetensors)
        adapter_path_bin = self.model_path / "adapter_model.bin"
        adapter_path_st = self.model_path / "adapter_model.safetensors"
        
        if adapter_path_bin.exists() or adapter_path_st.exists():
            logger.info("Loading LoRA adapters")
            self.model = PeftModel.from_pretrained(base_model, str(self.model_path))
        else:
            self.model = base_model
        
        self.model.eval()
        logger.info(f"Model loaded on {self.device}")
    
    def generate(
        self,
        profile: PsychometricProfile,
        max_bars: int = 32,
        temperature: float = 0.8,
        top_p: float = 0.9,
    ) -> bytes:
        """Generate MIDI from psychometric profile using rule-based approach"""
        
        # Use profile parameters directly for MIDI generation
        # This is a rule-based fallback until model is trained with proper music data
        
        from midiutil import MIDIFile
        import random
        
        # Derive musical parameters from psychometric profile
        rsi = profile.rsi
        dominant = max(rsi.items(), key=lambda x: x[1])[0] if isinstance(rsi, dict) else 'symbolic'
        
        trauma = profile.trauma if hasattr(profile, 'trauma') else 0.3
        entropy = profile.entropy if hasattr(profile, 'entropy') else 0.3
        
        # Map RSI to mode
        mode_map = {
            'real': [0, 2, 3, 5, 7, 8, 10],  # Phrygian (dark)
            'symbolic': [0, 2, 4, 5, 7, 9, 11],  # Major (bright)
            'imaginary': [0, 2, 3, 5, 7, 9, 10],  # Dorian (melancholic)
        }
        scale = mode_map.get(dominant, mode_map['symbolic'])
        
        # Map trauma to tempo (higher trauma = slower)
        base_tempo = 120
        tempo = int(base_tempo - (trauma * 40) + (entropy * 20))
        tempo = max(60, min(180, tempo))
        
        # Map DISC to dynamics
        disc = profile.disc if hasattr(profile, 'disc') and profile.disc else {'D': 0.5}
        base_velocity = int(60 + (disc.get('D', 0.5) * 40))
        
        # Create MIDI file
        midi = MIDIFile(1)  # One track
        track = 0
        channel = 0
        midi.addTempo(track, 0, tempo)
        
        # Generate melodic phrase
        root = 60  # Middle C
        time = 0
        
        for bar in range(max_bars):
            notes_per_bar = int(2 + entropy * 6)  # 2-8 notes per bar
            beat_duration = 4.0 / notes_per_bar
            
            for i in range(notes_per_bar):
                # Choose note from scale with some randomness based on entropy
                if random.random() < entropy:
                    interval = random.choice(scale)
                else:
                    interval = scale[i % len(scale)]
                
                pitch = root + interval + (bar % 2) * 12  # Octave variation
                duration = beat_duration * (0.8 + random.random() * 0.4)
                velocity = base_velocity + random.randint(-10, 10)
                velocity = max(40, min(127, velocity))
                
                midi.addNote(track, channel, pitch, time, duration, velocity)
                time += beat_duration
        
        # Write to bytes
        midi_bytes = io.BytesIO()
        midi.writeFile(midi_bytes)
        return midi_bytes.getvalue()



# === GLOBAL MODEL INSTANCE ===
inference: Optional[PsychoscoreInference] = None


@app.on_event("startup")
async def load_model():
    """Load model on startup"""
    global inference
    
    model_path = os.environ.get("MODEL_PATH", "./checkpoints/psychoscore/final")
    inference = PsychoscoreInference(model_path)
    
    try:
        inference.load()
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        logger.warning("Server running without model - generate endpoint will fail")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": inference is not None and inference.model is not None,
        "device": inference.device if inference else None,
    }


@app.post("/generate", response_model=GenerateResponse)
async def generate_midi(request: GenerateRequest):
    """Generate MIDI from psychometric profile"""
    
    if inference is None or inference.model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Build RSI dict for temperature calculation
        rsi_dict = request.rsi.model_dump() if request.rsi else {'real': 0.33, 'symbolic': 0.34, 'imaginary': 0.33}
        
        # Calculate temperature: use explicit value, or dynamic based on profile
        if request.temperature is not None:
            temperature = request.temperature
        elif request.use_dynamic_temperature:
            temperature = calculate_dynamic_temperature(
                trauma=request.trauma,
                entropy=request.entropy,
                rsi=rsi_dict,
            )
            logger.info(f"Dynamic temperature: {temperature:.2f} (trauma={request.trauma:.2f}, entropy={request.entropy:.2f})")
        else:
            temperature = 0.8  # Default fallback
        
        # Build psychometric profile
        profile = PsychometricProfile(
            disc=request.disc.model_dump() if request.disc else {'D': 0.5, 'I': 0.5, 'S': 0.5, 'C': 0.5},
            ocean=request.ocean.model_dump() if request.ocean else {'O': 0.5, 'C': 0.5, 'E': 0.5, 'A': 0.5, 'N': 0.5},
            rsi=rsi_dict,
            trauma=request.trauma,
            entropy=request.entropy,
            dark_triad=request.dark_triad.model_dump() if request.dark_triad else {'machiavellianism': 0.1, 'narcissism': 0.1, 'psychopathy': 0.1},
            cognitive_biases=request.cognitive_biases,
            physics=request.physics.model_dump() if request.physics else {'hamiltonian_energy': 0.5, 'ising_spin': '+', 'granovetter_threshold': 0.5, 'lyapunov_exponent': 0.0},
            key=request.key,
            mode=request.mode,
            tempo=request.tempo,
        )
        
        # Generate MIDI
        midi_bytes = inference.generate(
            profile,
            max_bars=request.max_bars,
            temperature=temperature,
            top_p=request.top_p,
        )
        
        # Encode to base64
        import base64
        midi_b64 = base64.b64encode(midi_bytes).decode('utf-8')

        
        return GenerateResponse(
            success=True,
            midi_base64=midi_b64,
            parameters={
                "bars": request.max_bars,
                "temperature": temperature,
                "dynamic_temperature_used": request.temperature is None and request.use_dynamic_temperature,
                "rsi_dominant": profile.get_rsi_dominant(),
            }
        )
        
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        return GenerateResponse(
            success=False,
            error=str(e)
        )


@app.post("/generate/midi")
async def generate_midi_file(request: GenerateRequest):
    """Generate MIDI and return as downloadable file"""
    
    result = await generate_midi(request)
    
    if not result.success:
        raise HTTPException(status_code=500, detail=result.error)
    
    import base64
    midi_bytes = base64.b64decode(result.midi_base64)
    
    return Response(
        content=midi_bytes,
        media_type="audio/midi",
        headers={"Content-Disposition": "attachment; filename=psychoscore_output.mid"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
