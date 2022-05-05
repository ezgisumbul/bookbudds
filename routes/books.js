'use strict';

const axios = require('axios');
const express = require('express');
const Book = require('../models/book');
const User = require('../models/user');
const bookRouter = express.Router();
const Review = require('./../models/review');

bookRouter.get('/', (req, res) => {
  res.render('books');
});

bookRouter.get('/book/:id', (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((result) => {
      const book = result.data;
      //console.log(book);
      res.render('book-single', { book });
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

bookRouter.get('/book/:id', (req, res, next) => {
  console.log('hello');
  const bookId = req.params.id;
  console.log(bookId);
  Review
    //.select({ "message", book: bookId })
    .find({ book: bookId })
    .populate('creator')
    .then((reviews) => {
      console.log(reviews);
      res.render('book-single', { reviews, bookId });
    })

    .catch((error) => {
      next(error);
    });
});

bookRouter.post('/book/:id', (req, res, next) => {
  const bookId = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then((result) => {
      Book.findOne({ bookId: bookId })
        .then((book) => {
          console.log(book);
          if (!book) {
            const {
              title,
              authors,
              description,
              categories,
              publishedDate,
              averageRating,
              pageCount,
              imageLinks
            } = result.data.volumeInfo;
            Book.create({
              bookId,
              title,
              authors,
              description,
              categories,
              publishedDate,
              averageRating,
              pageCount,
              imageLinks
            })
              .then((book) => {
                User.findByIdAndUpdate(req.user.id, {
                  $push: { books: book._id }
                }).then(() => {
                  res.json('book is saved to your list');
                });
              })
              .catch((error) => {
                console.log(error);
                next(error);
              });
          } else {
            res.json('You already have this book in your list ');
          }
        })
        .catch((error) => {
          console.log(error);
          next(error);
        });
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

// bookRouter.post('/book/:id', (req, res, next) => {
//   const { data } = req.body;
//   Book.create({
//     data,
//     user: req.user.id
//   })
//     .then(() => {
//       res.redirect('/');
//     })
//     .catch((error) => {
//       next(error)

//     });
// });

module.exports = bookRouter;
