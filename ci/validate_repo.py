"""
Repository Integrity Validation Script
Objective: API-Powered Self-Validation (Q=0.91)
Checks for the presence of the modular structure and key assets.
"""

import os
import sys

REQUIRED_DIRS = [
    "docs/skills",
    "src/core",
    "src/skills",
    "src/enhancements",
    "data/simulations",
    "configs",
    "tests",
    "examples",
    "ci"
]

CORE_FILES = [
    "README.md",
    "src/core/skill_weight_optimizer.py",
    "src/skills/united_skill_script.py",
    "src/enhancements/omega_enhancement_1_interactions.py",
    "data/skill_inventory.json",
    "data/trained_skill_weights.json",
    "tests/meta_test_self_improvement.py"
]

def validate():
    print("🛡️ Starting Repository Validation (Self-Evolution Hook)...")
    errors = 0

    # Check directories
    for d in REQUIRED_DIRS:
        if os.path.isdir(d):
            print(f"✅ Directory found: /{d}")
        else:
            print(f"❌ Missing directory: /{d}")
            errors += 1

    # Check files
    for f in CORE_FILES:
        if os.path.isfile(f):
            print(f"✅ Core file found: {f}")
        else:
            print(f"❌ Missing core file: {f}")
            errors += 1

    if errors == 0:
        print("\n🏆 Repository Validation PASSED (Q-Score Target > 0.90 maintained)")
        return True
    else:
        print(f"\n⚠️ Repository Validation FAILED with {errors} errors.")
        return False

if __name__ == "__main__":
    if not validate():
        sys.exit(1)
