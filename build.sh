#!/bin/bash

set -e  # Exit on any error

echo "Cleaning up..."
rm -rf dist
rm -rf node_modules

echo "Installing dependencies..."
npm install

echo "Rebuilding native modules..."
npm run rebuild

echo "Building application..."
npm run build:main
npm run build:preload
npm run build:renderer

echo "Verifying build..."
if [ ! -f "dist/main/index.js" ]; then
    echo "Error: index.js not found"
    exit 1
fi

if [ ! -f "dist/main/preload.js" ]; then
    echo "Error: preload.js not found"
    exit 1
fi

if [ ! -f "dist/main/index.html" ]; then
    echo "Error: index.html not found"
    exit 1
fi

if [ ! -f "dist/main/renderer.js" ]; then
    echo "Error: renderer.js not found"
    exit 1
fi

echo "Build successful! Starting application..."
NODE_ENV=development npm start 