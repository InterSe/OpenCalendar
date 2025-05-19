#!/bin/bash

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Install dependencies if not already present
echo "Installing dependencies..."
npm install

# Build the production-ready frontend
echo "Building frontend..."
npm run build

# Optionally serve locally (comment out if deploying to Vercel)
# echo "Serving frontend locally on http://localhost:3000"
# npx serve -s build
