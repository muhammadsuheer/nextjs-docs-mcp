#!/bin/bash
# Simple, Fast, Automated Documentation Build
# Runs on Vercel automatically - NO manual steps needed

set -e

echo "📥 Downloading Next.js Documentation..."

# Function to download version quickly
download_version() {
    local VERSION=$1
    local TAG=$2
    local FOLDER="docs-data/v$VERSION"
    
    mkdir -p "$FOLDER"
    cd "$FOLDER"
    
    # Fast sparse checkout
    git init -q
    git remote add origin https://github.com/vercel/next.js.git
    git config core.sparseCheckout true
    echo "docs/*" > .git/info/sparse-checkout
    git pull --depth 1 -q origin "$TAG" 2>&1 | grep -v "warning:" || true
    
    cd ../..
    echo "✅ v$VERSION downloaded"
}

# Download all versions in parallel (FAST!)
download_version "16" "canary" &
download_version "15" "v15.1.8" &
download_version "14" "v14.2.0" &
download_version "13" "v13.5.0" &

# Wait for all downloads
wait

echo "✅ All documentation downloaded!"

