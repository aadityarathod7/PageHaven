const asyncHandler = require('express-async-handler');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Book = require('../models/bookModel');
const Progress = require('../models/progressModel');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const { title, description, categories, tags, status, coverImage, authorName, price } = req.body;

  const book = await Book.create({
    title,
    description,
    author: {
      _id: req.user._id,
      name: authorName || req.user.name // Use provided author name or fall back to user's name
    },
    categories: categories ? categories : [],
    tags: tags ? tags : [],
    status: status || 'draft',
    coverImage: coverImage || '/uploads/default-cover.jpg',
    price: Number(price) || 0,
    chapters: [],
  });

  res.status(201).json(book);
});

// @desc    Get all published books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const pageSize = req.query.limit ? Number(req.query.limit) : 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
      $or: [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ],
    }
    : {};

  const count = await Book.countDocuments({ ...keyword, status: 'published' });
  const books = await Book.find({ ...keyword, status: 'published' })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('author', 'name')
    .sort({ createdAt: -1 });

  res.json({
    books,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get all books (including drafts for admin)
// @route   GET /api/books/admin
// @access  Private/Admin
const getAdminBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({})
    .populate('author', 'name')
    .sort({ createdAt: -1 });
  res.json(books);
});

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  console.log('Fetching book with ID:', req.params.id);
  console.log('User:', req.user);

  const book = await Book.findById(req.params.id).populate('author', 'name');

  if (!book) {
    console.log('Book not found');
    res.status(404);
    throw new Error('Book not found');
  }

  // Admin can access any book
  if (req.user.role === 'admin') {
    console.log('Admin access granted');
    res.json(book);
    return;
  }

  // For non-admin users, check if book is published or user is the author
  if (book.status === 'published' || book.author._id.equals(req.user._id)) {
    console.log('Access granted - book is published or user is author');
    // Increment read count if published
    if (book.status === 'published') {
      book.readCount += 1;
      await book.save();
    }
    res.json(book);
  } else {
    console.log('Access denied - book is not published and user is not author');
    res.status(403);
    throw new Error('Not authorized to access this book');
  }
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    authorName,
    categories,
    tags,
    status,
    chapters,
    price,
  } = req.body;

  console.log('Update request body:', req.body);

  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  try {
    // Validate required fields
    if (!title || !description) {
      res.status(400);
      throw new Error('Title and description are required');
    }

    // Update basic fields
    book.title = title;
    book.description = description;
    book.price = Number(price) || 0;

    // Update author name if provided
    if (authorName) {
      book.author = {
        ...book.author,
        name: authorName
      };
    }

    // Handle categories
    book.categories = Array.isArray(categories)
      ? categories
      : categories.split(',').map(cat => cat.trim()).filter(Boolean);

    // Handle tags
    book.tags = Array.isArray(tags)
      ? tags
      : tags.split(',').map(tag => tag.trim()).filter(Boolean);

    // Validate status
    if (status && !['draft', 'published'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    book.status = status;

    // Validate and update chapters
    if (chapters) {
      if (!Array.isArray(chapters)) {
        res.status(400);
        throw new Error('Chapters must be an array');
      }

      // Validate each chapter
      chapters.forEach((chapter, index) => {
        if (!chapter.title || !chapter.content) {
          throw new Error(`Chapter ${index + 1} is missing title or content`);
        }
      });

      book.chapters = chapters;
    }

    console.log('Saving book with data:', book);

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(error.status || 400);
    throw new Error(error.message || 'Error updating book');
  }
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await Book.findByIdAndDelete(req.params.id);
    // Also remove any reading progress
    await Progress.deleteMany({ book: req.params.id });
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Upload book cover
// @route   POST /api/books/:id/cover
// @access  Private/Admin
const uploadBookCover = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No image file uploaded');
  }

  try {
    // Update the book's cover image path
    book.coverImage = `/uploads/${req.file.filename}`;
    const updatedBook = await book.save();

    console.log('Updated book with cover image:', updatedBook);

    res.json({
      message: 'Cover image uploaded successfully',
      coverImage: updatedBook.coverImage
    });
  } catch (error) {
    console.error('Error saving cover image:', error);
    res.status(500);
    throw new Error('Error saving cover image');
  }
});

// @desc    Download book as PDF
// @route   GET /api/books/:id/download/pdf
// @access  Private
const downloadBookAsPDF = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author', 'name');

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  if (book.status !== 'published' &&
    (!req.user || (req.user.role !== 'admin' && !book.author._id.equals(req.user._id)))) {
    res.status(403);
    throw new Error('Not authorized to download this book');
  }

  // Generate PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Create HTML content from book data
  let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { text-align: center; margin-bottom: 40px; }
          .chapter { margin-bottom: 30px; }
          .chapter-title { font-size: 24px; margin-bottom: 15px; }
          .author { text-align: center; margin-bottom: 40px; font-style: italic; }
        </style>
      </head>
      <body>
        <h1>${book.title}</h1>
        <div class="author">By ${book.author.name}</div>
        ${book.chapters.map(chapter => `
          <div class="chapter">
            <div class="chapter-title">${chapter.title}</div>
            <div>${chapter.content}</div>
          </div>
        `).join('')}
      </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Create downloads directory if it doesn't exist
  const downloadsDir = path.join(__dirname, '../../downloads');
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  const pdfPath = path.join(downloadsDir, `${book._id}.pdf`);
  await page.pdf({ path: pdfPath, format: 'A4' });
  await browser.close();

  // Increment download count
  book.downloads += 1;
  await book.save();

  // Send the file
  res.download(pdfPath, `${book.title.replace(/\s+/g, '_')}.pdf`, err => {
    if (err) {
      console.error(err);
    }
    // Delete the file after sending
    fs.unlinkSync(pdfPath);
  });
});

// @desc    Track reading progress
// @route   POST /api/books/:id/progress
// @access  Private
const trackReadingProgress = asyncHandler(async (req, res) => {
  const { currentChapter, currentPosition, isFavorite } = req.body;

  // Find existing progress or create new
  let progress = await Progress.findOne({
    user: req.user._id,
    book: req.params.id,
  });

  if (progress) {
    progress.currentChapter = currentChapter || progress.currentChapter;
    progress.currentPosition = currentPosition || progress.currentPosition;
    progress.isFavorite = isFavorite !== undefined ? isFavorite : progress.isFavorite;
    await progress.save();
  } else {
    progress = await Progress.create({
      user: req.user._id,
      book: req.params.id,
      currentChapter,
      currentPosition,
      isFavorite: isFavorite || false,
    });
  }

  res.json(progress);
});

// @desc    Get user's reading progress
// @route   GET /api/books/:id/progress
// @access  Private
const getReadingProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    book: req.params.id,
  });

  if (progress) {
    res.json(progress);
  } else {
    res.json({
      currentChapter: 0,
      currentPosition: 0,
      isFavorite: false,
    });
  }
});

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
const searchBooks = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const searchQuery = {
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { categories: { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } }
    ]
  };

  const books = await Book.find(searchQuery)
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(books);
});

// @desc    Get user's favorite books
// @route   GET /api/books/favorites
// @access  Private
const getFavoriteBooks = asyncHandler(async (req, res) => {
  // Find all progress entries where isFavorite is true for the current user
  const favoriteProgress = await Progress.find({
    user: req.user._id,
    isFavorite: true
  }).select('book');

  // Extract book IDs from progress
  const favoriteBookIds = favoriteProgress.map(progress => progress.book);

  // Fetch the actual books with their details
  const favoriteBooks = await Book.find({
    _id: { $in: favoriteBookIds }
  }).populate('author', 'name');

  res.json(favoriteBooks);
});

module.exports = {
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
};