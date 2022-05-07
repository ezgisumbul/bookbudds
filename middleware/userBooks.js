const Book = require('../models/book');
const User = require('../models/user');

const userBooks = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .populate('books')
    .then((users) => {
      //console.log(users.books)
      const savedBooks = users.books;
      // console.log(savedBooks);
      // res.render('private', { savedBooks }); // @ezgi: we shouldn't render the page inside the middleware. we should find a way to pass the savedBooks object to the render method in the base router
      next(); //@ezgi: without next, we are stuck in middleware. I've added a next()
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
    });
};

module.exports = userBooks;
