#!/bin/bash
# Full build script for render.com
# This builds both the frontend (React) and backend (Node.js) and puts them together.

set -e

echo "=== Step 1: Install frontend dependencies ==="
cd ../artifacts/web-archiver
npm install --legacy-peer-deps || pnpm install

echo "=== Step 2: Build frontend ==="
BASE_PATH=/ npm run build || BASE_PATH=/ pnpm run build

echo "=== Step 3: Copy frontend build to render-deploy/public ==="
cd ../../render-deploy
rm -rf public
cp -r ../artifacts/web-archiver/dist/public ./public

echo "=== Step 4: Install backend dependencies ==="
npm install

echo "=== Step 5: Build backend ==="
node build.mjs

echo "=== Build complete! ==="
echo "Run with: node --enable-source-maps dist/index.mjs"
