#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process for IPO Hut...${NC}"

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
  exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
  echo -e "${RED}Error: PM2 is not installed. Please install it with 'npm install -g pm2'.${NC}"
  exit 1
fi

# Pull latest changes from git if in a git repository
if [ -d ".git" ]; then
  echo -e "${YELLOW}Pulling latest changes from git...${NC}"
  git pull
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Restart the application with PM2
echo -e "${YELLOW}Deploying with PM2 in production mode...${NC}"
pm2 startOrRestart ecosystem.config.js --env production

# Display status
echo -e "${YELLOW}Checking deployment status...${NC}"
pm2 status

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}To monitor logs, run: 'pm2 logs ipo-hut'${NC}"
echo -e "${YELLOW}To monitor performance, run: 'pm2 monit'${NC}" 