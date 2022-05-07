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

// @ezgi: disabled below route and moved the logic to get('/profile/:id') route in profile router
// router.get('/private', routeGuard, (req, res, next) => {
//   const userId = req.user._id;
//   User.findById(userId)
//     .populate('books')
//     .populate('clubs')
//     .then((profile) => {
//       const userClubs = profile.clubs;
//       const savedBooks = profile.books;
//       // console.log(user.clubs);
//       // console.log(user.books);
//       res.render('profile/profile', { profile, userClubs, savedBooks });
//     });
// });
module.exports = router;
