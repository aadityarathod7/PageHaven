const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createBook,
  getBooks,
  getAdminBooks,
  getBookById,
  updateBook,
  deleteBook,
  uploadBookCover,
  downloadBookAsPDF,
  trackReadingProgress,
  getReadingProgress,
  searchBooks,
  getFavoriteBooks,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);

// Protected routes
router.get('/favorites', protect, getFavoriteBooks);
router.get('/:id', protect, getBookById);
router.post('/:id/progress', protect, trackReadingProgress);
router.get('/:id/progress', protect, getReadingProgress);
router.get('/:id/download/pdf', protect, downloadBookAsPDF);

// Admin routes
router.get('/admin/books', protect, admin, getAdminBooks);
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);
router.post(
  '/:id/cover',
  protect,
  admin,
  upload.single('image'),
  uploadBookCover
);

module.exports = router;