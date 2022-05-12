const express = require('express');
const User = require('./../models/user');
const routeGuard = require('./../middleware/route-guard');
const fileUpload = require('./../middleware/file-upload');

const profileRouter = express.Router();

profileRouter.get('/:id', routeGuard, (req, res, next) => {
  const profileId = req.params.id;

  User.findById(profileId)
    .populate('books')
    .populate('clubs')
    .then((profile) => {
      let userIsOwner = String(req.user._id) === String(profileId);
      const userClubs = profile.clubs;
      const savedBooks = profile.books;

      res.render('profile/profile', {
        profile,
        userClubs,
        savedBooks,
        userIsOwner
      });
    })
    .catch((err) => next(err));
});

profileRouter.get('/:id/edit', routeGuard, (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((profile) => {
      res.render('profile/edit', { profile });
    })
    .catch((err) => next(err));
});

profileRouter.post(
  '/:id/edit',
  routeGuard,
  fileUpload.single('picture'),
  (req, res) => {
    const { name, email } = req.body;
    const userId = req.params.id;
    let picture;
    if (req.file) {
      picture = req.file.path;
    }

    User.findByIdAndUpdate(userId, { name, email, picture })
      .then(() => {
        res.redirect(`/profile/${userId}`);
      })
      .catch((err) => {
        next(err);
      });
  }
);

module.exports = profileRouter;
