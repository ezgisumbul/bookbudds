'use strict';

const express = require('express');
const User = require('../models/user');
const router = express.Router();
const randomBooks = require('./../middleware/randomBooks');
const routeGuard = require('./../middleware/route-guard');
const userBooks = require('./../middleware/userBooks');

router.get('/', randomBooks, (req, res, next) => {
  res.render('home', { title: 'BookBudd!' });
});

// router.get('/private', userBooks, routeGuard, (req, res, next) => {
//   res.render('private');
// });

// @ezgi: disabled above route as userBooks middleware is handling the render
// of the page as well and render needs to happen here.

router.get('/private', routeGuard, (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .populate('books')
    .populate('clubs')
    .then((user) => {
      const userClubs = user.clubs;
      const savedBooks = user.books;
      //console.log(user.clubs);
      //console.log(user.books);
      res.render('private', { userClubs, savedBooks });
    });
});
module.exports = router;
