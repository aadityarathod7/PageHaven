const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

console.log('🌟 Initializing Cloudinary configuration');

// Check if environment variables are set
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  console.log('✅ Cloudinary configured successfully');
  console.log('☁️ Using cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
} catch (error) {
  console.error('❌ Error configuring Cloudinary:', error);
  throw error;
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'book-covers', // This will create a folder in your Cloudinary account
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    transformation: [{ width: 500, height: 750, crop: 'limit' }] // Optional: resize images
  }
});

console.log('📁 Cloudinary storage configured with folder: book-covers');

const upload = multer({ storage: storage });

module.exports = {
  upload,
  cloudinary
}; 