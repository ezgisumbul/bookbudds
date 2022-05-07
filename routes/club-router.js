const express = require('express');
const routeGuard = require('../middleware/route-guard');
const Book = require('../models/book');
const User = require('.././models/user');

const Club = require('../models/club');
const Member = require('../models/member');

const clubRouter = new express.Router();

// Sometimes I use id sometimes I use clubId. Should be refactored.

clubRouter.get('/', (req, res, next) => {
  Club.find()
    .then((clubs) => {
      res.render('club/club-list', { clubs });
    })
    .catch((err) => next(err));
});

clubRouter.get('/club/create', routeGuard, (req, res) => {
  res.render('club/create');
});

clubRouter.get('/club/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;

  Club.findById(id)
    .populate('creator')
    .then((club) => {
      // I moved the member logic to another route so this route to be refactored
      let isClubMember = req.user.clubs.includes(id);

      // console.log(req.user);
      // console.log(req.user._id);
      // console.log(req.user.id);
      // console.log(club.creator.id);
      // console.log(club.creator._id);
      let userIsOwner = String(req.user._id) === String(club.creator._id);
      //Jose does it like follows and I don't understand the reaon of the first check :
      // let userIsOwner = req.user && String(req.user._id) === String(publication.creator._id);
      // console.log(userIsOwner);
      // res.render('club/club-single', { club, userIsOwner, isClubMember }); // can we pass a boolean, seems like we can

      User.find({ clubs: id }).then((members) => {
        console.log(members);
        res.render('club/club-single', {
          club,
          userIsOwner, // can we pass a boolean, seems like we can
          isClubMember,
          members
        });
      });
    })
    .catch((err) => next(err));
});

clubRouter.get('/club/:id/edit', (req, res, next) => {
  const { id } = req.params;

  Club.findById(id)
    .then((club) => {
      res.render('club/edit', { club });
    })
    .catch((err) => {
      next(err);
    });
});

clubRouter.post('/', (req, res) => {
  res.render('club/club-list');
});

clubRouter.post('/club/create', routeGuard, (req, res, next) => {
  const { name, description } = req.body;
  Club.create({ name, description, creator: req.user._id })
    .then(() => {
      res.redirect('/clubs');
    })
    .catch((err) => next(err));
});

clubRouter.post('/club/:id/edit', (req, res, next) => {
  const { name, description } = req.body;
  const { id } = req.params;

  Club.findByIdAndUpdate(id, { name, description })
    .then(() => {
      // res.redirect('/clubs');
      res.redirect(`/clubs/club/${id}`); // does not work
    })
    .catch((err) => {
      next(err);
    });
});

clubRouter.post('/club/:id/delete', (req, res, next) => {
  const { id } = req.params;
  // console.log(req.params);

  Club.findByIdAndRemove(id)
    .then(() => {
      res.redirect('/clubs');
    })
    .catch((err) => {
      next(err);
    });
});

clubRouter.post('/club/:id/join', (req, res, next) => {
  const clubId = req.params.id;
  // console.log('hello');
  // console.log(req.params);
  // console.log(clubId);
  // console.log(req.user.id);

  Club.findById(clubId)
    .then((club) => {
      User.findById(req.user.id).then((user) => {
        let isClubMember = user.clubs.includes(clubId);

        if (!isClubMember) {
          User.findByIdAndUpdate(req.user.id, { $push: { clubs: club._id } })
            .then(() => {
              console.log('club is added to the user');
              // res.redirect('/clubs');
              console.log('added');
              res.redirect(`/clubs/club/${id}`); // does not work
            })
            .catch((err) => next(err));
        } else {
          console.log('exists');
          next();
        }
      });
    })
    .catch((err) => next(err));
});

clubRouter.get('/club/:id/members', (req, res, next) => {
  const clubId = req.params.id;

  Club.findById(clubId).then(() => {
    User.find({ clubs: clubId }).then((members) => {
      res.render('club/member-list', { members });
    });
  });
});

module.exports = clubRouter;
