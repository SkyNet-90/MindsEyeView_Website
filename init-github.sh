#!/bin/bash

# Mind's Eye View - GitHub Initialization Script
# This script helps you push the project to GitHub

echo "🎸 Mind's Eye View - GitHub Setup"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📝 Before continuing, make sure you've:"
echo "   1. Created a new repository on GitHub"
echo "   2. Named it something like 'MindsEyeView_Website'"
echo "   3. Made it Private (recommended)"
echo ""

read -p "Have you created the GitHub repository? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "⚠️  Please create a GitHub repository first at: https://github.com/new"
    echo "Then run this script again."
    exit 1
fi

echo ""
read -p "Enter your GitHub username: " github_username
read -p "Enter the repository name (e.g., MindsEyeView_Website): " repo_name

echo ""
echo "📋 Checking files..."

# Add .gitignore if needed
if [ ! -f ".gitignore" ]; then
    echo "⚠️  .gitignore not found! This is important to protect sensitive data."
    exit 1
fi

# Check for .env file
if [ -f ".env" ]; then
    echo "✅ .env file found (will be ignored by git)"
fi

echo ""
echo "📤 Adding files to git..."
git add .

echo ""
echo "💬 Creating initial commit..."
git commit -m "Initial commit: Mind's Eye View website

Features:
- Next.js 14 with TypeScript
- Admin panel with authentication
- Event management with calendar
- Photo and video galleries
- Newsletter signup
- Contact form with Formspree
- Docker deployment ready
- Cloudflare Tunnel support
- Auto-deployment via GitHub Actions"

echo ""
echo "🔗 Adding remote repository..."
git remote add origin "https://github.com/$github_username/$repo_name.git"

echo ""
echo "🌿 Creating main branch..."
git branch -M main

echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Go to: https://github.com/$github_username/$repo_name"
    echo "2. Verify files are there"
    echo "3. Check Settings → Actions → Enable workflows"
    echo "4. Continue with deployment following QUICK_DEPLOY.md"
    echo ""
    echo "📚 Important Files:"
    echo "   - QUICK_DEPLOY.md (40-minute deployment guide)"
    echo "   - HOMELAB_DEPLOYMENT.md (detailed instructions)"
    echo "   - PRE_DEPLOYMENT_CHECKLIST.md (deployment checklist)"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "   - GitHub repository exists"
    echo "   - You have access to the repository"
    echo "   - Your GitHub credentials are correct"
    echo ""
    echo "You can try pushing manually:"
    echo "   git push -u origin main"
fi
