#!/bin/bash
# Download EMOPIA dataset from Zenodo
# EMOPIA: 1,087 emotion-labeled piano MIDI clips
# License: CC-BY 4.0

set -e

DATA_DIR="${1:-./data/raw/EMOPIA}"
ZENODO_URL="https://zenodo.org/record/5257995/files/EMOPIA_2.2.zip"
ZIP_FILE="/tmp/EMOPIA_2.2.zip"
EXPECTED_MD5="bad5171786a4898f37fc2678e99afd94"

echo "=== EMOPIA Dataset Downloader ==="
echo "Target directory: $DATA_DIR"

# Create directory
mkdir -p "$DATA_DIR"

# Check if already downloaded
if [ -d "$DATA_DIR/EMOPIA_2.2" ] && [ "$(ls -A $DATA_DIR/EMOPIA_2.2/*.mid 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "✓ EMOPIA already downloaded ($(ls $DATA_DIR/EMOPIA_2.2/*.mid | wc -l) MIDI files)"
    exit 0
fi

# Download
echo "Downloading EMOPIA 2.2 from Zenodo..."
wget -q --show-progress -O "$ZIP_FILE" "$ZENODO_URL"

# Verify MD5 (optional, skip if md5sum not available)
if command -v md5sum &> /dev/null; then
    ACTUAL_MD5=$(md5sum "$ZIP_FILE" | cut -d ' ' -f 1)
    if [ "$ACTUAL_MD5" != "$EXPECTED_MD5" ]; then
        echo "⚠ MD5 mismatch! Expected: $EXPECTED_MD5, Got: $ACTUAL_MD5"
        echo "Continuing anyway..."
    else
        echo "✓ MD5 verified"
    fi
fi

# Extract
echo "Extracting..."
unzip -q -o "$ZIP_FILE" -d "$DATA_DIR"

# Cleanup
rm -f "$ZIP_FILE"

# Count files
MIDI_COUNT=$(find "$DATA_DIR" -name "*.mid" | wc -l)
echo "✓ Extracted $MIDI_COUNT MIDI files"

# Show emotion distribution
echo ""
echo "Emotion class distribution (from filename):"
for class in 1 2 3 4; do
    count=$(find "$DATA_DIR" -name "Q${class}_*.mid" | wc -l)
    case $class in
        1) label="HAHV (High Arousal, High Valence)" ;;
        2) label="HALV (High Arousal, Low Valence)" ;;
        3) label="LAHV (Low Arousal, High Valence)" ;;
        4) label="LALV (Low Arousal, Low Valence)" ;;
    esac
    echo "  Q$class ($label): $count"
done

echo ""
echo "✓ EMOPIA download complete!"
