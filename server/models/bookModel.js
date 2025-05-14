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
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
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

module.exports = mongoose.model('Book', bookSchema);