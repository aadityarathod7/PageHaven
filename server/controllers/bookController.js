const asyncHandler = require('express-async-handler');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Book = require('../models/bookModel');
const Progress = require('../models/progressModel');
const Notification = require('../models/notificationModel');

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

  // If user is logged in, get their progress for all books
  let userProgress = [];
  if (req.user) {
    userProgress = await Progress.find({
      user: req.user._id,
      book: { $in: books.map(book => book._id) }
    });
  }

  // Add isPurchased field to each book
  const booksWithPurchaseStatus = books.map(book => {
    const bookObj = book.toObject();
    const progress = userProgress.find(p => p.book.equals(book._id));
    bookObj.isPurchased = progress ? progress.isPurchased : false;
    return bookObj;
  });

  res.json({
    books: booksWithPurchaseStatus,
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

  // Get all progress entries for these books
  const allProgress = await Progress.find({
    book: { $in: books.map(book => book._id) }
  }).select('book isPurchased');

  // Add isPurchased count to each book
  const booksWithPurchaseInfo = books.map(book => {
    const bookObj = book.toObject();
    const bookProgress = allProgress.filter(p => p.book.equals(book._id));
    bookObj.purchaseCount = bookProgress.filter(p => p.isPurchased).length;
    return bookObj;
  });

  // Update existing books with sequential IDs if they don't have one
  for (let i = 0; i < booksWithPurchaseInfo.length; i++) {
    const book = booksWithPurchaseInfo[i];
    if (!book.bookId) {
      const originalBook = await Book.findById(book._id);
      originalBook.bookId = i + 1;
      await originalBook.save();
      book.bookId = i + 1;
    }
  }

  res.json(booksWithPurchaseInfo);
});

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('author', 'name');

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if the user has purchased the book
  const progress = await Progress.findOne({
    user: req.user._id,
    book: req.params.id
  });

  // Add isPurchased field to the response
  const bookResponse = book.toObject();
  bookResponse.isPurchased = progress ? progress.isPurchased : false;

  // Admin can access any book
  if (req.user.role === 'admin') {
    res.json(bookResponse);
    return;
  }

  // For non-admin users, check if book is published or user is the author
  if (book.status === 'published' || book.author._id.equals(req.user._id)) {
    // Increment read count if published
    if (book.status === 'published') {
      book.readCount += 1;
      await book.save();
    }
    res.json(bookResponse);
  } else {
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

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
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

// @desc    Upload book cover image
// @route   POST /api/books/:id/cover
// @access  Private/Admin
const uploadBookCover = asyncHandler(async (req, res) => {
  console.log('📥 Starting book cover upload process');
  console.log('📚 Book ID:', req.params.id);

  try {
    const book = await Book.findById(req.params.id);
    console.log('🔍 Found book:', book ? 'Yes' : 'No');

    if (!book) {
      console.log('❌ Book not found');
      res.status(404);
      throw new Error('Book not found');
    }

    if (!req.file) {
      console.log('❌ No file in request');
      res.status(400);
      throw new Error('Please upload an image file');
    }

    console.log('📁 Received file:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      encoding: req.file.encoding,
      mimetype: req.file.mimetype,
      path: req.file.path,
      size: req.file.size,
    });

    // Cloudinary automatically uploads the file and provides the URL in req.file.path
    const previousImage = book.coverImage;
    book.coverImage = req.file.path;
    console.log('🔄 Updating cover image:', {
      previous: previousImage,
      new: book.coverImage
    });

    const updatedBook = await book.save();
    console.log('✅ Book updated successfully');

    res.json({
      message: 'Cover image uploaded successfully',
      coverImage: updatedBook.coverImage
    });
  } catch (error) {
    console.error('❌ Error in uploadBookCover:', error);
    throw error;
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
  const { currentChapter, currentPosition } = req.body;
  const bookId = req.params.id;

  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      book: bookId
    });

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        book: bookId,
        currentChapter,
        currentPosition,
        isPurchased: false,
        isFavorite: false
      });

      // Create first-time reading notification
      await Notification.create({
        user: req.user._id,
        title: 'Started Reading!',
        message: `You've started reading "${book.title}". Enjoy your reading journey!`,
        type: 'info',
        link: `/read/${bookId}`
      });
    } else {
      // Check if this update represents a significant milestone (e.g., 25%, 50%, 75%, 100%)
      const previousProgress = progress.currentPosition;
      const newProgress = currentPosition;
      const totalLength = book.totalChapters || 100; // Fallback to 100 if totalChapters not set

      const previousPercentage = Math.floor((previousProgress / totalLength) * 100);
      const newPercentage = Math.floor((newProgress / totalLength) * 100);

      // Check if we've crossed any milestone
      const milestones = [25, 50, 75, 100];
      for (const milestone of milestones) {
        if (previousPercentage < milestone && newPercentage >= milestone) {
          await Notification.create({
            user: req.user._id,
            title: `${milestone}% Complete!`,
            message: `You're ${milestone}% through "${book.title}". Keep going!`,
            type: 'success',
            link: `/read/${bookId}`
          });
          break;
        }
      }

      progress.currentChapter = currentChapter;
      progress.currentPosition = currentPosition;
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    throw error;
  }
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

  // If user is logged in, get their progress for all books
  let userProgress = [];
  if (req.user) {
    userProgress = await Progress.find({
      user: req.user._id,
      book: { $in: books.map(book => book._id) }
    });
  }

  // Add isPurchased field to each book
  const booksWithPurchaseStatus = books.map(book => {
    const bookObj = book.toObject();
    const progress = userProgress.find(p => p.book.equals(book._id));
    bookObj.isPurchased = progress ? progress.isPurchased : false;
    return bookObj;
  });

  res.json(booksWithPurchaseStatus);
});

// @desc    Get user's favorite books
// @route   GET /api/books/favorites
// @access  Private
const getFavoriteBooks = asyncHandler(async (req, res) => {
  // Find all progress entries where isFavorite is true for the current user
  const favoriteProgress = await Progress.find({
    user: req.user._id,
    isFavorite: true
  }).select('book isPurchased');

  // Extract book IDs from progress
  const favoriteBookIds = favoriteProgress.map(progress => progress.book);

  // Fetch the actual books with their details
  const favoriteBooks = await Book.find({
    _id: { $in: favoriteBookIds }
  }).populate('author', 'name');

  // Add isPurchased field to each book
  const booksWithPurchaseStatus = favoriteBooks.map(book => {
    const bookObj = book.toObject();
    const progress = favoriteProgress.find(p => p.book.equals(book._id));
    bookObj.isPurchased = progress ? progress.isPurchased : false;
    return bookObj;
  });

  res.json(booksWithPurchaseStatus);
});

// @desc    Toggle favorite status
// @route   POST /api/books/:id/favorite
// @access  Private
const toggleFavorite = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const { isFavorite } = req.body;

  try {
    let progress = await Progress.findOne({
      user: req.user._id,
      book: bookId
    });

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error('Book not found');
    }

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        book: bookId,
        currentChapter: 0,
        currentPosition: 0,
        isPurchased: false,
        isFavorite: isFavorite
      });
    } else {
      progress.isFavorite = isFavorite;
      await progress.save();
    }

    // Create notification when adding to favorites
    if (isFavorite) {
      await Notification.create({
        user: req.user._id,
        title: 'Added to Favorites',
        message: `"${book.title}" has been added to your favorites!`,
        type: 'success',
        link: `/book/${bookId}`
      });
    }

    res.json(progress);
  } catch (error) {
    throw error;
  }
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
  toggleFavorite,
};