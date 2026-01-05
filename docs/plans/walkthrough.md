# PSYCHOSCORE Model Improvements - Walkthrough

**Date:** 2026-01-05  
**Status:** ✅ Complete

---

## Summary

Implemented all 4 ICE-scored PSYCHOSCORE improvements plus a per-project configuration system for workspace-specific parameter overrides.

---

## Files Created

| File | Purpose |
|------|---------|
| [download_emopia.sh](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/scripts/download_emopia.sh) | Download EMOPIA from Zenodo |
| [emopia_loader.py](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/data/emopia_loader.py) | Emotion→psychometric mapping |
| [contrastive_loss.py](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/train/contrastive_loss.py) | InfoNCE loss implementation |
| [profile_sampler.py](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/train/profile_sampler.py) | Triplet mining for training |
| [workspace_config.py](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/config/workspace_config.py) | Layered configuration system |
| [config/__init__.py](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/config/__init__.py) | Module exports |
| [hamlet.psychoscore.json](file:///home/jim/mpn-conductor-standalone/ml/psychoscore/config/examples/hamlet.psychoscore.json) | Example project config |

---

## Files Modified

render_diffs(file:///home/jim/mpn-conductor-standalone/ml/psychoscore/inference/server.py)

render_diffs(file:///home/jim/mpn-conductor-standalone/ml/psychoscore/scripts/run_training_pipeline.py)

---

## Improvements Implemented

### 1. EMOPIA Dataset (ICE 8.5)

- Downloads 1,087 emotion-labeled piano MIDI clips from Zenodo
- Maps EMOPIA quadrants (Q1-Q4) to psychometric profiles:

| Quadrant | Valence | Arousal | → Trauma | → Entropy |
|----------|---------|---------|----------|-----------|
| Q1 | High | High | 0.1-0.3 | 0.7-0.9 |
| Q2 | Low | High | 0.6-0.9 | 0.6-0.8 |
| Q3 | High | Low | 0.1-0.3 | 0.2-0.4 |
| Q4 | Low | Low | 0.7-0.9 | 0.1-0.3 |

### 2. Synthetic Scaling (ICE 7.5)

- Training pipeline updated to support 50k+ pairs
- EMOPIA pairs merged with synthetic for mixed training

### 3. Temperature Scheduling (ICE 6.5)

```python
def calculate_dynamic_temperature(trauma, entropy, rsi):
    base = 0.7
    temp = base + (entropy * 0.5) - (trauma * 0.3)
    if rsi['imaginary'] > 0.5:
        temp += 0.1
    return clamp(temp, 0.4, 1.5)
```

### 4. Contrastive Learning (ICE 6.0)

- InfoNCE loss for profile→embedding coherence
- Similar profiles → similar MIDI embeddings
- Hard negative mining support

### 5. Per-Project Configuration (Bonus)

Configuration hierarchy:
```
Project → User → Preset → System
```

Built-in presets: `tragedy`, `comedy`, `experimental`

---

## Usage

### Download EMOPIA
```bash
cd ml/psychoscore
bash scripts/download_emopia.sh
```

### Run Training with All Improvements
```bash
python scripts/run_training_pipeline.py --config train/config.yaml
```

### Per-Project Config
Create `psychoscore.json` in project folder:
```json
{
  "name": "hamlet",
  "temperature": {"base_temperature": 0.6}
}
```

---

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Training Data | 15k synthetic | 50k+ mixed |
| Loss | 6.03 | Target < 4.5 |
| Profile Coherence | Low | Higher (contrastive) |
| Temperature | Fixed 0.8 | Dynamic 0.4-1.5 |
