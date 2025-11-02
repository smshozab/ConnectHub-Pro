#!/bin/bash

# GitHub Setup Script for ConnectHub Pro
# Run this script after creating a repository on GitHub

echo "🚀 ConnectHub Pro - GitHub Setup"
echo "================================"

# Check if GitHub repository URL is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your GitHub repository URL"
    echo "Usage: ./github-setup.sh https://github.com/yourusername/connecthub-pro.git"
    exit 1
fi

REPO_URL="$1"

echo "📦 Setting up remote origin..."
git remote add origin "$REPO_URL"

echo "🔄 Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "✅ Success! Your ConnectHub Pro project is now on GitHub"
echo "📋 Next steps:"
echo "   1. Go to your GitHub repository"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Set source to 'Deploy from a branch' > 'main'"
echo "   4. Your site will be available at: https://yourusername.github.io/connecthub-pro"
echo ""
echo "🔗 Repository: $REPO_URL"
