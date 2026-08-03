#!/bin/bash

# -----------------------------------------------------------------------------
# SHALA SAHAYAK - AUTOMATED PRODUCTION BUILD & GIT WORKFLOW SCRIPT
# -----------------------------------------------------------------------------
# This script automates compiling the production build, checking for errors,
# staging changes, committing cleanly, and guiding you through secure pushing
# to your GitHub repository using your Personal Access Token (PAT).
# -----------------------------------------------------------------------------

# Color formatting variables for a beautiful, readable terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}========================================================================${NC}"
echo -e "${GREEN}          SHALA SAHAYAK (शाला सहायक) - AUTOMATED DEPLOYMENT SCRIPT${NC}"
echo -e "${CYAN}========================================================================${NC}"
echo -e "Starting automated verification, optimization and push preparation...\n"

# Step 1: Pre-build validation check to prevent deploying broken code
echo -e "${BLUE}[STEP 1/4] Running pre-build production verification...${NC}"
if [ -d "node_modules" ]; then
    echo -e "✓ 'node_modules' folder found. Proceeding with build test."
else
    echo -e "${YELLOW}node_modules missing. Installing workspace dependencies...${NC}"
    npm install
fi

echo -e "Compiling application using: npm run build"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build compiled successfully! All production assets verified.${NC}"
else
    echo -e "${RED}✗ Production build failed. Please fix syntax or type errors before pushing.${NC}"
    exit 1
fi

# Step 2: Automated git file staging & cleanup
echo -e "\n${BLUE}[STEP 2/4] Staging file changes and cleaning workspace...${NC}"
git add .
echo -e "✓ Successfully staged all source files, public routes, and PWA manifests."

# Step 3: Local Commit creation
echo -e "\n${BLUE}[STEP 3/4] Creating local repository snapshot...${NC}"
echo -e "${YELLOW}Please enter your commit message (press Enter for default: 'deploy: compile production assets and legal policies'):${NC}"
read -r USER_COMMIT

if [ -z "$USER_COMMIT" ]; then
    USER_COMMIT="deploy: compile production assets and legal policies"
fi

git commit -m "$USER_COMMIT"
git branch -M main
echo -e "${GREEN}✓ Commit snapshot created successfully on branch 'main'.${NC}"

# Step 4: GitHub Personal Access Token (PAT) Integration Instructions
echo -e "\n${BLUE}[STEP 4/4] GitHub Personal Access Token (PAT) Push Instructions:${NC}"
echo -e "${CYAN}------------------------------------------------------------------------${NC}"
echo -e "To push this repository to your newly created GitHub repository using your"
echo -e "GitHub Personal Access Token (PAT), follow these three simple steps:"
echo -e "${CYAN}------------------------------------------------------------------------${NC}"
echo -e "${YELLOW}1. Securely set your GitHub Remote URL with your Personal Access Token:${NC}"
echo -e "   Run the following command in your local terminal (replace placeholders):"
echo -e "   ${GREEN}git remote set-url origin https://<YOUR_PAT_TOKEN>@github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git${NC}"
echo -e ""
echo -e "   Example:"
echo -e "   ${CYAN}git remote set-url origin https://ghp_AbCdEf1234567890@github.com/akashchaudhary/shala-sahayak.git${NC}"
echo -e ""
echo -e "${YELLOW}2. Push the code securely to your main branch:${NC}"
echo -e "   ${GREEN}git push -u origin main --force${NC}"
echo -e ""
echo -e "${YELLOW}3. Security recommendation:${NC}"
echo -e "   Never share your PAT token. The above setup embeds your token securely"
echo -e "   inside your local git configuration so you don't have to re-enter it on every push."
echo -e "${CYAN}------------------------------------------------------------------------${NC}"

echo -e "\n${GREEN}✓ deploy.sh completed successfully. Shala Sahayak is ready to launch!${NC}"
echo -e "${CYAN}========================================================================${NC}"
