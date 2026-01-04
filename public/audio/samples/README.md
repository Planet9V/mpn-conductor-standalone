# Audio Samples for MPN Conductor

This directory contains sampled instrument audio files used for realistic orchestral synthesis.

## Current Status: PLACEHOLDER

Real instrument samples need to be downloaded and placed here.

## Required Sample Library

**Option A: VSCO-2 CE (Community Edition)** - FREE
- Download: https://github.com/sgossner/VSCO-2-CE
- Size: ~1.5GB
- Quality: Professional orchestral samples
- License: Creative Commons

**Option B: FluidR3_GM Soundfont** - FREE
- Download: https://member.keymusician.com/Member/FluidR3_GM/index.html
- Size: ~140MB
- Quality: Good general MIDI sounds
- License: MIT

## Directory Structure (After Download)

```
public/audio/samples/
├── violin/
│   ├── C3.mp3
│   ├── D3.mp3
│   ├── E3.mp3
│   └── ...
├── trumpet/
│   ├── C4.mp3
│   ├── D4.mp3
│   └── ...
├── piano/
│   ├── A0.mp3
│   ├── C1.mp3
│   └── ...
└── README.md (this file)
```

## Integration Steps

1. **Download VSCO-2 CE** or FluidR3_GM
2. **Extract samples** to this directory
3. **Organize by instrument** (violin, trumpet, etc.)
4. **Convert to MP3** if needed (for web compatibility)
5. **Update Tone.Sampler** URLs in MPNSynthesizer.ts

## Sample Requirements

Each instrument needs samples at these pitches (minimum):
- **C3, E3, G3, A3** (octave 3)
- **C4, E4, G4, A4** (octave 4)
- **C5, E5, G5** (octave 5)

Tone.js will interpolate between samples for intermediate pitches.

## File Naming Convention

Format: `{instrument}_{pitch}.mp3`

Examples:
- `violin_C4.mp3`
- `trumpet_G3.mp3`
- `piano_A0.mp3`

## Alternative: Use Tone.js Built-in Samples

For testing, you can use Tone.js online samples:
```typescript
const sampler = new Tone.Sampler({
  urls: {
    C4: "C4.mp3",
    "D#4": "Ds4.mp3",
    "F#4": "Fs4.mp3",
    A4: "A4.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();
```

## Next Steps

1. Download sample library
2. Extract and organize files
3. Test loading in MPNSynthesizer
4. Verify psychometric → instrument mapping
5. Compare quality with synthetic Tone.js sounds

---

**Note:** This is a PLACEHOLDER. Actual samples must be sourced from free/legal repositories.
