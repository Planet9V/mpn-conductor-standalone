"""
Contrastive Learning for PSYCHOSCORE Training

Implements InfoNCE-style contrastive loss to ensure:
- Similar psychometric profiles → similar MIDI embeddings
- Dissimilar profiles → dissimilar embeddings

This improves profile-to-music coherence in the trained model.

Reference: "A Simple Framework for Contrastive Learning" (Chen et al., 2020)
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from typing import Dict, List, Tuple, Optional


def flatten_profile(profile: Dict) -> torch.Tensor:
    """
    Flatten a psychometric profile dict into a 1D tensor.
    
    Expected profile keys:
    - disc_d, disc_i, disc_s, disc_c (4)
    - ocean_o, ocean_c, ocean_e, ocean_a, ocean_n (5)
    - rsi_real, rsi_symbolic, rsi_imaginary (3)
    - trauma, entropy (2)
    - dark_mach, dark_narc, dark_psych (3)
    
    Total: 17 dimensions
    """
    keys = [
        'disc_d', 'disc_i', 'disc_s', 'disc_c',
        'ocean_o', 'ocean_c', 'ocean_e', 'ocean_a', 'ocean_n',
        'rsi_real', 'rsi_symbolic', 'rsi_imaginary',
        'trauma', 'entropy',
        'dark_mach', 'dark_narc', 'dark_psych',
    ]
    
    values = [float(profile.get(k, 0.5)) for k in keys]
    return torch.tensor(values, dtype=torch.float32)


def profile_similarity(p1: Dict, p2: Dict) -> float:
    """
    Calculate cosine similarity between two psychometric profiles.
    
    Returns value in [-1, 1], where 1 = identical profiles.
    """
    v1 = flatten_profile(p1)
    v2 = flatten_profile(p2)
    
    return F.cosine_similarity(v1.unsqueeze(0), v2.unsqueeze(0)).item()


def batch_profile_similarity(profiles: List[Dict]) -> torch.Tensor:
    """
    Calculate pairwise similarity matrix for a batch of profiles.
    
    Returns:
        Tensor of shape (N, N) where entry [i,j] is sim(profile_i, profile_j)
    """
    # Stack all profiles into a matrix
    vectors = torch.stack([flatten_profile(p) for p in profiles])  # (N, D)
    
    # Normalize
    vectors_norm = F.normalize(vectors, p=2, dim=1)  # (N, D)
    
    # Pairwise cosine similarity
    similarity_matrix = torch.mm(vectors_norm, vectors_norm.t())  # (N, N)
    
    return similarity_matrix


class ContrastiveLoss(nn.Module):
    """
    InfoNCE-style contrastive loss for PSYCHOSCORE training.
    
    Encourages the model to produce similar embeddings for similar profiles
    and dissimilar embeddings for dissimilar profiles.
    """
    
    def __init__(
        self,
        temperature: float = 0.07,
        similarity_threshold: float = 0.8,
    ):
        super().__init__()
        self.temperature = temperature
        self.similarity_threshold = similarity_threshold
    
    def forward(
        self,
        embeddings: torch.Tensor,
        profiles: List[Dict],
    ) -> torch.Tensor:
        """
        Compute contrastive loss.
        
        Args:
            embeddings: Model output embeddings, shape (batch_size, embed_dim)
            profiles: List of psychometric profile dicts
            
        Returns:
            Scalar loss tensor
        """
        batch_size = embeddings.size(0)
        
        if batch_size < 2:
            return torch.tensor(0.0, device=embeddings.device)
        
        # Normalize embeddings
        embeddings_norm = F.normalize(embeddings, p=2, dim=1)  # (B, D)
        
        # Compute embedding similarity matrix
        embed_sim = torch.mm(embeddings_norm, embeddings_norm.t()) / self.temperature  # (B, B)
        
        # Compute profile similarity matrix
        profile_sim = batch_profile_similarity(profiles).to(embeddings.device)  # (B, B)
        
        # Create positive mask: profiles with similarity > threshold
        positive_mask = profile_sim > self.similarity_threshold
        
        # Remove diagonal (self-similarity)
        positive_mask.fill_diagonal_(False)
        
        # If no positives, return 0 loss
        if not positive_mask.any():
            return torch.tensor(0.0, device=embeddings.device)
        
        # InfoNCE loss: for each anchor, pull positive, push negatives
        loss = torch.tensor(0.0, device=embeddings.device)
        num_valid = 0
        
        for i in range(batch_size):
            positives = positive_mask[i]
            
            if positives.any():
                # Positive similarities (should be high)
                pos_sim = embed_sim[i][positives]
                
                # All other items as negatives (denominator)
                all_sim = embed_sim[i]
                
                # Log-softmax over all items
                log_softmax = F.log_softmax(all_sim, dim=0)
                
                # Loss is negative log probability of positives
                pos_loss = -log_softmax[positives].mean()
                loss = loss + pos_loss
                num_valid += 1
        
        if num_valid > 0:
            loss = loss / num_valid
        
        return loss


class TripletContrastiveLoss(nn.Module):
    """
    Triplet-margin contrastive loss.
    
    For each anchor, pulls positive closer and pushes negative away.
    More stable than pure InfoNCE for small batches.
    """
    
    def __init__(self, margin: float = 0.5):
        super().__init__()
        self.margin = margin
    
    def forward(
        self,
        anchor_embed: torch.Tensor,
        positive_embed: torch.Tensor,
        negative_embed: torch.Tensor,
    ) -> torch.Tensor:
        """
        Compute triplet margin loss.
        
        Args:
            anchor_embed: Anchor embeddings (B, D)
            positive_embed: Positive embeddings (B, D) - similar profiles
            negative_embed: Negative embeddings (B, D) - dissimilar profiles
            
        Returns:
            Scalar loss tensor
        """
        # Compute distances
        pos_dist = F.pairwise_distance(anchor_embed, positive_embed)
        neg_dist = F.pairwise_distance(anchor_embed, negative_embed)
        
        # Triplet loss: d(a, p) - d(a, n) + margin
        loss = F.relu(pos_dist - neg_dist + self.margin)
        
        return loss.mean()


def extract_sequence_embedding(
    hidden_states: torch.Tensor,
    attention_mask: Optional[torch.Tensor] = None,
    pool_type: str = 'mean',
) -> torch.Tensor:
    """
    Extract fixed-size embedding from sequence of hidden states.
    
    Args:
        hidden_states: Shape (batch, seq_len, hidden_dim)
        attention_mask: Shape (batch, seq_len), 1 for real tokens, 0 for padding
        pool_type: 'mean', 'max', 'last', or 'cls'
        
    Returns:
        Embeddings of shape (batch, hidden_dim)
    """
    if pool_type == 'cls':
        # Use first token (like BERT [CLS])
        return hidden_states[:, 0, :]
    
    elif pool_type == 'last':
        # Use last token
        if attention_mask is not None:
            # Find actual last token position
            seq_lens = attention_mask.sum(dim=1) - 1
            batch_size = hidden_states.size(0)
            return hidden_states[torch.arange(batch_size), seq_lens.long(), :]
        else:
            return hidden_states[:, -1, :]
    
    elif pool_type == 'max':
        if attention_mask is not None:
            # Mask padding with large negative
            mask_expanded = attention_mask.unsqueeze(-1).expand_as(hidden_states)
            hidden_states = hidden_states.masked_fill(~mask_expanded.bool(), float('-inf'))
        return hidden_states.max(dim=1)[0]
    
    else:  # mean
        if attention_mask is not None:
            mask_expanded = attention_mask.unsqueeze(-1).expand_as(hidden_states)
            sum_embeddings = (hidden_states * mask_expanded).sum(dim=1)
            sum_mask = mask_expanded.sum(dim=1).clamp(min=1e-9)
            return sum_embeddings / sum_mask
        else:
            return hidden_states.mean(dim=1)


class ContrastiveTrainer:
    """
    Wrapper to add contrastive loss to standard HuggingFace training.
    
    Usage:
        trainer = ContrastiveTrainer(
            model=model,
            contrastive_weight=0.1,
        )
        
        # In training loop:
        outputs = model(**batch, output_hidden_states=True)
        embeddings = trainer.extract_embeddings(outputs.hidden_states[-1], batch['attention_mask'])
        c_loss = trainer.contrastive_loss(embeddings, profiles)
        total_loss = outputs.loss + trainer.weight * c_loss
    """
    
    def __init__(
        self,
        model: nn.Module,
        contrastive_weight: float = 0.1,
        temperature: float = 0.07,
    ):
        self.model = model
        self.weight = contrastive_weight
        self.contrastive_loss = ContrastiveLoss(temperature=temperature)
    
    def extract_embeddings(
        self,
        hidden_states: torch.Tensor,
        attention_mask: torch.Tensor,
    ) -> torch.Tensor:
        """Extract embeddings from last hidden state"""
        return extract_sequence_embedding(
            hidden_states,
            attention_mask,
            pool_type='mean',
        )
    
    def compute_loss(
        self,
        embeddings: torch.Tensor,
        profiles: List[Dict],
    ) -> torch.Tensor:
        """Compute weighted contrastive loss"""
        return self.weight * self.contrastive_loss(embeddings, profiles)
