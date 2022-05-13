const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400
    },
    reviewTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book'
    },
    bookTitle: {
      type: String,
      required: true
    },

    bookCover: {
      type: Object,
      of: Array,
      required: true
    },

    bookAuthor: {
      type: Object,
      of: Array,
      required: true
    }
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
