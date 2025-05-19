#!/bin/bash

# Auto commit message with date and time
commit_message="Auto commit: $(date '+%Y-%m-%d %H:%M:%S')"

echo "📦 Staging all changes..."
git add .

echo "✅ Committing changes..."
git commit -m "$commit_message"

echo "🚀 Pushing to GitHub..."
git push

echo "🎉 Done! Commit message was: $commit_message"
