"""
PSYCHOSCORE Workspace Configuration System

Implements a layered configuration approach:
1. System defaults (hardcoded fallbacks)
2. User defaults (from database or env)
3. Project/workspace overrides (per-project config file)

This allows users to adjust parameters per-project (e.g., "Hamlet" workspace)
while maintaining sensible system-wide defaults.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, Optional
from dataclasses import dataclass, field, asdict
import logging

logger = logging.getLogger(__name__)


@dataclass
class TemperatureScheduleConfig:
    """Configuration for dynamic temperature calculation"""
    base_temperature: float = 0.7
    entropy_multiplier: float = 0.5   # How much entropy affects temp
    trauma_multiplier: float = 0.3    # How much trauma affects temp
    rsi_imaginary_bonus: float = 0.1  # Bonus for imaginary-dominant RSI
    min_temperature: float = 0.4
    max_temperature: float = 1.5


@dataclass
class MusicalMappingConfig:
    """Configuration for psychometric → musical mappings"""
    # RSI dominant → mode mapping
    rsi_mode_mapping: Dict[str, Dict[str, str]] = field(default_factory=lambda: {
        'real': {'low_trauma': 'Dorian', 'high_trauma': 'Aeolian'},
        'symbolic': {'low_trauma': 'Lydian', 'high_trauma': 'Mixolydian'},
        'imaginary': {'low_trauma': 'Phrygian', 'high_trauma': 'Locrian'},
    })
    
    # Trauma threshold for mode selection
    trauma_threshold: float = 0.6
    
    # OCEAN Openness → key mapping (sharps vs flats)
    openness_key_bias: float = 0.5  # 0 = prefer flats, 1 = prefer sharps
    
    # Instrument palette selection
    default_instruments: Dict[str, list] = field(default_factory=lambda: {
        'real': ['cello', 'double_bass', 'bassoon'],
        'symbolic': ['piano', 'violin', 'clarinet'],
        'imaginary': ['celesta', 'harp', 'flute'],
    })


@dataclass
class ContrastiveLearningConfig:
    """Configuration for contrastive learning during training"""
    enabled: bool = True
    weight: float = 0.1  # λ in L_total = L_lm + λ * L_contrastive
    temperature: float = 0.07  # InfoNCE temperature
    positive_threshold: float = 0.7  # Profile similarity for positive pair
    negative_threshold: float = 0.3  # Profile similarity for negative pair
    hard_negative_mining: bool = True


@dataclass
class GenerationConfig:
    """Configuration for MIDI generation"""
    default_max_bars: int = 32
    default_top_p: float = 0.9
    use_dynamic_temperature: bool = True
    
    # Variation controls
    note_variety_entropy_scale: float = 1.0
    rhythmic_complexity_scale: float = 1.0
    harmonic_density_scale: float = 1.0


@dataclass 
class WorkspaceConfig:
    """
    Complete configuration for a PSYCHOSCORE workspace/project.
    
    Example: A "Hamlet" project might use:
    - Lower base temperature (darker, more constrained)
    - Higher trauma multiplier (tragedy-appropriate)
    - Dorian/Aeolian mode bias
    """
    name: str = "default"
    description: str = ""
    
    temperature: TemperatureScheduleConfig = field(default_factory=TemperatureScheduleConfig)
    musical_mapping: MusicalMappingConfig = field(default_factory=MusicalMappingConfig)
    contrastive: ContrastiveLearningConfig = field(default_factory=ContrastiveLearningConfig)
    generation: GenerationConfig = field(default_factory=GenerationConfig)
    
    # Project-specific overrides (raw dict for flexibility)
    custom_overrides: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for serialization"""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'WorkspaceConfig':
        """Create from dictionary"""
        config = cls(
            name=data.get('name', 'default'),
            description=data.get('description', ''),
        )
        
        if 'temperature' in data:
            config.temperature = TemperatureScheduleConfig(**data['temperature'])
        if 'musical_mapping' in data:
            config.musical_mapping = MusicalMappingConfig(**data['musical_mapping'])
        if 'contrastive' in data:
            config.contrastive = ContrastiveLearningConfig(**data['contrastive'])
        if 'generation' in data:
            config.generation = GenerationConfig(**data['generation'])
        if 'custom_overrides' in data:
            config.custom_overrides = data['custom_overrides']
            
        return config


# === SYSTEM DEFAULTS ===

SYSTEM_DEFAULTS = WorkspaceConfig(
    name="system_defaults",
    description="System-wide default configuration",
)


# === PRESET CONFIGURATIONS ===

PRESETS: Dict[str, WorkspaceConfig] = {
    'tragedy': WorkspaceConfig(
        name='tragedy',
        description='Preset for tragic works (Hamlet, Macbeth, etc.)',
        temperature=TemperatureScheduleConfig(
            base_temperature=0.6,
            trauma_multiplier=0.4,
            entropy_multiplier=0.3,
        ),
        musical_mapping=MusicalMappingConfig(
            trauma_threshold=0.5,  # More likely to use darker modes
        ),
    ),
    'comedy': WorkspaceConfig(
        name='comedy',
        description='Preset for comedic works',
        temperature=TemperatureScheduleConfig(
            base_temperature=0.8,
            trauma_multiplier=0.2,
            entropy_multiplier=0.6,
        ),
        musical_mapping=MusicalMappingConfig(
            trauma_threshold=0.7,  # Less likely to use darker modes
        ),
    ),
    'experimental': WorkspaceConfig(
        name='experimental',
        description='Preset for avant-garde and experimental works',
        temperature=TemperatureScheduleConfig(
            base_temperature=0.9,
            entropy_multiplier=0.8,
            max_temperature=1.8,
        ),
        generation=GenerationConfig(
            note_variety_entropy_scale=1.5,
            rhythmic_complexity_scale=1.5,
        ),
    ),
}


class ConfigManager:
    """
    Manages layered configuration with precedence:
    1. Project config (highest priority)
    2. User defaults
    3. Preset (if specified)
    4. System defaults (fallback)
    """
    
    def __init__(
        self,
        project_dir: Optional[Path] = None,
        user_config_path: Optional[Path] = None,
    ):
        self.project_dir = Path(project_dir) if project_dir else None
        self.user_config_path = user_config_path
        self._cache: Dict[str, WorkspaceConfig] = {}
    
    def get_config(
        self,
        workspace_id: Optional[str] = None,
        preset: Optional[str] = None,
    ) -> WorkspaceConfig:
        """
        Get merged configuration for a workspace.
        
        Args:
            workspace_id: ID of workspace to load config for
            preset: Name of preset to use as base
            
        Returns:
            Merged WorkspaceConfig
        """
        # Start with system defaults
        config = WorkspaceConfig(**asdict(SYSTEM_DEFAULTS))
        
        # Apply preset if specified
        if preset and preset in PRESETS:
            config = self._merge_configs(config, PRESETS[preset])
        
        # Apply user defaults
        user_config = self._load_user_config()
        if user_config:
            config = self._merge_configs(config, user_config)
        
        # Apply project config (highest priority)
        project_config = self._load_project_config(workspace_id)
        if project_config:
            config = self._merge_configs(config, project_config)
        
        return config
    
    def _load_user_config(self) -> Optional[WorkspaceConfig]:
        """Load user-level defaults"""
        if not self.user_config_path:
            # Default location
            user_config_path = Path.home() / '.config' / 'psychoscore' / 'config.json'
        else:
            user_config_path = self.user_config_path
        
        if user_config_path.exists():
            try:
                with open(user_config_path) as f:
                    data = json.load(f)
                return WorkspaceConfig.from_dict(data)
            except Exception as e:
                logger.warning(f"Failed to load user config: {e}")
        
        return None
    
    def _load_project_config(self, workspace_id: Optional[str] = None) -> Optional[WorkspaceConfig]:
        """Load project-specific config"""
        if not self.project_dir:
            return None
        
        # Look for psychoscore.json in project directory
        config_path = self.project_dir / 'psychoscore.json'
        
        # Or in .psychoscore subdirectory
        if not config_path.exists():
            config_path = self.project_dir / '.psychoscore' / 'config.json'
        
        if config_path.exists():
            try:
                with open(config_path) as f:
                    data = json.load(f)
                return WorkspaceConfig.from_dict(data)
            except Exception as e:
                logger.warning(f"Failed to load project config: {e}")
        
        return None
    
    def _merge_configs(
        self,
        base: WorkspaceConfig,
        override: WorkspaceConfig,
    ) -> WorkspaceConfig:
        """Merge two configs, with override taking precedence for non-default values"""
        # Deep merge by converting to dicts
        base_dict = asdict(base)
        override_dict = asdict(override)
        
        merged = self._deep_merge(base_dict, override_dict)
        return WorkspaceConfig.from_dict(merged)
    
    def _deep_merge(self, base: Dict, override: Dict) -> Dict:
        """Deep merge two dictionaries"""
        result = base.copy()
        
        for key, value in override.items():
            if key in result and isinstance(result[key], dict) and isinstance(value, dict):
                result[key] = self._deep_merge(result[key], value)
            elif value is not None:
                result[key] = value
        
        return result
    
    def save_project_config(self, config: WorkspaceConfig, project_dir: Optional[Path] = None):
        """Save configuration to project directory"""
        target_dir = project_dir or self.project_dir
        if not target_dir:
            raise ValueError("No project directory specified")
        
        config_path = target_dir / 'psychoscore.json'
        target_dir.mkdir(parents=True, exist_ok=True)
        
        with open(config_path, 'w') as f:
            json.dump(config.to_dict(), f, indent=2)
        
        logger.info(f"Saved project config to {config_path}")
    
    def get_effective_temperature_schedule(
        self,
        workspace_id: Optional[str] = None,
    ) -> TemperatureScheduleConfig:
        """Convenience method to get just temperature config"""
        return self.get_config(workspace_id).temperature


# === EXAMPLE PROJECT CONFIG FILE ===

EXAMPLE_PROJECT_CONFIG = """
{
  "name": "hamlet",
  "description": "Score configuration for Hamlet production 2026",
  "temperature": {
    "base_temperature": 0.6,
    "trauma_multiplier": 0.4,
    "entropy_multiplier": 0.35
  },
  "musical_mapping": {
    "trauma_threshold": 0.5,
    "rsi_mode_mapping": {
      "real": {"low_trauma": "Aeolian", "high_trauma": "Locrian"},
      "symbolic": {"low_trauma": "Dorian", "high_trauma": "Phrygian"},
      "imaginary": {"low_trauma": "Phrygian", "high_trauma": "Locrian"}
    }
  },
  "generation": {
    "default_max_bars": 48,
    "note_variety_entropy_scale": 0.8
  }
}
"""
