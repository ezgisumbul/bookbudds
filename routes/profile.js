const express = require('express');
const profileRouter = express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');

// profileRouter.get('/', routeGuard, (req, res, next) => {
//   const userId = req.user._id;
//   User.findById(userId)
//     .populate('books')
//     .populate('clubs')
//     .then((user) => {
//       const userClubs = user.clubs;
//       const savedBooks = user.books;
//       // console.log(user.clubs);
//       // console.log(user.books);
//       res.render('private', { userClubs, savedBooks });
//     });
// });

profileRouter.get('/:id', routeGuard, (req, res, next) => {
  const profileId = req.params.id;

  User.findById(profileId)
    .populate('books')
    .populate('clubs')
    .then((profile) => {
      const userClubs = profile.clubs;
      const savedBooks = profile.books;
      // console.log(user.clubs);
      // console.log(user.books);
      res.render('profile/profile', { profile, userClubs, savedBooks });
    })
    .catch((err) => next(err));
});

module.exports = profileRouter;
