import json
import random

def ai_compile_code(problem, code, lang):
    # Dummy compiler for demo
    # In prod, use judge0 or restricted container
    success = random.choice([True, False])
    score = 100 if success else 0
    return json.dumps({"status": "PASS" if success else "FAIL", "score": score, "output": "Compiled successfully" if success else "Syntax Error"})
