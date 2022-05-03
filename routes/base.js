'use strict';

const express = require('express');
const router = express.Router();
const randomBooks = require('./../middleware/randomBooks');
const routeGuard = require('./../middleware/route-guard');
const userBooks = require('./../middleware/userBooks');

router.get('/', randomBooks, (req, res, next) => {
  res.render('home', { title: 'BookBudd!' });
});

router.get('/private', userBooks, routeGuard, (req, res, next) => {
  res.render('private');
});

module.exports = router;
