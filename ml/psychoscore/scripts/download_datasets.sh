#!/bin/bash
# Download datasets for PSYCHOSCORE training
# Run this script to fetch EMOPIA and sample Lakh MIDI data

set -e

DATA_DIR="${1:-/app/data/raw}"
mkdir -p "$DATA_DIR"

echo "=== PSYCHOSCORE Dataset Download ==="
echo "Target directory: $DATA_DIR"
echo ""

# Check if wget is available
if ! command -v wget &> /dev/null; then
    echo "  ⚠ wget not available, skipping external downloads"
    echo "  → Will use synthetic data generation only"
    touch "$DATA_DIR/.synthetic_only"
    exit 0
fi

# 1. Download EMOPIA dataset
echo "[1/2] Downloading EMOPIA dataset..."
if [ ! -d "$DATA_DIR/EMOPIA_1.0" ]; then
    cd "$DATA_DIR"
    if wget -q --timeout=30 "https://zenodo.org/records/4096310/files/EMOPIA_1.0.zip" -O emopia.zip 2>/dev/null; then
        unzip -q emopia.zip && rm emopia.zip
        echo "  ✓ EMOPIA downloaded (1,087 clips)"
    else
        echo "  ⚠ EMOPIA download failed, using synthetic data only"
        touch "$DATA_DIR/.synthetic_only"
    fi
else
    echo "  ✓ EMOPIA already exists, skipping"
fi

# 2. Skip Lakh MIDI for now (very large, use synthetic instead)
echo "[2/2] Skipping Lakh MIDI (using synthetic data instead)..."
echo "  → 100,000 synthetic pairs will be generated"

echo ""
echo "=== Download Complete ==="
echo "Datasets in: $DATA_DIR"
ls -la "$DATA_DIR" 2>/dev/null || echo "(directory listing unavailable)"
