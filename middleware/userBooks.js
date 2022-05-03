const Book = require('../models/book');
const User = require('../models/user');

const userBooks = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .populate('books')
    .then((users) => {
      //console.log(users.books)
      const savedBooks = users.books;
      res.render('private', { savedBooks });
    })

    // .then((books) => {
    //   if (books) {
    //     Book.find({ id: _id, books: _id })
    //     .populate('books')
    //       .then((book) => {
    //         console.log("user have books saved")
    //         req.send(book)
    //       })

    //   } else {
    //     console.log("user do not have books saved")
    //   }
    //   next()
    // })
    .catch((error) => {
      console.log(error);
      next(error);
    })
}

module.exports = userBooks;