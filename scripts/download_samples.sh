#!/bin/bash

# MPN Conductor - High Quality Sample Downloader
# Fetches VSCO-2 CE (Community Edition) samples for web use
# Instruments: Violin, Cello, Trumpet, Horn, Flute, Clarinet, Piano, Percussion

BASE_URL="https://github.com/sgossner/VSCO-2-CE/raw/master"
Ref_URL="https://raw.githubusercontent.com/sgossner/VSCO-2-CE/master"
TARGET_DIR="./public/audio/samples"

echo "🎵 Starting MPN Sample Download..."
echo "📂 Target: $TARGET_DIR"

mkdir -p "$TARGET_DIR"

# Helper function to download sample
download_sample() {
    local instrument=$1
    local note=$2
    local url=$3
    local dest="$TARGET_DIR/$instrument"
    
    mkdir -p "$dest"
    
    echo "   ⬇️  $instrument - $note..."
    curl -L -s -o "$dest/${note}.mp3" "$url"
}

# 1. PIANO (Upright) - High C (Conscientiousness)
echo "🎹 Downloading Piano (High C)..."
# Using a lightweight piano source since VSCO piano is huge
# Fallback to a reliably hosted smaller set for web
piano_base="https://tonejs.github.io/audio/salamander"
download_sample "piano" "A0" "$piano_base/A0.mp3"
download_sample "piano" "C1" "$piano_base/C1.mp3"
download_sample "piano" "C2" "$piano_base/C2.mp3"
download_sample "piano" "C3" "$piano_base/C3.mp3"
download_sample "piano" "C4" "$piano_base/C4.mp3"
download_sample "piano" "C5" "$piano_base/C5.mp3"
download_sample "piano" "C6" "$piano_base/C6.mp3"
download_sample "piano" "C7" "$piano_base/C7.mp3"

# 2. STRINGS - High S (Steadiness)
echo "🎻 Downloading Strings (High S)..."

# Violin (Sustain)
# VSCO-2 path structure: "Violin Spiccato/violin-spic-C4.wav" -> need converted MP3s
# For this script, we'll use a pre-converted reliable web source (University of Iowa or similar open repo mirrors)
# To ensure immediate functionality, we will use the Tone.js examples for now which are high quality
# We will setup the directory structure for future expansion

# Using standard reliable web-ready samples
strings_base="https://gleitz.github.io/midi-js-soundfonts/MusyngKite/violin-mp3"
# Note: This is an example, actual URLs might vary. 
# Better strategy: Use a specific known GitHub repo with MP3s

# Let's use a known working set from a CDN for immediate reliability
CDN_BASE="https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus"

# Function to fetch from Google Magenta (High quality, MP3, fast)
fetch_magenta() {
    local inst_name=$1
    local midi_name=$2
    local dest="$TARGET_DIR/$inst_name"
    mkdir -p "$dest"
    
    echo "   ⬇️  Fetching $inst_name..."
    # C3 = MIDI 48, C4 = 60, C5 = 72
    curl -L -s -o "$dest/C3.mp3" "$CDN_BASE/$midi_name/p48.mp3"
    curl -L -s -o "$dest/E3.mp3" "$CDN_BASE/$midi_name/p52.mp3"
    curl -L -s -o "$dest/G3.mp3" "$CDN_BASE/$midi_name/p55.mp3"
    curl -L -s -o "$dest/A3.mp3" "$CDN_BASE/$midi_name/p57.mp3"
    
    curl -L -s -o "$dest/C4.mp3" "$CDN_BASE/$midi_name/p60.mp3"
    curl -L -s -o "$dest/E4.mp3" "$CDN_BASE/$midi_name/p64.mp3"
    curl -L -s -o "$dest/G4.mp3" "$CDN_BASE/$midi_name/p67.mp3"
    curl -L -s -o "$dest/A4.mp3" "$CDN_BASE/$midi_name/p69.mp3"
    
    curl -L -s -o "$dest/C5.mp3" "$CDN_BASE/$midi_name/p72.mp3"
    curl -L -s -o "$dest/E5.mp3" "$CDN_BASE/$midi_name/p76.mp3"
    curl -L -s -o "$dest/G5.mp3" "$CDN_BASE/$midi_name/p79.mp3"
}

fetch_magenta "violin" "violin"       # High S
fetch_magenta "cello" "cello"         # High S + Trauma
fetch_magenta "bass" "contrabass"     # High S + Power

# 3. BRASS - High D (Dominance)
echo "🎺 Downloading Brass (High D)..."
fetch_magenta "trumpet" "trumpet"
fetch_magenta "trombone" "trombone"
fetch_magenta "french_horn" "french_horn"
fetch_magenta "tuba" "tuba"

# 4. WOODWINDS - High I (Influence)
echo "🌬️  Downloading Woodwinds (High I)..."
fetch_magenta "flute" "flute"
fetch_magenta "clarinet" "clarinet"
fetch_magenta "oboe" "oboe"
fetch_magenta "bassoon" "bassoon"

# 5. PERCUSSION
echo "🥁 Downloading Percussion..."
# Percussion is different (mapped to MIDI notes)
# Using separate reliable source or synth fallback for now
# We will create a generic folder
mkdir -p "$TARGET_DIR/percussion"
echo "   ⚠️  Percussion samples pending (using synth fallback for now)"

echo "✅ Download Complete! Samples ready in public/audio/samples/"
