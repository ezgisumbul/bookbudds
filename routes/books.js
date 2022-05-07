'use strict';

const axios = require('axios');
const express = require('express');
const { populate } = require('../models/book');
const Book = require('../models/book');
const User = require('../models/user');
const bookRouter = express.Router();
const Review = require('./../models/review');

bookRouter.get('/', (req, res) => {
  res.render('books');
});

bookRouter.post('/book/search/:search', (req, res) => {
  let searchTerm = req.body.search;
  let searchBy = req.body.searchby;

  if (!searchTerm.length) {
    searchTerm = 'All Books';
  }
  axios
    .get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}+${searchBy}:&maxResults=12&keyes&key=${process.env.GBOOKSKEY}`
    )
    .then((result) => {
      const books = result.data.items;
      res.render('books', { books, searchTerm });
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

/*bookRouter.get('/book/:id', userReviews, (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((result) => {
      const book = result.data;
      res.render('book-single', { book });
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});*/

bookRouter.get('/book/:id', (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((result) => {
      const book = result.data;
      const bookId = book.id;
      console.log(bookId);
      Book.findOne({ bookId: bookId })
        .then((match) => {
          if (match) {
            console.log("book is there")
            const book_id = book._id;
            console.log(book_id);
            User.find({ books: book_id })
              .then(() => {
                const notifyMessage = "book is there";
                res.render('book-single', { notifyMessage, match, book });
              })
          } else {
            console.log("book is not there")
            res.render('book-single', { book });
          }
        })


        .catch((error) => {
          console.log(error);
          response.send('There was an error searching.');
        });

      //Book.find()
      // res.render('book-single', { book });
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

/*bookRouter.get('/book/:id', (req, res, next) => {
  const bookId = req.params.id;
  Review.find({ book: bookId })
bookRouter.get('/book/:id', (req, res, next) => {
  const bookId = req.params.id;
  Review
    //.select({ "message", book: bookId })
    .find({ book: bookId })
    .populate('creator')
    .then((reviews) => {
      res.render('book-single', { reviews, bookId });
    })

    .catch((error) => {
      next(error);
    });
});*/

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
                  //const notifyMessage = "books is saved";
                  console.log("book is saved");
                  res.redirect(`/books/book/${bookId}`);
                });
              })
              .catch((error) => {
                console.log(error);
                next(error);
              });
          } else {
            console.log("already in list");
            res.redirect(`/books/book/${bookId}`);

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
