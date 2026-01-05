"""
Profile Sampling for Contrastive Learning

Provides triplet sampling strategies:
- Anchor: random profile
- Positive: similar profile (high cosine similarity)
- Negative: dissimilar profile (low cosine similarity)

This enables effective contrastive learning for PSYCHOSCORE.
"""

import random
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

import numpy as np

from .contrastive_loss import flatten_profile, profile_similarity


@dataclass
class ProfileTriplet:
    """A triplet of anchor, positive, and negative profiles"""
    anchor: Dict
    anchor_idx: int
    positive: Dict
    positive_idx: int
    negative: Dict
    negative_idx: int
    pos_similarity: float
    neg_similarity: float


class ProfileSampler:
    """
    Samples triplets from a pool of psychometric profiles.
    
    Uses cosine similarity to define positive/negative pairs:
    - Positive: similarity > pos_threshold (default 0.7)
    - Negative: similarity < neg_threshold (default 0.3)
    """
    
    def __init__(
        self,
        profiles: List[Dict],
        pos_threshold: float = 0.7,
        neg_threshold: float = 0.3,
        seed: int = 42,
    ):
        self.profiles = profiles
        self.pos_threshold = pos_threshold
        self.neg_threshold = neg_threshold
        self.rng = random.Random(seed)
        
        # Precompute similarity matrix for efficiency
        self._precompute_similarities()
    
    def _precompute_similarities(self):
        """Precompute pairwise similarities"""
        n = len(self.profiles)
        
        # Convert all profiles to vectors
        vectors = np.array([
            flatten_profile(p).numpy() 
            for p in self.profiles
        ])  # (N, D)
        
        # Normalize
        norms = np.linalg.norm(vectors, axis=1, keepdims=True)
        norms = np.where(norms == 0, 1, norms)  # Avoid division by zero
        vectors_norm = vectors / norms
        
        # Pairwise cosine similarity
        self.similarity_matrix = vectors_norm @ vectors_norm.T  # (N, N)
        
        # For each anchor, find positives and negatives
        self.positives = {}  # anchor_idx -> list of positive indices
        self.negatives = {}  # anchor_idx -> list of negative indices
        
        for i in range(n):
            sims = self.similarity_matrix[i]
            self.positives[i] = [
                j for j in range(n) 
                if j != i and sims[j] > self.pos_threshold
            ]
            self.negatives[i] = [
                j for j in range(n)
                if j != i and sims[j] < self.neg_threshold
            ]
    
    def sample_triplet(self) -> Optional[ProfileTriplet]:
        """
        Sample a single triplet.
        
        Returns None if no valid triplet can be formed.
        """
        # Get anchors that have both positives and negatives
        valid_anchors = [
            i for i in range(len(self.profiles))
            if self.positives[i] and self.negatives[i]
        ]
        
        if not valid_anchors:
            return None
        
        # Sample anchor
        anchor_idx = self.rng.choice(valid_anchors)
        
        # Sample positive and negative
        pos_idx = self.rng.choice(self.positives[anchor_idx])
        neg_idx = self.rng.choice(self.negatives[anchor_idx])
        
        return ProfileTriplet(
            anchor=self.profiles[anchor_idx],
            anchor_idx=anchor_idx,
            positive=self.profiles[pos_idx],
            positive_idx=pos_idx,
            negative=self.profiles[neg_idx],
            negative_idx=neg_idx,
            pos_similarity=self.similarity_matrix[anchor_idx, pos_idx],
            neg_similarity=self.similarity_matrix[anchor_idx, neg_idx],
        )
    
    def sample_batch(self, batch_size: int) -> List[ProfileTriplet]:
        """Sample a batch of triplets"""
        triplets = []
        attempts = 0
        max_attempts = batch_size * 10
        
        while len(triplets) < batch_size and attempts < max_attempts:
            triplet = self.sample_triplet()
            if triplet:
                triplets.append(triplet)
            attempts += 1
        
        return triplets
    
    def get_hard_negatives(
        self,
        anchor_idx: int,
        k: int = 5,
    ) -> List[int]:
        """
        Get hard negatives for an anchor.
        
        Hard negatives are dissimilar profiles that are closest to
        the anchor (hardest to distinguish from positives).
        """
        sims = self.similarity_matrix[anchor_idx]
        
        # Get negatives sorted by similarity (descending = harder)
        neg_sims = [
            (j, sims[j]) 
            for j in self.negatives[anchor_idx]
        ]
        neg_sims.sort(key=lambda x: x[1], reverse=True)
        
        return [idx for idx, _ in neg_sims[:k]]


class BalancedTripletBatchSampler:
    """
    Samples batches with balanced representation of all quadrants.
    
    Ensures each batch has similar number of:
    - High trauma / low trauma
    - High entropy / low entropy
    - Each RSI dominant type
    """
    
    def __init__(
        self,
        profiles: List[Dict],
        batch_size: int = 32,
        seed: int = 42,
    ):
        self.profiles = profiles
        self.batch_size = batch_size
        self.rng = random.Random(seed)
        
        # Categorize profiles
        self._categorize_profiles()
    
    def _categorize_profiles(self):
        """Categorize profiles by characteristics"""
        self.high_trauma_idx = []
        self.low_trauma_idx = []
        self.high_entropy_idx = []
        self.low_entropy_idx = []
        self.rsi_buckets = {'real': [], 'symbolic': [], 'imaginary': []}
        
        for i, p in enumerate(self.profiles):
            trauma = p.get('trauma', 0.5)
            entropy = p.get('entropy', 0.5)
            
            if trauma > 0.5:
                self.high_trauma_idx.append(i)
            else:
                self.low_trauma_idx.append(i)
            
            if entropy > 0.5:
                self.high_entropy_idx.append(i)
            else:
                self.low_entropy_idx.append(i)
            
            # Determine RSI dominant
            rsi_real = p.get('rsi_real', 0.33)
            rsi_sym = p.get('rsi_symbolic', 0.34)
            rsi_img = p.get('rsi_imaginary', 0.33)
            
            if rsi_real >= rsi_sym and rsi_real >= rsi_img:
                self.rsi_buckets['real'].append(i)
            elif rsi_sym >= rsi_real and rsi_sym >= rsi_img:
                self.rsi_buckets['symbolic'].append(i)
            else:
                self.rsi_buckets['imaginary'].append(i)
    
    def sample_batch(self) -> List[int]:
        """Sample a balanced batch of profile indices"""
        batch = []
        target_per_category = self.batch_size // 4
        
        # Sample from each trauma level
        batch.extend(self.rng.choices(self.high_trauma_idx, k=target_per_category))
        batch.extend(self.rng.choices(self.low_trauma_idx, k=target_per_category))
        
        # Add remaining from entropy balance
        remaining = self.batch_size - len(batch)
        batch.extend(self.rng.choices(self.high_entropy_idx, k=remaining // 2))
        batch.extend(self.rng.choices(self.low_entropy_idx, k=remaining - remaining // 2))
        
        self.rng.shuffle(batch)
        return batch[:self.batch_size]


def augment_profile(profile: Dict, noise_level: float = 0.1) -> Dict:
    """
    Augment a profile by adding small random noise.
    
    Useful for creating positive pairs from a single profile.
    """
    augmented = profile.copy()
    
    numeric_keys = [
        'disc_d', 'disc_i', 'disc_s', 'disc_c',
        'ocean_o', 'ocean_c', 'ocean_e', 'ocean_a', 'ocean_n',
        'rsi_real', 'rsi_symbolic', 'rsi_imaginary',
        'trauma', 'entropy',
        'dark_mach', 'dark_narc', 'dark_psych',
    ]
    
    for key in numeric_keys:
        if key in augmented:
            noise = random.uniform(-noise_level, noise_level)
            augmented[key] = max(0.0, min(1.0, augmented[key] + noise))
    
    # Re-normalize RSI
    if all(k in augmented for k in ['rsi_real', 'rsi_symbolic', 'rsi_imaginary']):
        total = augmented['rsi_real'] + augmented['rsi_symbolic'] + augmented['rsi_imaginary']
        if total > 0:
            augmented['rsi_real'] /= total
            augmented['rsi_symbolic'] /= total
            augmented['rsi_imaginary'] /= total
    
    return augmented
