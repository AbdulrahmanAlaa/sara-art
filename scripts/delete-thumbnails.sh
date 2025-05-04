#!/bin/bash

# Directory to search for thumbnails folders
PROJECT_DIR="src/assets/images/projects"

# Find and delete all thumbnails folders
find "$PROJECT_DIR" -type d -name "thumbnails" -exec rm -rf {} +

# Log completion
echo "All 'thumbnails' folders have been deleted from $PROJECT_DIR."
