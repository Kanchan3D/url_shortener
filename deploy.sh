#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Backend Deployment to Vercel         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the backend directory
if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ Error: Must run from backend directory${NC}"
    echo -e "${YELLOW}Run: cd backend && ./deploy.sh${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Pre-Deployment Checklist:${NC}"
echo ""

# Check if files exist
echo -e "${BLUE}Checking required files...${NC}"
files=("server.js" "vercel.json" "package.json" ".env")
all_exist=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        all_exist=false
    fi
done

echo ""

if [ "$all_exist" = false ]; then
    echo -e "${RED}❌ Missing required files. Fix and try again.${NC}"
    exit 1
fi

# Check environment variables
echo -e "${BLUE}Checking .env file...${NC}"
if grep -q "MONGO_URI=mongodb+srv://" .env; then
    echo -e "${GREEN}✅ MONGO_URI configured${NC}"
else
    echo -e "${RED}❌ MONGO_URI not properly configured in .env${NC}"
    all_exist=false
fi

echo ""

# Git status
echo -e "${BLUE}Git Status:${NC}"
git status --short

echo ""
echo -e "${YELLOW}Ready to deploy?${NC}"
echo -e "${BLUE}This will:${NC}"
echo "  1. Add all changes"
echo "  2. Commit with timestamp"
echo "  3. Push to current branch"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Deploying...${NC}"
    
    # Add changes
    git add .
    
    # Commit with timestamp
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    git commit -m "Deploy: Fixed Vercel serverless compatibility - $timestamp"
    
    # Push
    current_branch=$(git branch --show-current)
    echo -e "${BLUE}Pushing to $current_branch...${NC}"
    git push origin "$current_branch"
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   ✅ Code Pushed Successfully!         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}📋 Next Steps:${NC}"
    echo ""
    echo -e "${BLUE}1. Check Vercel Dashboard:${NC}"
    echo "   https://vercel.com/dashboard"
    echo ""
    echo -e "${BLUE}2. Verify Environment Variables:${NC}"
    echo "   - MONGO_URI"
    echo "   - ORIGIN_URL"
    echo "   - BASE_URL"
    echo "   - NODE_ENV (should be 'production')"
    echo ""
    echo -e "${BLUE}3. Monitor Deployment:${NC}"
    echo "   Watch the build logs in Vercel Dashboard"
    echo ""
    echo -e "${BLUE}4. Test After Deployment:${NC}"
    echo "   curl https://your-backend.vercel.app/"
    echo ""
    echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
    echo "   - Whitelist 0.0.0.0/0 in MongoDB Atlas"
    echo "   - Update frontend VITE_API_URL"
    echo ""
else
    echo ""
    echo -e "${YELLOW}Deployment cancelled.${NC}"
    exit 0
fi
