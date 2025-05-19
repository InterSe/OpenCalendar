#!/bin/bash

# Set working directory to the script's location
cd "$(dirname "$0")" || exit 1

# ---------- Start Backend ----------
echo "🚀 Starting Backend..."

cd backend || { echo "❌ 'backend' directory not found!"; exit 1; }

# Choose the right venv activation script
if [[ "$OSTYPE" == "darwin"* ]]; then
  source venv/bin/activate  # macOS/Linux
else
  source venv/Scripts/activate  # Windows Git Bash or WSL
fi

# Check if port 5000 is already in use
if lsof -i :5000 >/dev/null 2>&1; then
  echo "⚠️  Port 5000 is already in use. Backend not started."
else
  python app.py &
  echo "✅ Backend started on port 5000"
fi

# ---------- Start Frontend ----------
echo "🌐 Starting Frontend..."

cd ../frontend || { echo "❌ 'frontend' directory not found!"; exit 1; }

if [[ ! -f package.json ]]; then
  echo "❌ package.json not found in frontend/"
  exit 1
fi

# Start React app
npm start
