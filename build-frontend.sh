#!/bin/bash
# Run this in the Replit shell to build the frontend and copy it for deployment.
# This only needs to be done once (or when you change frontend code).
set -e

cd /home/runner/workspace

echo "=== Building React frontend ==="
PORT=9999 BASE_PATH=/ pnpm --filter @workspace/web-archiver run build

echo "=== Copying built files to render-deploy/public ==="
rm -rf render-deploy/public
cp -r artifacts/web-archiver/dist/public render-deploy/public

echo "=== Done! render-deploy/public is ready ==="
ls render-deploy/public
