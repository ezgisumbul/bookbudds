'use strict';

const axios = require('axios');
const express = require('express');
const bookRouter = express.Router();

bookRouter.get('/', (req, res) => {
  res.render('books');
});

bookRouter.get('/book/:id', (req, res) => {
  const id = req.params.id;
  axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`)
    .then((result) => {
      const book = result.data;
      res.render('book-single', { book });
    })
    .catch((error) => {
      console.log(error);
      response.send('There was an error searching.');
    });
});

module.exports = bookRouter;