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

bookRouter.get('/book/:id', (req, res) => {
  const id = req.params.id;
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((result) => {
      const bookTitle = result.data.volumeInfo.title;
      // console.log(bookTitle);

      const book = result.data;
      // console.log(result.data);
      const bookId = result.data.id;
      Review.find({ book: id })
        .populate('creator')
        .sort({ createdAt: -1 })
        .then((reviews) => {
          console.log(reviews);
          res.render('book-single', { bookTitle, book, id, bookId, reviews });
        })
        .catch((err) => next(err));
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

// Latest changes that were added that removed the review
/*
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
            const book_id = book._id;
            User.find({ books: book_id }).then(() => {
              const notifyMessage = 'This book is in your list';
              res.render('book-single', { notifyMessage, match, book });
            });
          } else {
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
                  console.log('book is saved');
                  res.redirect(`/books/book/${bookId}`);
                });
              })
              .catch((error) => {
                console.log(error);
                next(error);
              });
          } else {
            console.log('already in list');
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

// As the bookTitle is saved to review object,
// the route below is obsolete now.

// bookRouter.get('/book/:id/review/:revId', (req, res, next) => {
//   const bookId = req.params.id;
//   const id = req.params.revId;
//   // console.log(req.params);
//   // console.log(bookId);
//   // console.log(id);
//   console.log('book ID: ', req.params['id']);
//   console.log('review ID: ', req.params['revId']);

//   Review.findById(id)
//     .populate('creator')
//     .then((reviews) => {
//       // console.log(reviews);
//       // console.log(reviews.book);
//       axios
//         .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
//         .then((book) => {
//           const bookTitle = book.data.volumeInfo.title;
//           // @ezgi: to fix following issue: https://trello.com/c/gHZMqvJq
//           if (req.user) {
//             let isReviewCreator =
//               String(req.user._id) === String(reviews.creator._id);
//             res.render('review-single', {
//               reviews,
//               isReviewCreator,
//               bookTitle
//             });
//           } else {
//             res.render('review-single', { reviews, bookTitle });
//           }
//         })
//         .catch((err) => next(err));
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

module.exports = bookRouter;
