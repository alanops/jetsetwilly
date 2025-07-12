#!/bin/bash

echo "🚀 Pushing Jet Set Willy to GitHub with PAT..."

# Check if PAT is provided
if [ -z "$GITHUB_PAT" ]; then
    echo "❌ Please set your GitHub Personal Access Token:"
    echo "export GITHUB_PAT=your_token_here"
    echo "Then run this script again"
    exit 1
fi

# Set remote with PAT embedded
git remote set-url origin https://$GITHUB_PAT@github.com/alanops/jetsetwilly.git

echo "📤 Pushing main branch..."
git push -u origin main

echo "📤 Pushing develop branch..."
git checkout develop
git push -u origin develop

# Switch back to main
git checkout main

# Remove PAT from remote URL for security
git remote set-url origin https://github.com/alanops/jetsetwilly.git

echo "✅ Repository pushed successfully!"
echo "🔗 View at: https://github.com/alanops/jetsetwilly"

echo ""
echo "🛡️  Next steps:"
echo "1. Go to https://github.com/alanops/jetsetwilly/settings/branches"
echo "2. Add branch protection rule for 'main' branch"
echo "3. Your CI/CD pipeline will automatically run!"