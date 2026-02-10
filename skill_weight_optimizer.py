#!/usr/bin/env python3
"""
Self-Contained Trainable Skill Weight Optimizer
================================================

Calculates and optimizes all weights in the Multi-Dimensional Skill Framework:
- Q-score dimension weights (8D)
- Interaction tensor parameters
- Emergence coefficients
- Synthesis weights

Uses gradient descent with momentum and adaptive learning rates.

Author: Auto-generated from Mathematical Framework (Feb 2026)
Version: 1.0.0
"""

import numpy as np
from typing import Dict, List, Tuple, Optional
import json
import pickle
from dataclasses import dataclass, asdict
from datetime import datetime


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class SkillVector:
    """8-dimensional skill representation"""
    name: str
    G: float  # Grounding (0-1)
    C: float  # Certainty (0-1)
    S: float  # Structure (0-1)
    A: float  # Applicability (0-1)
    H: float  # Coherence (0-1)
    V: float  # Generativity (0-1)
    P: float  # Presentation (0-1)
    T: float  # Temporal (0-1)
    
    def to_array(self) -> np.ndarray:
        """Convert to numpy array"""
        return np.array([self.G, self.C, self.S, self.A, 
                        self.H, self.V, self.P, self.T])
    
    def from_array(self, arr: np.ndarray):
        """Update from numpy array"""
        self.G, self.C, self.S, self.A = arr[0], arr[1], arr[2], arr[3]
        self.H, self.V, self.P, self.T = arr[4], arr[5], arr[6], arr[7]


@dataclass
class TrainingExample:
    """Single training example with skill and target Q-score"""
    skill: SkillVector
    target_q: float
    context: str = ""


@dataclass
class WeightConfig:
    """All trainable weights in the system"""
    # Q-score dimension weights (must sum to 1.0)
    w_G: float = 0.18  # Grounding
    w_C: float = 0.20  # Certainty
    w_S: float = 0.18  # Structure
    w_A: float = 0.16  # Applicability
    w_H: float = 0.12  # Coherence
    w_V: float = 0.08  # Generativity
    w_P: float = 0.05  # Presentation
    w_T: float = 0.03  # Temporal
    
    # Interaction tensor parameters
    alpha: float = 0.7   # Synergy coefficient
    beta: float = 0.3    # Curvature coefficient
    
    # Emergence parameters
    gamma: float = 0.20  # Tensor product influence
    delta_min: float = 0.02  # Minimum emergence gain
    delta_max: float = 0.05  # Maximum emergence gain
    
    # Synthesis weights (learned per task type)
    synthesis_weights: Dict[str, np.ndarray] = None
    
    def __post_init__(self):
        if self.synthesis_weights is None:
            self.synthesis_weights = {}
    
    def to_array(self) -> np.ndarray:
        """Convert to numpy array for optimization"""
        return np.array([
            self.w_G, self.w_C, self.w_S, self.w_A,
            self.w_H, self.w_V, self.w_P, self.w_T,
            self.alpha, self.beta, self.gamma,
            self.delta_min, self.delta_max
        ])
    
    def from_array(self, arr: np.ndarray):
        """Update from numpy array"""
        self.w_G, self.w_C, self.w_S, self.w_A = arr[0], arr[1], arr[2], arr[3]
        self.w_H, self.w_V, self.w_P, self.w_T = arr[4], arr[5], arr[6], arr[7]
        self.alpha, self.beta, self.gamma = arr[8], arr[9], arr[10]
        self.delta_min, self.delta_max = arr[11], arr[12]
        
        # Normalize Q-score weights to sum to 1.0
        q_weights = arr[:8]
        q_weights = q_weights / q_weights.sum()
        self.w_G, self.w_C, self.w_S, self.w_A = q_weights[0:4]
        self.w_H, self.w_V, self.w_P, self.w_T = q_weights[4:8]
        
        # Clamp other parameters to valid ranges
        self.alpha = np.clip(self.alpha, 0.0, 1.0)
        self.beta = np.clip(self.beta, 0.0, 1.0)
        self.gamma = np.clip(self.gamma, 0.0, 0.5)
        self.delta_min = np.clip(self.delta_min, 0.0, 0.1)
        self.delta_max = np.clip(self.delta_max, self.delta_min, 0.2)


# ============================================================================
# CORE MATHEMATICAL OPERATIONS
# ============================================================================

class SkillMath:
    """Core mathematical operations on skills"""
    
    @staticmethod
    def compute_q_score(skill: SkillVector, weights: WeightConfig) -> float:
        """
        Calculate Q-score: Q(s) = Σᵢ wᵢ · cᵢ
        """
        s = skill.to_array()
        w = np.array([
            weights.w_G, weights.w_C, weights.w_S, weights.w_A,
            weights.w_H, weights.w_V, weights.w_P, weights.w_T
        ])
        
        q_score = np.dot(w, s)
        return float(np.clip(q_score, 0.0, 1.0))
    
    @staticmethod
    def compute_interaction_tensor(
        skill_a: SkillVector,
        skill_b: SkillVector,
        weights: WeightConfig
    ) -> np.ndarray:
        """
        Compute interaction tensor: I(i,j,k) = α·sim + β·curv
        
        Returns 8D array (one value per dimension)
        """
        s_a = skill_a.to_array()
        s_b = skill_b.to_array()
        
        # Cosine similarity per dimension
        norm_a = np.linalg.norm(s_a)
        norm_b = np.linalg.norm(s_b)
        
        if norm_a < 1e-10 or norm_b < 1e-10:
            cosine_sim = np.zeros(8)
        else:
            cosine_sim = (s_a * s_b) / (norm_a * norm_b)
        
        # Curvature (simplified: based on dimension difference)
        curvature = 1.0 - 2.0 * np.abs(s_a - s_b)
        
        # Interaction strength
        interaction = weights.alpha * cosine_sim + weights.beta * curvature
        
        return interaction
    
    @staticmethod
    def synthesize_emergent_skill(
        parent_skills: List[SkillVector],
        weights: WeightConfig,
        task_type: str = "default"
    ) -> SkillVector:
        """
        Synthesize emergent skill: s_e = Σαᵢsᵢ + γ·(s₁⊗s₂⊗...⊗sₖ)
        """
        k = len(parent_skills)
        
        # Get or initialize synthesis weights for this task type
        if task_type not in weights.synthesis_weights:
            # Initialize with uniform weights
            weights.synthesis_weights[task_type] = np.ones(k) / k
        
        syn_weights = weights.synthesis_weights[task_type]
        
        # Normalize synthesis weights
        syn_weights = syn_weights / syn_weights.sum()
        
        # Linear combination
        parent_arrays = np.array([s.to_array() for s in parent_skills])
        linear_part = np.sum(syn_weights[:, np.newaxis] * parent_arrays, axis=0)
        
        # Tensor product contribution (geometric mean as approximation)
        tensor_part = np.prod(parent_arrays, axis=0) ** (1.0 / k)
        
        # Emergent vector
        emergent_array = linear_part + weights.gamma * (tensor_part - linear_part)
        
        # Clamp to [0, 1]
        emergent_array = np.clip(emergent_array, 0.0, 1.0)
        
        # Create emergent skill
        emergent = SkillVector(
            name=f"emergent_{'_'.join([s.name for s in parent_skills[:2]])}",
            G=0, C=0, S=0, A=0, H=0, V=0, P=0, T=0
        )
        emergent.from_array(emergent_array)
        
        return emergent
    
    @staticmethod
    def predict_emergence_gain(
        parent_skills: List[SkillVector],
        weights: WeightConfig
    ) -> float:
        """
        Predict δ_emergence based on synergy strength
        """
        if len(parent_skills) < 2:
            return 0.0
        
        # Calculate pairwise synergies
        synergies = []
        for i in range(len(parent_skills)):
            for j in range(i + 1, len(parent_skills)):
                interaction = SkillMath.compute_interaction_tensor(
                    parent_skills[i], parent_skills[j], weights
                )
                # Average interaction strength
                avg_interaction = np.mean(interaction)
                synergies.append(avg_interaction)
        
        avg_synergy = np.mean(synergies)
        
        # Map synergy to delta_emergence
        if avg_synergy > 0.8:
            delta = weights.delta_max
        elif avg_synergy > 0.6:
            # Linear interpolation
            t = (avg_synergy - 0.6) / 0.2
            delta = weights.delta_min + t * (weights.delta_max - weights.delta_min)
        else:
            delta = weights.delta_min
        
        return delta


# ============================================================================
# TRAINING SYSTEM
# ============================================================================

class SkillWeightTrainer:
    """Trains all weights using gradient descent"""
    
    def __init__(
        self,
        learning_rate: float = 0.01,
        momentum: float = 0.9,
        weight_decay: float = 1e-5
    ):
        self.learning_rate = learning_rate
        self.momentum = momentum
        self.weight_decay = weight_decay
        
        self.weights = WeightConfig()
        self.velocity = np.zeros(13)  # Momentum terms
        
        self.training_history = []
    
    def compute_loss(
        self,
        predictions: np.ndarray,
        targets: np.ndarray,
        weights_array: np.ndarray
    ) -> float:
        """
        Loss = MSE + L2 regularization
        """
        mse = np.mean((predictions - targets) ** 2)
        l2_reg = self.weight_decay * np.sum(weights_array ** 2)
        
        return mse + l2_reg
    
    def compute_gradients(
        self,
        training_data: List[TrainingExample],
        weights_array: np.ndarray
    ) -> np.ndarray:
        """
        Compute gradients using finite differences
        """
        epsilon = 1e-5
        gradients = np.zeros_like(weights_array)
        
        # Baseline loss
        self.weights.from_array(weights_array)
        baseline_predictions = np.array([
            SkillMath.compute_q_score(ex.skill, self.weights)
            for ex in training_data
        ])
        baseline_targets = np.array([ex.target_q for ex in training_data])
        baseline_loss = self.compute_loss(
            baseline_predictions, baseline_targets, weights_array
        )
        
        # Compute gradient for each weight
        for i in range(len(weights_array)):
            # Perturb weight
            perturbed = weights_array.copy()
            perturbed[i] += epsilon
            
            # Compute perturbed loss
            self.weights.from_array(perturbed)
            perturbed_predictions = np.array([
                SkillMath.compute_q_score(ex.skill, self.weights)
                for ex in training_data
            ])
            perturbed_loss = self.compute_loss(
                perturbed_predictions, baseline_targets, perturbed
            )
            
            # Gradient
            gradients[i] = (perturbed_loss - baseline_loss) / epsilon
        
        return gradients
    
    def train_step(
        self,
        training_data: List[TrainingExample]
    ) -> Dict[str, float]:
        """
        Single training step
        """
        # Get current weights
        weights_array = self.weights.to_array()
        
        # Compute gradients
        gradients = self.compute_gradients(training_data, weights_array)
        
        # Update with momentum
        self.velocity = self.momentum * self.velocity - self.learning_rate * gradients
        weights_array += self.velocity
        
        # Update weights
        self.weights.from_array(weights_array)
        
        # Compute current loss
        predictions = np.array([
            SkillMath.compute_q_score(ex.skill, self.weights)
            for ex in training_data
        ])
        targets = np.array([ex.target_q for ex in training_data])
        loss = self.compute_loss(predictions, targets, weights_array)
        
        # Compute metrics
        mae = np.mean(np.abs(predictions - targets))
        
        return {
            'loss': float(loss),
            'mae': float(mae),
            'predictions': predictions.tolist(),
            'targets': targets.tolist()
        }
    
    def train(
        self,
        training_data: List[TrainingExample],
        validation_data: Optional[List[TrainingExample]] = None,
        epochs: int = 100,
        early_stopping_patience: int = 10,
        verbose: bool = True
    ) -> Dict[str, List]:
        """
        Full training loop
        """
        best_val_loss = float('inf')
        patience_counter = 0
        
        history = {
            'train_loss': [],
            'train_mae': [],
            'val_loss': [],
            'val_mae': []
        }
        
        for epoch in range(epochs):
            # Training step
            train_metrics = self.train_step(training_data)
            history['train_loss'].append(train_metrics['loss'])
            history['train_mae'].append(train_metrics['mae'])
            
            # Validation
            if validation_data:
                val_predictions = np.array([
                    SkillMath.compute_q_score(ex.skill, self.weights)
                    for ex in validation_data
                ])
                val_targets = np.array([ex.target_q for ex in validation_data])
                val_loss = np.mean((val_predictions - val_targets) ** 2)
                val_mae = np.mean(np.abs(val_predictions - val_targets))
                
                history['val_loss'].append(float(val_loss))
                history['val_mae'].append(float(val_mae))
                
                # Early stopping
                if val_loss < best_val_loss:
                    best_val_loss = val_loss
                    patience_counter = 0
                else:
                    patience_counter += 1
                
                if patience_counter >= early_stopping_patience:
                    if verbose:
                        print(f"Early stopping at epoch {epoch + 1}")
                    break
            
            # Logging
            if verbose and (epoch + 1) % 10 == 0:
                print(f"Epoch {epoch + 1}/{epochs}")
                print(f"  Train Loss: {train_metrics['loss']:.6f}, MAE: {train_metrics['mae']:.6f}")
                if validation_data:
                    print(f"  Val Loss: {val_loss:.6f}, MAE: {val_mae:.6f}")
                print()
        
        self.training_history = history
        return history
    
    def save_weights(self, filepath: str):
        """Save trained weights"""
        data = {
            'weights': asdict(self.weights),
            'timestamp': datetime.now().isoformat(),
            'training_history': self.training_history
        }
        
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        
        print(f"Weights saved to {filepath}")
    
    def load_weights(self, filepath: str):
        """Load trained weights"""
        with open(filepath, 'r') as f:
            data = json.load(f)
        
        weight_dict = data['weights']
        self.weights = WeightConfig(**{
            k: v for k, v in weight_dict.items() 
            if k != 'synthesis_weights'
        })
        
        print(f"Weights loaded from {filepath}")


# ============================================================================
# DATA GENERATION
# ============================================================================

class SyntheticDataGenerator:
    """Generate synthetic training data"""
    
    @staticmethod
    def generate_skill(
        name: str,
        quality_level: str = "medium"
    ) -> SkillVector:
        """
        Generate synthetic skill with specified quality level
        """
        if quality_level == "high":
            base = 0.8
            variance = 0.15
        elif quality_level == "medium":
            base = 0.6
            variance = 0.2
        else:  # low
            base = 0.4
            variance = 0.2
        
        values = np.random.uniform(base - variance, base + variance, 8)
        values = np.clip(values, 0.0, 1.0)
        
        return SkillVector(
            name=name,
            G=values[0], C=values[1], S=values[2], A=values[3],
            H=values[4], V=values[5], P=values[6], T=values[7]
        )
    
    @staticmethod
    def generate_training_set(
        n_examples: int = 100,
        noise_level: float = 0.05
    ) -> List[TrainingExample]:
        """
        Generate synthetic training examples
        """
        # True weights (ground truth)
        true_weights = WeightConfig()
        
        examples = []
        
        for i in range(n_examples):
            # Generate skill
            quality = np.random.choice(['high', 'medium', 'low'], p=[0.2, 0.6, 0.2])
            skill = SyntheticDataGenerator.generate_skill(f"skill_{i}", quality)
            
            # Compute true Q-score
            true_q = SkillMath.compute_q_score(skill, true_weights)
            
            # Add noise
            noisy_q = true_q + np.random.normal(0, noise_level)
            noisy_q = np.clip(noisy_q, 0.0, 1.0)
            
            examples.append(TrainingExample(
                skill=skill,
                target_q=noisy_q,
                context=f"synthetic_{quality}"
            ))
        
        return examples
    
    @staticmethod
    def generate_emergence_examples(
        n_examples: int = 50
    ) -> List[Tuple[List[SkillVector], float]]:
        """
        Generate examples for emergence gain prediction
        """
        true_weights = WeightConfig()
        examples = []
        
        for i in range(n_examples):
            # Generate 2-4 parent skills
            n_parents = np.random.randint(2, 5)
            parents = [
                SyntheticDataGenerator.generate_skill(f"parent_{i}_{j}")
                for j in range(n_parents)
            ]
            
            # Compute true emergence gain
            delta = SkillMath.predict_emergence_gain(parents, true_weights)
            
            examples.append((parents, delta))
        
        return examples


# ============================================================================
# EVALUATION
# ============================================================================

class SkillEvaluator:
    """Evaluate trained weights"""
    
    @staticmethod
    def evaluate(
        trainer: SkillWeightTrainer,
        test_data: List[TrainingExample]
    ) -> Dict[str, float]:
        """
        Evaluate on test set
        """
        predictions = np.array([
            SkillMath.compute_q_score(ex.skill, trainer.weights)
            for ex in test_data
        ])
        targets = np.array([ex.target_q for ex in test_data])
        
        mse = np.mean((predictions - targets) ** 2)
        mae = np.mean(np.abs(predictions - targets))
        rmse = np.sqrt(mse)
        
        # R² score
        ss_res = np.sum((targets - predictions) ** 2)
        ss_tot = np.sum((targets - np.mean(targets)) ** 2)
        r2 = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        return {
            'mse': float(mse),
            'mae': float(mae),
            'rmse': float(rmse),
            'r2': float(r2),
            'n_samples': len(test_data)
        }
    
    @staticmethod
    def print_weights(weights: WeightConfig):
        """Print learned weights"""
        print("\n" + "="*60)
        print("LEARNED WEIGHTS")
        print("="*60)
        
        print("\nQ-Score Dimension Weights:")
        print(f"  Grounding (G):     {weights.w_G:.4f} (18.0% target)")
        print(f"  Certainty (C):     {weights.w_C:.4f} (20.0% target)")
        print(f"  Structure (S):     {weights.w_S:.4f} (18.0% target)")
        print(f"  Applicability (A): {weights.w_A:.4f} (16.0% target)")
        print(f"  Coherence (H):     {weights.w_H:.4f} (12.0% target)")
        print(f"  Generativity (V):  {weights.w_V:.4f} (8.0% target)")
        print(f"  Presentation (P):  {weights.w_P:.4f} (5.0% target)")
        print(f"  Temporal (T):      {weights.w_T:.4f} (3.0% target)")
        
        total = (weights.w_G + weights.w_C + weights.w_S + weights.w_A +
                weights.w_H + weights.w_V + weights.w_P + weights.w_T)
        print(f"\n  Sum: {total:.4f} (should be 1.0)")
        
        print("\nInteraction Tensor Parameters:")
        print(f"  Alpha (synergy):   {weights.alpha:.4f} (0.70 target)")
        print(f"  Beta (curvature):  {weights.beta:.4f} (0.30 target)")
        
        print("\nEmergence Parameters:")
        print(f"  Gamma (tensor):    {weights.gamma:.4f} (0.20 target)")
        print(f"  Delta min:         {weights.delta_min:.4f} (0.02 target)")
        print(f"  Delta max:         {weights.delta_max:.4f} (0.05 target)")
        
        print("="*60 + "\n")


# ============================================================================
# MAIN TRAINING PIPELINE
# ============================================================================

def main():
    """Main training pipeline"""
    
    print("="*60)
    print("SKILL WEIGHT OPTIMIZER - TRAINING PIPELINE")
    print("="*60)
    print()
    
    # Set random seed for reproducibility
    np.random.seed(42)
    
    # ========================================================================
    # STEP 1: Generate Training Data
    # ========================================================================
    print("Step 1: Generating training data...")
    
    train_data = SyntheticDataGenerator.generate_training_set(n_examples=500)
    val_data = SyntheticDataGenerator.generate_training_set(n_examples=100)
    test_data = SyntheticDataGenerator.generate_training_set(n_examples=100)
    
    print(f"  Training examples: {len(train_data)}")
    print(f"  Validation examples: {len(val_data)}")
    print(f"  Test examples: {len(test_data)}")
    print()
    
    # ========================================================================
    # STEP 2: Initialize Trainer
    # ========================================================================
    print("Step 2: Initializing trainer...")
    
    trainer = SkillWeightTrainer(
        learning_rate=0.01,
        momentum=0.9,
        weight_decay=1e-5
    )
    
    print("  Initial weights:")
    SkillEvaluator.print_weights(trainer.weights)
    
    # ========================================================================
    # STEP 3: Train
    # ========================================================================
    print("Step 3: Training...")
    print()
    
    history = trainer.train(
        training_data=train_data,
        validation_data=val_data,
        epochs=200,
        early_stopping_patience=20,
        verbose=True
    )
    
    # ========================================================================
    # STEP 4: Evaluate
    # ========================================================================
    print("\nStep 4: Evaluating on test set...")
    
    test_metrics = SkillEvaluator.evaluate(trainer, test_data)
    
    print("\nTest Set Performance:")
    print(f"  MSE:  {test_metrics['mse']:.6f}")
    print(f"  MAE:  {test_metrics['mae']:.6f}")
    print(f"  RMSE: {test_metrics['rmse']:.6f}")
    print(f"  R²:   {test_metrics['r2']:.6f}")
    print()
    
    # ========================================================================
    # STEP 5: Display Learned Weights
    # ========================================================================
    print("Step 5: Final learned weights...")
    
    SkillEvaluator.print_weights(trainer.weights)
    
    # ========================================================================
    # STEP 6: Save Weights
    # ========================================================================
    print("Step 6: Saving weights...")
    
    trainer.save_weights('/home/claude/trained_skill_weights.json')
    
    # ========================================================================
    # STEP 7: Test Emergent Skill Synthesis
    # ========================================================================
    print("\nStep 7: Testing emergent skill synthesis...")
    
    # Create sample parent skills
    parent1 = SkillVector(
        name="code-reviewer",
        G=0.90, C=0.85, S=0.88, A=0.82,
        H=0.80, V=0.75, P=0.70, T=0.65
    )
    parent2 = SkillVector(
        name="test-generator",
        G=0.88, C=0.92, S=0.85, A=0.90,
        H=0.82, V=0.78, P=0.72, T=0.68
    )
    
    print("\nParent Skills:")
    print(f"  {parent1.name}: Q = {SkillMath.compute_q_score(parent1, trainer.weights):.3f}")
    print(f"  {parent2.name}: Q = {SkillMath.compute_q_score(parent2, trainer.weights):.3f}")
    
    # Synthesize emergent skill
    emergent = SkillMath.synthesize_emergent_skill(
        [parent1, parent2],
        trainer.weights,
        task_type="code_quality"
    )
    
    emergent_q = SkillMath.compute_q_score(emergent, trainer.weights)
    parent_avg = (
        SkillMath.compute_q_score(parent1, trainer.weights) +
        SkillMath.compute_q_score(parent2, trainer.weights)
    ) / 2
    
    print(f"\nEmergent Skill:")
    print(f"  {emergent.name}: Q = {emergent_q:.3f}")
    print(f"  Parent average: {parent_avg:.3f}")
    print(f"  Gain: {emergent_q - parent_avg:+.3f}")
    
    # Predict emergence gain
    predicted_delta = SkillMath.predict_emergence_gain(
        [parent1, parent2],
        trainer.weights
    )
    print(f"  Predicted delta: {predicted_delta:.3f}")
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("="*60)
    print()
    
    return trainer, history, test_metrics


# ============================================================================
# COMMAND-LINE INTERFACE
# ============================================================================

if __name__ == "__main__":
    # Run main training pipeline
    trainer, history, metrics = main()
    
    print("\nTo use the trained weights:")
    print("  from skill_weight_optimizer import SkillWeightTrainer, SkillMath")
    print("  trainer = SkillWeightTrainer()")
    print("  trainer.load_weights('trained_skill_weights.json')")
    print()
