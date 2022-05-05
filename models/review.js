const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Book'
    }
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
