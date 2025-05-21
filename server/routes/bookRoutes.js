const express = require('express');
const router = express.Router();
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
  toggleFavorite,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);

// Protected routes
router.get('/favorites', protect, getFavoriteBooks);
router.get('/:id', protect, getBookById);
router.post('/:id/progress', protect, trackReadingProgress);
router.get('/:id/progress', protect, getReadingProgress);
router.post('/:id/favorite', protect, toggleFavorite);
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