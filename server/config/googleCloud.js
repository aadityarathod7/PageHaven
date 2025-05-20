const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

module.exports = {
    bucket,
    getPublicUrl: (filename) => `https://storage.googleapis.com/${bucketName}/${filename}`
}; 