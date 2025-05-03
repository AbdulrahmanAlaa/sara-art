export const getOptimizedImagePath = (originalPath: string, isThumbnail: boolean = false): string => {
    // If path is already processed by webpack, return as-is
    if (originalPath.startsWith('http') || originalPath.includes('/static/media/')) {
        return originalPath;
    }

    // For thumbnails, insert 'thumbnails/' into the path
    if (isThumbnail) {
        const pathParts = originalPath.split('/');
        const filename = pathParts.pop();
        if (filename) {
            const thumbnailPath = [...pathParts, 'thumbnails', filename.replace(/\.[^.]+$/, '.jpg')].join('/');
            return thumbnailPath;
        }
    }

    // Return original path for full-size images
    return originalPath;
};
