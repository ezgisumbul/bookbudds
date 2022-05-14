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

  // CHECK if Book exists in the Books collection
  Book.findOne({ bookId: bookId })
    .then((book) => {
      if (isLogged) {
        // CHECK multiple conditions on FindOne: user-id + the book +id
        User.findOne({ _id: req.user._id, books: book._id })
          .then((user) => {
            // If we get a user document,
            // that means we have a user in the database
            // with our user id and the book id in that same document
            if (user) {
              bookCheck = true;
            } else {
              bookCheck = false;
            }
            res.locals.bookCheck = bookCheck;
          })
      } else {
        console.log("The book is not yet is the Books collection")
      }
    })
  next();
}
module.exports = checkBook;