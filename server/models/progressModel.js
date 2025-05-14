const mongoose = require('mongoose');

const progressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book',
    },
    currentChapter: {
      type: Number,
      default: 0,
    },
    currentPosition: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for efficient favorites lookup
progressSchema.index({ user: 1, isFavorite: 1 });

module.exports = mongoose.model('Progress', progressSchema);