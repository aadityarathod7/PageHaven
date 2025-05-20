const { upload } = require('../config/cloudinary');

// Middleware to handle file upload
const handleUpload = (req, res, next) => {
    console.log('🚀 Upload Middleware - Request received');
    console.log('📦 Request Files:', req.files);
    console.log('📄 Single File:', req.file);

    if (!req.file) {
        console.log('⚠️ No file found in request');
        return next();
    }

    // Cloudinary automatically uploads the file and provides the URL
    console.log('☁️ Cloudinary Path:', req.file.path);
    console.log('📊 Full File Details:', {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
    });

    req.file.cloudinaryUrl = req.file.path;
    console.log('✅ Upload middleware completed');
    next();
};

module.exports = {
    upload,
    handleUpload
}; 