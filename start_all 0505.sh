#!/bin/bash

# Start Backend
echo "🚀 Starting Backend..."
cd "$(dirname "$0")/backend"
source venv/bin/activate
python app.py &

# Start Frontend
echo "🌐 Starting Frontend..."
cd "$(dirname "$0")/frontend"
npm start

