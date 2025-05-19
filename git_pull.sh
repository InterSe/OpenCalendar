#!/bin/bash

echo "📦 Stashing any local changes..."
git stash

echo "🔄 Pulling latest changes from GitHub..."
git pull

echo "📦 Applying your stashed changes back..."
git stash pop

echo "🎉 Done! Latest code pulled and your changes are back."
