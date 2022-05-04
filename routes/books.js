'use strict';

const axios = require('axios');
const express = require('express');
const Book = require('../models/book');
const User = require('../models/user');
const bookRouter = express.Router();

bookRouter.get('/', (req, res) => {
  res.render('books');
});

bookRouter.post('/book/search/:search', (req, res) => {
  let searchTerm = req.body.search
  console.log(searchTerm);
  if (!searchTerm.length) {
    searchTerm = 'Awarded+Books';
  }
  axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=12&keyes&key=${process.env.GBOOKSKEY}`)
    .then((result) => {
      const books = result.data.items;
      res.render("books", { books, searchTerm });
    }).catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

bookRouter.get('/book/:id', (req, res) => {
  const id = req.params.id;
  axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
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

bookRouter.post('/book/:id', (req, res, next) => {
  const bookId = req.params.id
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
    .then((result) => {
      Book.findOne({ bookId: bookId })
        .then((book) => {
          console.log(book)
          if (!book) {
            const { title, authors, description, categories, publishedDate, averageRating, pageCount, imageLinks } = result.data.volumeInfo;
            Book.create({
              bookId, title, authors, description, categories, publishedDate, averageRating, pageCount, imageLinks
            })
              .then((book) => {
                User.findByIdAndUpdate(req.user.id, { $push: { books: book._id } })
                  .then(() => {
                    res.json('book is saved to your list');
                  })
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