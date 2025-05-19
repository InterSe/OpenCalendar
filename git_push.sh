#!/bin/bash

# Auto commit message with date and time
commit_message="📝 Auto commit: $(date '+%Y-%m-%d %H:%M:%S')"

echo "🔎 Checking for node_modules or .cache accidentally tracked..."
# Safety check — warn if node_modules or .cache are tracked
tracked_files=$(git ls-files | grep -E 'node_modules|\.cache')
if [ -n "$tracked_files" ]; then
  echo "⚠️  Warning: Some large folders are still tracked:"
  echo "$tracked_files"
else
  echo "✅ No tracked node_modules or .cache"
fi

echo "📦 Staging all changes..."
git add .

echo "✅ Committing..."
git commit -m "$commit_message" || echo "⚠️  Nothing to commit."

echo "🚀 Pushing to GitHub..."

# Check if the branch has an upstream
if git rev-parse --abbrev-ref --symbolic-full-name @{u} > /dev/null 2>&1; then
  git push
else
  echo "ℹ️  Setting upstream for the first time..."
  git push --set-upstream origin $(git rev-parse --abbrev-ref HEAD)
fi

echo "🎉 Done! Commit message was: $commit_message"
