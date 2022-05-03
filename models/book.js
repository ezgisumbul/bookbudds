'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'no entry'
  },
  authors: {
    type: Array,
    of: String
  },
  description: {
    type: String
  },
  categories: {
    type: Array,
    of: String

  },
  publishedDate: {
    type: Date
  },

  averageRating: {
    type: Number

  },
  pageCount: {
    type: Number
  },
  imageLinks: {
    type: Object,
    of: Array
  }

}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;