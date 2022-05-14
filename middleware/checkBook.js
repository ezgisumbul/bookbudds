'use strict';

const User = require('../models/user');
const Book = require('../models/book');

const checkBook = (req, res, next) => {
  const bookId = req.params.id;

  let isLogged;
  let bookCheck;

  if (req.user) {
    isLogged = true;
  } else {
    isLogged = false;
  }
  res.locals.isLogged = isLogged;
  console.log(isLogged)

  console.log(req.user._id);

  // CHECK if Book exists in the Books collection
  Book.findOne({ bookId: bookId })
    .then((book) => {
      if (book) {
        // CHECK if Book is already saved in User
        //User.findOne({ books: book._id })
        User.find(req.user._id, { books: book._id })
          .then((check) => {

            if (check) {
              bookCheck = true;
              console.log('book found');
            } else {
              bookCheck = false;
              console.log('book not found');
            }
            res.locals.bookCheck = bookCheck;
          })
      } else {
        console.log("The book is not yet is the Books collection")
      }
    });
  next();
}

module.exports = checkBook;