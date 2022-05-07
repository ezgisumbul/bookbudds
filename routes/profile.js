const express = require('express');
const profileRouter = express.Router();
const routeGuard = require('./../middleware/route-guard');

const User = require('./../models/user');

profileRouter.get('/:id', routeGuard, (req, res, next) => {
  const profileId = req.params.id;

  User.findById(profileId)
    .populate('books')
    .populate('clubs')
    .then((profile) => {
      let userIsOwner = String(req.user._id) === String(profileId);
      const userClubs = profile.clubs;
      const savedBooks = profile.books;
      // console.log(user.clubs);
      // console.log(user.books);
      res.render('profile/profile', {
        profile,
        userClubs,
        savedBooks,
        userIsOwner
      });
    })
    .catch((err) => next(err));
});

module.exports = profileRouter;
