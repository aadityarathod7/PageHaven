const { upload } = require('../config/cloudinary');

// Middleware to handle file upload
const handleUpload = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    // Cloudinary automatically uploads the file and provides the URL
    req.file.cloudinaryUrl = req.file.path;
    next();
};

module.exports = {
    upload,
    handleUpload
}; 