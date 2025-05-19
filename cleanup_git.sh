#!/bin/bash

echo "📦 Cleaning Git history of large cached files..."

# Step 0: Ensure we're in a git repo
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
  echo "❌ Error: Not a Git repository. Please run this inside your project folder."
  exit 1
fi

# Step 1: Backup the entire folder
backup_dir="../$(basename "$PWD")-backup-$(date +%Y%m%d-%H%M%S)"
echo "🗂️  Creating backup at: $backup_dir"
cp -R . "$backup_dir" || {
  echo "❌ Backup failed. Aborting."
  exit 1
}

# Step 2: Check for git-filter-repo
if ! command -v git-filter-repo &>/dev/null; then
  echo "❌ git-filter-repo not found. Attempting install via Homebrew..."
  if command -v brew &>/dev/null; then
    brew install git-filter-repo || { echo "❌ Install failed. Aborting."; exit 1; }
  else
    echo "❌ Homebrew not found. Please install git-filter-repo manually: https://github.com/newren/git-filter-repo"
    exit 1
  fi
fi

# Step 3: Confirm from user
echo "⚠️  WARNING: This will rewrite Git history and force push to GitHub."
read -p "Are you absolutely sure? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "❌ Cancelled by user."
  exit 0
fi

# Step 4: Run filter-repo cleanup
echo "🧹 Removing tracked 'node_modules' and '.cache' from history..."
git filter-repo --force --paths-from-file <(echo -e "node_modules\n.cache") --invert-paths || {
  echo "❌ Cleanup failed. Aborting."
  exit 1
}

# Step 5: Restore .gitignore and commit
echo "📘 Restoring .gitignore rules..."
cat <<EOF > .gitignore
# Node.js / React
/node_modules
/frontend/node_modules
/frontend/.cache
/frontend/build

# Python
venv*/  

# System
.DS_Store
Thumbs.db

# Local env
.env*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

git add .gitignore
git commit -m "🧹 Cleanup: Removed cached folders from history and updated .gitignore"

# Step 6: Push cleaned repo
echo "🚀 Force pushing clean repo to GitHub..."
git push origin --force || {
  echo "❌ Push failed. Please check your remote or credentials."
  exit 1
}

echo "🎉 Done! Repo cleaned, history rewritten, and backup saved at: $backup_dir"
