#!/bin/bash

# File containing the list of skipped files from the previous run
SKIPPED_FILES_LOG="skipped_files.log"
TEMP_SKIPPED_FILES_LOG="temp_skipped_files.log"

# Output directory for compressed images
OUTPUT_DIR="src/assets/images/compressed"

# Maximum dimension for resizing
MAX_DIM=8000

# Check if the skipped files log exists
if [[ ! -f "$SKIPPED_FILES_LOG" ]]; then
    echo "No skipped files log found. Please run the main script first."
    exit 1
fi

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Start time for the script
start_time=$(date +%s)

# Clear the temporary skipped files log
> "$TEMP_SKIPPED_FILES_LOG"

# Loop through each file in the skipped files log
while IFS= read -r file; do
    # Skip empty or invalid file paths
    if [[ -z "$file" ]]; then
        echo "Skipped (Reason: Empty or invalid file path)"
        continue
    fi

    # Ensure the file path is absolute
    if [[ ! "$file" = /* ]]; then
        file="$(realpath "$file" 2>/dev/null)"
        if [[ -z "$file" || ! -e "$file" ]]; then
            echo "Skipped (Reason: Invalid or non-existent file path): $file"
            echo "$file" >> "$TEMP_SKIPPED_FILES_LOG"
            continue
        fi
    fi

    # Log before processing the file
    echo "Processing: $file"

    # Ensure the file exists and is readable
    if [[ ! -r "$file" ]]; then
        echo "Still Skipped (Reason: File is unreadable or inaccessible): $file"
        echo "$file" >> "$TEMP_SKIPPED_FILES_LOG"
        continue
    fi

    # Get image dimensions using ImageMagick's `identify`
    if ! dimensions=$(identify -format "%w %h" "$file" 2>/dev/null); then
        echo "Skipped (could not read image dimensions): $file"
        echo "$file" >> "$TEMP_SKIPPED_FILES_LOG"
        continue
    fi

    width=$(echo $dimensions | cut -d' ' -f1)
    height=$(echo $dimensions | cut -d' ' -f2)

    # Resize the image if it exceeds the maximum dimensions
    if (( width > MAX_DIM || height > MAX_DIM )); then
        echo "Resizing large image: $width x $height"
        temp_resized="${file%.*}_resized.${file##*.}"
        convert "$file" -resize "${MAX_DIM}x${MAX_DIM}>" "$temp_resized"
        input_file="$temp_resized"
    else
        input_file="$file"
    fi

    # Get the relative path of the file
    relative_path="${file#$(realpath src/assets/images/projects)/}"
    output_path="$OUTPUT_DIR/$(dirname "$relative_path")"

    # Create the output directory structure if it doesn't exist
    mkdir -p "$output_path"

    # Get the filename without the directory and change extension to .webp
    filename=$(basename "$file")
    output_filename="${filename%.*}.webp"

    # Attempt to compress and convert the image to WebP
    ffmpeg_log=$(mktemp) # Temporary file to store ffmpeg logs
    ffmpeg -y -loglevel error -i "$input_file" -vf "scale=8000:-1" -q:v 80 "$output_path/$output_filename" 2>"$ffmpeg_log"

    # Check if ffmpeg succeeded
    if [[ $? -ne 0 ]]; then
        echo "Still Skipped (Reason: ffmpeg failed to process the file): $file"
        echo "ffmpeg log:"
        cat "$ffmpeg_log" # Output the ffmpeg error log
        echo "$file" >> "$TEMP_SKIPPED_FILES_LOG"
        echo "Status: Failed"
        rm -f "$ffmpeg_log" # Clean up the temporary log file
        [[ "$input_file" == *_resized.* ]] && rm "$input_file" # Cleanup resized file if used
        continue
    fi

    # Log after processing the file
    echo "Reprocessed: $file -> $output_path/$output_filename"
    echo "Status: Success"
    rm -f "$ffmpeg_log" # Clean up the temporary log file
    [[ "$input_file" == *_resized.* ]] && rm "$input_file" # Cleanup resized file if used
done < "$SKIPPED_FILES_LOG"

# Replace the skipped files log with the updated temporary log
mv "$TEMP_SKIPPED_FILES_LOG" "$SKIPPED_FILES_LOG"

# End time for the script
end_time=$(date +%s)
total_time=$((end_time - start_time))

# Display summary
echo "Reprocessing of skipped files complete."
echo "Total time: ${total_time}s."

# Clean up the skipped files log if all files were successfully reprocessed
if [[ ! -s "$SKIPPED_FILES_LOG" ]]; then
    rm -f "$SKIPPED_FILES_LOG"
    echo "All skipped files have been successfully reprocessed. Skipped files log has been removed."
fi
