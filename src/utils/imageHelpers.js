export const getOptimizedImagePath = (originalPath) => {
    // If the path is already a webpack processed URL, return it as-is
    if (originalPath.startsWith('http') || originalPath.includes('/static/media/')) {
        return originalPath;
    }

    // Only convert direct file paths
    const webpPath = originalPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
    return webpPath;
};
