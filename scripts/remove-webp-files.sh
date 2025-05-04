#!/bin/bash

# Directory containing the images
IMAGE_DIR="src/assets/images/projects"

# Find and remove all .webp files in the directory
find "$IMAGE_DIR" -type f -iname "*.webp" -exec rm -v {} \;

echo "All .webp files have been removed from $IMAGE_DIR."
