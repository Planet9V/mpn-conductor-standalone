"""
Dialogue Parser

Parses dramatic texts (plays, scripts) into dialogue beats.
Supports multiple formats including Project Gutenberg plays.
"""

import re
from dataclasses import dataclass
from typing import List, Tuple, Optional
from pathlib import Path


@dataclass
class DialogueBeat:
    """A single unit of dialogue or stage direction"""
    speaker: str
    text: str
    beat_type: str = "dialogue"  # "dialogue", "stage", "scene"
    
    def to_tuple(self) -> Tuple[str, str]:
        return (self.speaker, self.text)


class DialogueParser:
    """
    Parses play texts into structured dialogue beats.
    
    Handles various formats:
    - Project Gutenberg classics (Shakespeare, Ibsen, Chekhov)
    - Modern screenplay format
    - Simple dialogue format (NAME: text)
    """
    
    # Common speaker name patterns
    SPEAKER_PATTERNS = [
        # ALL CAPS followed by period or colon
        re.compile(r'^([A-Z][A-Z\s\']+)[\.\:]\s*(.*)$'),
        # Title case followed by colon
        re.compile(r'^([A-Z][a-z]+(?:\s[A-Z][a-z]+)*):\s*(.*)$'),
        # Bracketed speaker [SPEAKER]
        re.compile(r'^\[([A-Z]+)\]\s*(.*)$'),
    ]
    
    # Stage direction patterns
    STAGE_PATTERNS = [
        re.compile(r'^\[([^\]]+)\]$'),           # [Stage direction]
        re.compile(r'^\(([^\)]+)\)$'),           # (Stage direction)
        re.compile(r'^_([^_]+)_$'),              # _Stage direction_
        re.compile(r'^Enter\s+.+', re.I),        # Enter characters
        re.compile(r'^Exit\s+.+', re.I),         # Exit characters
        re.compile(r'^Exeunt', re.I),            # Exeunt
    ]
    
    # Scene/Act markers
    SCENE_PATTERNS = [
        re.compile(r'^(ACT|SCENE)\s+[IVX\d]+', re.I),
        re.compile(r'^Scene\s+\d+', re.I),
    ]
    
    def __init__(self):
        self.current_speaker = "NARRATOR"
    
    def parse_file(self, filepath: str) -> List[DialogueBeat]:
        """
        Parse a text file into dialogue beats.
        
        Args:
            filepath: Path to the text file
            
        Returns:
            List of DialogueBeat objects
        """
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
        return self.parse_text(text)
    
    def parse_text(self, text: str) -> List[DialogueBeat]:
        """
        Parse raw text into dialogue beats.
        
        Args:
            text: The complete play/script text
            
        Returns:
            List of DialogueBeat objects
        """
        lines = text.split('\n')
        beats: List[DialogueBeat] = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            beat = self._parse_line(line)
            if beat:
                beats.append(beat)
        
        return beats
    
    def _parse_line(self, line: str) -> Optional[DialogueBeat]:
        """Parse a single line into a DialogueBeat"""
        
        # Check for scene markers
        for pattern in self.SCENE_PATTERNS:
            if pattern.match(line):
                return DialogueBeat(
                    speaker="SCENE",
                    text=line,
                    beat_type="scene"
                )
        
        # Check for stage directions
        for pattern in self.STAGE_PATTERNS:
            match = pattern.match(line)
            if match:
                stage_text = match.group(1) if match.groups() else line
                return DialogueBeat(
                    speaker="STAGE",
                    text=stage_text,
                    beat_type="stage"
                )
        
        # Check for speaker + dialogue
        for pattern in self.SPEAKER_PATTERNS:
            match = pattern.match(line)
            if match:
                speaker = match.group(1).strip()
                dialogue = match.group(2).strip() if len(match.groups()) > 1 else ""
                
                # Update current speaker
                self.current_speaker = speaker
                
                if dialogue:
                    return DialogueBeat(
                        speaker=speaker,
                        text=dialogue,
                        beat_type="dialogue"
                    )
                # Just speaker name, no dialogue on this line
                return None
        
        # Continuation of previous speaker's dialogue
        if line and not line.startswith(('#', '//', ';')):  # Skip comments
            return DialogueBeat(
                speaker=self.current_speaker,
                text=line,
                beat_type="dialogue"
            )
        
        return None
    
    def get_speakers(self, beats: List[DialogueBeat]) -> List[str]:
        """Extract unique speakers from beats (excluding STAGE/SCENE)"""
        speakers = set()
        for beat in beats:
            if beat.speaker not in ('STAGE', 'SCENE', 'NARRATOR'):
                speakers.add(beat.speaker)
        return sorted(list(speakers))
    
    def filter_dialogue_only(self, beats: List[DialogueBeat]) -> List[DialogueBeat]:
        """Filter to only include actual dialogue beats"""
        return [b for b in beats if b.beat_type == "dialogue"]
    
    def to_tuples(self, beats: List[DialogueBeat]) -> List[Tuple[str, str]]:
        """Convert beats to simple (speaker, text) tuples"""
        return [b.to_tuple() for b in beats]


class ConversationParser:
    """
    Parser for simple two-person conversation transcripts.
    
    Expected format:
    Speaker1: Hello there!
    Speaker2: Hi, how are you?
    """
    
    SPEAKER_PATTERN = re.compile(r'^([^:]+):\s*(.+)$')
    
    def parse_text(self, text: str) -> List[DialogueBeat]:
        """Parse a conversation transcript"""
        lines = text.strip().split('\n')
        beats = []
        current_speaker = "SPEAKER1"
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            match = self.SPEAKER_PATTERN.match(line)
            if match:
                speaker = match.group(1).strip()
                dialogue = match.group(2).strip()
                current_speaker = speaker
                beats.append(DialogueBeat(
                    speaker=speaker,
                    text=dialogue,
                    beat_type="dialogue"
                ))
            elif line:
                # Continuation
                beats.append(DialogueBeat(
                    speaker=current_speaker,
                    text=line,
                    beat_type="dialogue"
                ))
        
        return beats


def parse_dialogue(filepath_or_text: str, 
                   format: str = "auto") -> List[Tuple[str, str]]:
    """
    Convenience function to parse dialogue from file or text.
    
    Args:
        filepath_or_text: Path to file or raw text
        format: "play", "conversation", or "auto"
        
    Returns:
        List of (speaker, text) tuples
    """
    # Determine if input is file or text
    is_file = Path(filepath_or_text).exists() if len(filepath_or_text) < 500 else False
    
    if is_file:
        with open(filepath_or_text, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
    else:
        text = filepath_or_text
    
    # Auto-detect format
    if format == "auto":
        # If contains ACT/SCENE markers, it's a play
        if re.search(r'\b(ACT|SCENE)\s+[IVX\d]+', text, re.I):
            format = "play"
        else:
            format = "conversation"
    
    if format == "play":
        parser = DialogueParser()
    else:
        parser = ConversationParser()
    
    beats = parser.parse_text(text)
    return [(b.speaker, b.text) for b in beats]
