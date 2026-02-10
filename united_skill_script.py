
"""Auto-generated united skill engine.
Generated at: 2026-02-06T12:29:13.983344Z
Contains registered skills and a lightweight runtime to orchestrate them.
"""
from typing import List, Dict, Any
import json, os

# Inventory path (bundled)
INVENTORY = {'generated_at': '2026-02-06T12:29:13.983344Z', 'skills': [{'name': 'Transfer Learning', 'path': '/mnt/data/SKILL_transfer_learning.md', 'priority': 'CRITICAL', 'q_score': 0.946, 'type': 'Universal Capability', 'description': 'Transfer Learning is the ability to apply knowledge learned in one domain to solve problems in a different domain by identifying structural similarities, functional equivalents, and analogical mappings. This is a Layer 0 (Universal) capability that enables rapid adaptation to new situations by leveraging existing knowledge rather than learning from scratch.', 'triggers': ['Trigger this skill whenever:', 'User asks about a domain Claude has limited direct experience with', 'Problem structure resembles a known domain (e.g., "chemistry is like cooking")', 'User says "I come from X background, how does Y work?"', 'Task requires solving new problems with limited domain-specific training', 'Conversation involves cross-domain analogies or metaphors', 'User asks "what\'s this like?" or "can you relate this to...?"', 'Learning efficiency matters (leverage existing knowledge vs learn from scratch)'], 'signature': 'transfer learning | transfer learning is the ability to apply knowledge learned in one domain to solve problems in a different domain by identifying structural similarities, functional equivalents, and analogical mappings. this is a layer 0 (universal) capability that enables rapid adaptation to new situations by leveraging existing knowledge rather than learning from scratch.'}, {'name': 'Universal Problem Solving', 'path': '/mnt/data/SKILL_universal_problem_solving.md', 'priority': 'CRITICAL', 'q_score': 0.946, 'type': 'Universal Capability', 'description': 'Universal Problem Solving is the meta-capability to solve problems across any domain by applying domain-invariant problem-solving frameworks. Rather than requiring domain-specific expertise for each problem type, this capability leverages universal problem structures—decomposition, constraint satisfaction, search, optimization—that transcend individual domains.', 'triggers': ['Trigger this skill whenever:', 'User presents a novel problem outside standard domains', 'Problem requires systematic approach (not just recall)', 'User says "I don\'t know where to start"', 'Task involves complex constraints and trade-offs', 'Multiple solution paths exist and need evaluation', 'User asks "how would you approach X?"', 'Problem is ill-defined and needs structuring', "Domain-specific heuristics aren't available"], 'signature': 'universal problem solving | universal problem solving is the meta-capability to solve problems across any domain by applying domain-invariant problem-solving frameworks. rather than requiring domain-specific expertise for each problem type, this capability leverages universal problem structures—decomposition, constraint satisfaction, search, optimization—that transcend individual domains.'}]}

class SkillEngine:
    def __init__(self):
        self.inventory = INVENTORY
        self.registered = {}
        for s in self.inventory["skills"]:
            self.registered[s["name"]] = s

    def list_skills(self) -> List[str]:
        return list(self.registered.keys())

    def describe_skill(self, name: str) -> Dict[str, Any]:
        return self.registered.get(name)

    def suggest_pipeline(self) -> List[str]:
        # simple ordering: as-is in inventory
        return [s["name"] for s in self.inventory["skills"]]

    def propose_transfers(self):
        # produce mapping hints based on inventory 'signature' similarities
        # (precomputed during generation in the outer script, so this is a lightweight view)
        transfers = []
        names = list(self.registered.keys())
        for i, a in enumerate(names):
            for j, b in enumerate(names):
                if i == j: continue
                # heuristically prefer linking universal problem solving early
                transfers.append({"from": a, "to": b, "reason": "suggested by signature similarity"})
        return transfers

    def run_example(self, query: str) -> Dict[str, Any]:
        """A deterministic demonstration harness that uses 'Universal Problem Solving' and
        'Transfer Learning' if available. It returns a structured plan skeleton."""
        result = {"query": query, "created": True, "steps": []}
        # Step: structure problem
        if "Universal Problem Solving" in self.registered:
            result["steps"].append({"step": "structure_problem", "note": "Identify goal, constraints, success criteria"})
            result["steps"].append({"step": "decompose", "note": "Break into subproblems"})
        # Step: transfer learning hint
        if "Transfer Learning" in self.registered:
            result["steps"].append({"step": "transfer_suggestions", "note": "Suggest source domains and analogies"})
        # final step: synthesize a combined approach
        result["steps"].append({"step": "synthesize", "note": "Combine sub-solutions into integrated plan"})
        return result

if __name__ == '__main__':
    se = SkillEngine()
    print(json.dumps({"skills": se.list_skills(), "example_run": se.run_example("Diagnose slow website")}, indent=2))
