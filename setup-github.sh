#!/bin/bash

# Initialize Git (if not already initialized)
if [ ! -d .git ]; then
  git init
  echo "Git repository initialized"
else
  echo "Git repository already exists"
fi

# Add all files
git add .

# Commit
git commit -m "Initial commit for SoftFlow Technologies"

# Add remote (if not already added)
remote_exists=$(git remote | grep origin)
if [ -z "$remote_exists" ]; then
  git remote add origin https://github.com/manish-87/Soft-Flow-Tecnologies.git
  echo "Remote 'origin' added"
else
  echo "Remote 'origin' already exists"
fi

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "Repository pushed to GitHub. Please check https://github.com/manish-87/Soft-Flow-Tecnologies"