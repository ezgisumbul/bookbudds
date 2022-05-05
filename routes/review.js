'use strict';
const express = require('express');
const Review = require('./../models/review');
const routeGuard = require('./../middleware/route-guard');
const reviewRouter = new express.Router();
const axios = require('axios');

// Renders review creation page
reviewRouter.get('/create/:id', routeGuard, (req, res) => {
  res.render('review-create');
});

// Handles review creation

reviewRouter.post('/create/:id', routeGuard, (req, res, next) => {
  const { message } = req.body;
  const id = req.params.id;
  console.log('here' + id);
  Review.create({
    message,
    creator: req.user._id,
    book: req.params.id
  })
    .then(() => {
      res.redirect('/');
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
reviewRouter.post('/:id/edit', (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;
  console.log(id);
  console.log(message);
  Review.findOneAndUpdate({ _id: id, creator: req.user._id }, { message })
    .then(() => {
      res.redirect(`/review/${id}`);
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
      res.render('review-single', { reviews });
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
