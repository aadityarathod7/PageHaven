const mongoose = require('mongoose');

const chapterSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bookSchema = mongoose.Schema(
  {
    bookId: {
      type: Number,
      unique: true,
    },
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      name: {
        type: String,
        required: true,
      }
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    coverImage: {
      type: String,
      default: '/uploads/default-cover.jpg',
    },
    categories: [String],
    tags: [String],
    chapters: [chapterSchema],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    downloads: {
      type: Number,
      default: 0,
    },
    readCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to auto-increment bookId
bookSchema.pre('save', async function (next) {
  if (this.isNew) {
    const lastBook = await this.constructor.findOne({}, {}, { sort: { 'bookId': -1 } });
    this.bookId = lastBook ? lastBook.bookId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);