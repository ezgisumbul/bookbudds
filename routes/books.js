'use strict';

const axios = require('axios');
const express = require('express');
const Book = require('../models/book');
const User = require('../models/user');
const bookRouter = express.Router();
const Review = require('./../models/review');
const checkBook = require('../middleware/checkBook');

bookRouter.get('/', (req, res) => {
  res.render('book/books');
});

bookRouter.post('/book/search/:search', (req, res) => {
  let searchTerm = req.body.search;
  let searchBy = req.body.searchby;

  console.log(searchBy);

  if (!searchTerm.length) {
    searchTerm = 'All Books';
  }
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}+${searchBy}:&maxResults=12&keyes&key=${process.env.GBOOKSKEY}`
    )
    .then((result) => {
      const books = result.data.items;
      res.render('book/books', { books, searchTerm, searchBy });
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

bookRouter.get('/book/:id', checkBook, (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((result) => {
      const bookTitle = result.data.volumeInfo.title;
      const book = result.data;
      const bookId = result.data.id;

      Review.find({ book: id })
        .populate('creator')
        .sort({ createdAt: -1 })
        .then((reviews) => {

          res.render('book/book-single', {
            bookTitle,
            book,
            id,
            bookId,
            reviews
          });
        })
        .catch((err) => next(err));
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

bookRouter.post('/book/:id', (req, res, next) => {

  const bookId = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then((result) => {
      Book.findOne({ bookId: bookId })
        .then((book) => {
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
                  res.redirect(`/books/book/${bookId}`);
                });
              })
              .catch((error) => {
                next(error);
              });
          } else {
            User.findOne({ _id: req.user._id, books: book._id })
              .then((match) => {
                if (match) {
                  res.redirect(`/books/book/${bookId}`);
                } else {
                  User.findByIdAndUpdate(req.user.id, {
                    $push: { books: book._id }
                  }).then(() => {
                    res.redirect(`/books/book/${bookId}`);
                  })
                    .catch((error) => {
                      next(error);
                    });
                }
              })
              .catch((error) => {
                next(error);
              });
          }
        })
    }).catch(error => {
      next(error);
    });
});


module.exports = bookRouter;
