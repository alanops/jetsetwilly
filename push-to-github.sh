#!/bin/bash

echo "🚀 Pushing Jet Set Willy to GitHub..."

# Ensure we're on main branch
git checkout main

# Add the correct remote (in case it's not set)
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/alanops/jetsetwilly.git

# Push main branch
echo "📤 Pushing main branch..."
git push -u origin main

# Push develop branch
echo "📤 Pushing develop branch..."
git checkout develop
git push -u origin develop

# Switch back to main
git checkout main

echo "✅ Repository pushed successfully!"
echo "🔗 View at: https://github.com/alanops/jetsetwilly"

echo ""
echo "🛡️  Next steps:"
echo "1. Go to https://github.com/alanops/jetsetwilly/settings/branches"
echo "2. Add branch protection rule for 'main' branch:"
echo "   - ✅ Require pull request reviews before merging"
echo "   - ✅ Require status checks to pass before merging" 
echo "   - ✅ Require conversation resolution before merging"
echo "   - ✅ Include administrators"
echo ""
echo "3. Your CI/CD pipeline will automatically run on commits and PRs"
echo "4. Use 'develop' branch for active development"
echo "5. Create feature branches from 'develop' for new features"