import { API_URL } from '../config/config';

/**
 * Formats an image URL to ensure it includes the full API URL when needed
 * @param {string} imageUrl - The image URL to format
 * @param {string} [defaultImage='/uploads/default-cover.jpg'] - The default image to use if no URL is provided
 * @returns {string} The formatted image URL
 */
export const getImageUrl = (imageUrl, defaultImage = '/uploads/default-cover.jpg') => {
    if (!imageUrl) {
        return `${API_URL}${defaultImage}`;
    }

    // If it's already a full URL (starts with http/https), return as is
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // If it starts with a slash, append to API_URL
    if (imageUrl.startsWith('/')) {
        return `${API_URL}${imageUrl}`;
    }

    // Otherwise, append with a slash
    return `${API_URL}/${imageUrl}`;
};

/**
 * Creates an error handler for images that will replace broken images with a default one
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/uploads/default-cover.jpg';
}; 