# update_requirements.py
import os
import subprocess
import sys

venv_active = (
    hasattr(sys, 'real_prefix') or
    (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix)
)

if not venv_active:
    print("⚠️  Please activate your virtual environment before running this script.")
    sys.exit(1)

print("📦 Freezing current environment to requirements.txt...")
with open("requirements.txt", "w") as f:
    subprocess.run([sys.executable, "-m", "pip", "freeze"], stdout=f)

print("✅ requirements.txt updated successfully.")
