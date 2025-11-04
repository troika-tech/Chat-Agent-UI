#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/troika-ai

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️  Building production version..."
npm run build

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
echo "🌐 Your site is live at:"
echo "   - https://supaai.in"
echo "   - http://3.7.68.23"
