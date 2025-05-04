#!/bin/bash

# This will compress all images in this directory src/assets/images/projects to and scale them to mach 500 px width maintaining the aspect ratio
# FN that will use ffmpeg

# Directory containing the images
IMAGE_DIR="src/assets/images/projects"

# Output directory for compressed images
OUTPUT_DIR="src/assets/images/compressed"

# Clean up the output directory before execution
if [[ -d "$OUTPUT_DIR" ]]; then
    rm -rf "$OUTPUT_DIR"
    echo "Cleaned up the compressed folder: $OUTPUT_DIR"
fi

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Start time for the entire script
start_time=$(date +%s)

# File to log skipped files
SKIPPED_FILES_LOG="skipped_files.log"
> "$SKIPPED_FILES_LOG" # Clear the log file at the start of the script

# Loop through all image files in the directory
find "$(realpath "$IMAGE_DIR")" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) -print0 | while IFS= read -r -d '' file; do
    # Log before processing the file
    echo "Processing: $file"

    # Get the relative path of the file
    relative_path="${file#$(realpath "$IMAGE_DIR")/}"
    output_path="$OUTPUT_DIR/$(dirname "$relative_path")"

    # Create the output directory structure if it doesn't exist
    mkdir -p "$output_path"

    # Get the filename without the directory and change extension to .webp
    filename=$(basename "$file")
    output_filename="${filename%.*}.webp"

    # Check if the file exists and is readable
    if [[ ! -r "$file" ]]; then
        echo "Skipped (Reason: File is unreadable or inaccessible): $file"
        echo "$file" >> "$SKIPPED_FILES_LOG" # Properly quote the file path
        echo "Status: Failed"
        continue
    fi

    # Compress and scale the image to a max width of 500px while maintaining aspect ratio, and convert to WebP
    ffmpeg -y -loglevel error -i "$file" -vf "scale=500:-1" -q:v 80 "$output_path/$output_filename" 2>/dev/null

    # Check if ffmpeg succeeded
    if [[ $? -ne 0 ]]; then
        echo "Skipped (Reason: ffmpeg failed to process the file): $file"
        echo "$file" >> "$SKIPPED_FILES_LOG" # Properly quote the file path
        echo "Status: Failed"
        continue
    fi

    # Log after processing the file
    echo "Processed: $file -> $output_path/$output_filename"
    echo "Status: Success"
done

# End time for the entire script
end_time=$(date +%s)
total_time=$((end_time - start_time))

echo "Image compression, scaling, and conversion to WebP complete."
echo "Total time: ${total_time}s."
