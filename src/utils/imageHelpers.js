export const getOptimizedImagePath = (originalPath) => {
    // Convert the original path to .webp
    const webpPath = originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpPath;
};
