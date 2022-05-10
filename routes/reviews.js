'use strict';
const express = require('express');
const Review = require('./../models/review');
const routeGuard = require('./../middleware/route-guard');
const reviewRouter = new express.Router();
const Book = require('../models/book');
const User = require('../models/user');
const bookRouter = express.Router();
const axios = require('axios');

reviewRouter.get('/', (req, res, next) => {
  Review.find()
    .populate('creator')
    //.populate('book')
    .sort({ createdAt: -1 })
    .then((reviews) => {
      console.log(reviews);
      if (!reviews) {
        throw new Error('PUBLICATION_NOT_FOUND');
      } else {
        res.render('reviews', { reviews });
        //console.log(reviews[0].book); //have to get id of the reviewed book
      }
    })
    .catch((error) => {
      next(error);
    });
});

// Renders review creation page
reviewRouter.get('/create/:id', routeGuard, (req, res) => {
  const { id } = req.params;
  // console.log(id);

  // Here we are accessing the book title through API and not through
  // database as the bookTitle is not saved yet. It will be saved when
  // post('/create/:id') route is executed.
  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((book) => {
      const bookTitle = book.data.volumeInfo.title;
      // console.log(bookTitle);
      res.render('review-create', { bookTitle });
    })
    .then(() => {})
    .catch((err) => next(err));
});

// Handles review creation

reviewRouter.post('/create/:id', routeGuard, (req, res, next) => {
  const { message } = req.body;
  const id = req.params.id;

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((book) => {
      console.log(book);
      const bookTitle = book.data.volumeInfo.title;
      const bookCover = book.data.volumeInfo.imageLinks;
      const bookAuthor = book.data.volumeInfo.authors;
      Review.create({
        message,
        creator: req.user._id,
        book: req.params.id,
        bookTitle: bookTitle,
        bookCover: bookCover,
        bookAuthor: bookAuthor
      });
    })
    .then(() => {
      res.redirect(`/books/book/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

// Loads review from database, renders review edit page
reviewRouter.get('/:id/edit', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Review.findOne({ _id: id, creator: req.user._id })
    .then((reviews) => {
      if (!reviews) {
        throw new Error('PUBLICATION_NOT_FOUND');
      } else {
        res.render('review-edit', { reviews });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// POST - '/review/:id/edit' - Handles edit form submission.
reviewRouter.post('/:id/edit', routeGuard, (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  console.log(id);
  console.log(message);
  Review.findOneAndUpdate({ _id: id, creator: req.user._id }, { message })
    .then(() => {
      res.redirect(`/reviews/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

// single review page
reviewRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Review.findById(id)
    .populate('creator')
    .then((reviews) => {
      // @ezgi: to fix following issue: https://trello.com/c/gHZMqvJq
      if (req.user) {
        let isReviewCreator =
          String(req.user._id) === String(reviews.creator._id);
        res.render('review-single', {
          reviews,
          isReviewCreator
        });
      } else {
        res.render('review-single', { reviews });
      }
    })
    .catch((error) => {
      next(error);
    });
});

// POST - '/review/:id/delete' - Handles deletion.

reviewRouter.post('/:id/delete', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Review.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = reviewRouter;
