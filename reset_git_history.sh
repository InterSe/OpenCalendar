#!/bin/bash

# Safety first
echo "⚠️  This will permanently remove all Git history and force push a clean repo."
read -p "Proceed? (y/n): " confirm
if [[ $confirm != "y" ]]; then
  echo "❌ Aborted."
  exit 1
fi

# Set repo URL (customize if needed)
REPO_URL="https://github.com/InterSe/timetable-to-calendar.git"

echo "🧹 Deleting old Git history..."
rm -rf .git

echo "🔧 Reinitializing Git..."
git init
git remote add origin "$REPO_URL"

echo "📦 Ensuring proper .gitignore..."
cat <<EOF > .gitignore
# Node.js / React
/node_modules
/.pnp
.pnp.js
/coverage
/build
/frontend/node_modules
/frontend/build
/frontend/.cache/
/frontend/node_modules/.cache/
/node_modules/.cache/

/*.log
*.log*

# Python
venv*/
__pycache__/
*.pyc

# System
.DS_Store
Thumbs.db

# Environment
.env*
EOF

echo "✅ Staging clean files..."
git add .
git commit -m "🧼 Clean reset: remove large files and rebuild history"

echo "🚀 Force pushing clean repo to GitHub..."
git branch -M main
git push -f origin main

echo "🎉 Done! Repo was cleaned and force-pushed to GitHub."
