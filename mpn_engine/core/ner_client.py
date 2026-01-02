"""
NER Client for NER11 Gold API
Handles communication with the external NER service for psychometric entity extraction.
"""

import requests
import logging
from dataclasses import dataclass
from typing import List, Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Entity:
    """Named Entity extracted from text"""
    text: str
    label: str
    start: int
    end: int
    score: float

class NerClient:
    """
    Client for the NER11 Gold Standard API.
    
    Provides methods to analyze text and extract entities, 
    with graceful fallback if the service is unavailable.
    """
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip('/')
        self.endpoint = f"{self.base_url}/ner"
    
    def is_available(self) -> bool:
        """Check if the NER service is available"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=1.0)
            return response.status_code == 200
        except requests.RequestException:
            return False

    def analyze_text(self, text: str) -> List[Entity]:
        """
        Analyze text and return extracted entities.
        
        Args:
            text: The text to analyze
            
        Returns:
            List of Entity objects. Returns empty list on error/timeout.
        """
        if not text or len(text.strip()) == 0:
            return []

        try:
            payload = {"text": text}
            response = requests.post(
                self.endpoint, 
                json=payload, 
                headers={"Content-Type": "application/json"},
                timeout=2.0  # Short timeout to avoid blocking processing
            )
            response.raise_for_status()
            
            data = response.json()
            entities = []
            
            for item in data.get("entities", []):
                entities.append(Entity(
                    text=item["text"],
                    label=item["label"],
                    start=item["start"],
                    end=item["end"],
                    score=item.get("score", 1.0)
                ))
                
            return entities
            
        except requests.RequestException as e:
            logger.warning(f"NER Service unavailable or error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error in NER analysis: {e}")
            return []
