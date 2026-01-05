# PSYCHOSCORE Training Container
# Uses PyTorch 2.9.1 with CUDA 13.0 for RTX 5060/5070 Ti (Blackwell sm_120 support)

FROM pytorch/pytorch:2.9.1-cuda13.0-cudnn9-devel

LABEL maintainer="MPN Team"
LABEL description="PSYCHOSCORE: Psychometric-to-MIDI Model Training"
LABEL version="1.2"
LABEL note="PyTorch 2.9.1 + CUDA 13.0 for Blackwell GPU support (sm_120)"

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=America/Chicago

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    curl \
    unzip \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories
RUN mkdir -p /app/data/raw \
    /app/data/processed \
    /app/data/tokenized \
    /app/data/synthetic \
    /app/checkpoints \
    /app/logs \
    /app/eval_samples \
    /app/tokenizers

# Make scripts executable
RUN chmod +x /app/scripts/*.sh 2>/dev/null || true

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128
ENV TRANSFORMERS_CACHE=/app/.cache/huggingface
ENV HF_HOME=/app/.cache/huggingface

# Default command: run the training pipeline
CMD ["python", "scripts/run_training_pipeline.py"]
