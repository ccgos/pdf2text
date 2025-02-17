#!/bin/bash

echo "Verifying build..."

DIST_DIR="dist/main"

if [ ! -d "$DIST_DIR" ]; then
  echo "Error: dist/main directory not found!"
  exit 1
fi

echo "Checking for required files..."
required_files=("index.html" "renderer.js" "preload.js" "index.js" "styles.css")

for file in "${required_files[@]}"; do
  if [ ! -f "$DIST_DIR/$file" ]; then
    echo "Error: $file not found in $DIST_DIR"
    exit 1
  else
    echo "✓ Found $file"
  fi
done

echo "Build verification complete!" 