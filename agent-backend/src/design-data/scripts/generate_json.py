#!/usr/bin/env python3
"""
Thin JSON wrapper around the design system generator.
Called from Node.js via child_process.execFile.
Outputs the raw dict as JSON to stdout.
"""

import json
import sys
from design_system import DesignSystemGenerator

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: generate_json.py <query>"}))
        sys.exit(1)

    query = sys.argv[1]
    generator = DesignSystemGenerator()
    result = generator.generate(query)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
