const axios = require('axios');

const randomBooks = (req, res, next) => {
  const term = 'books';
  const subject = 'fantasy + romance';

  axios
    .get(`https://www.googleapis.com/books/v1/volumes/?q=${term}+subject:${subject}&maxResults=12&keyes&key=${process.env.GBOOKSKEY}`)
    .then((result) => {
      res.locals.books = result.data.items;
      next();
    })
    .catch((error) => next(error));
}
module.exports = randomBooks;