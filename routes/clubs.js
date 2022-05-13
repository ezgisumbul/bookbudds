const express = require('express');
const fileUpload = require('../middleware/file-upload');
const routeGuard = require('../middleware/route-guard');
const User = require('../models/user');
const Club = require('../models/club');
const nodemailer = require('nodemailer');

const clubRouter = express.Router();

// Sometimes I use id sometimes I use clubId. Should be refactored.

clubRouter.get('/', (req, res, next) => {
  let isLogged;
  let isMember;

  Club.find()
    .populate('creator')
    .populate('members')
    .then((clubs) => {
      // console.log(clubs);
      if (req.user) {
        isLogged = true;
      } else {
        isLogged = false;
      }
      // console.log(clubs);
      // clubs.forEach((club) => {
      //   //console.log('THIS IS A' + club);
      //   club.members.forEach((member) => {
      //     if (String(req.user.id) === String(member._id)) {
      //       console.log('Current user is a member of ' + club.name);
      //       isMember = true;
      //       Club.findOneAndUpdate(club, {
      //         $push: { isMember: isMember }
      //       });
      //     } else {
      //       isMember = false;
      //       Club.findOneAndUpdate(club, {
      //         $push: { isMember: isMember }
      //       });
      //     }
      //   });
      // });
      res.render('club/club-list', { clubs, isLogged });
      // res.render('club/club-list', { clubs, isLogged, isMember });
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
      let isClubMember = req.user.clubs.includes(id);
      let userIsOwner = String(req.user._id) === String(club.creator._id);
      //Jose does it like follows and I don't understand the reaon of the first check :
      // let userIsOwner = req.user && String(req.user._id) === String(publication.creator._id);
      res.render('club/club-single', {
        club,
        userIsOwner,
        isClubMember
      });
      // });
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

clubRouter.post(
  '/club/create',
  routeGuard,
  fileUpload.single('picture'),
  async (req, res, next) => {
    const { name, description } = req.body;

    let picture;
    if (req.file) {
      picture = req.file.path;
    }

    Club.create({
      name,
      description,
      creator: req.user._id,
      picture,
      memberCount: 1
    })
      .then((club) => {
        const clubId = club._id;
        User.findByIdAndUpdate(req.user.id, {
          $push: { clubs: club._id }
        }).catch((err) => next(err));
        Club.findByIdAndUpdate(club._id, {
          $push: { members: req.user._id }
        }).catch((err) => next(err));
        res.redirect(`/clubs/club/${clubId}`);
      })
      .catch((err) => next(err));
  }
);

clubRouter.post('/club/:id/edit', (req, res, next) => {
  const { name, description } = req.body;
  const { id } = req.params;

  Club.findByIdAndUpdate(id, { name, description })
    .then(() => {
      if (req.user) {
        isLogged = true;
      } else {
        isLogged = false;
      }
      //res.redirect('/clubs');
      res.redirect(`/clubs/club/${id}`); // does not work
    })
    .catch((err) => {
      next(err);
    });
});

clubRouter.post('/club/:id/delete', (req, res, next) => {
  const { id } = req.params;

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
  console.log('join page');

  Club.findById(clubId)
    .then((club) => {
      User.findById(req.user.id).then((user) => {
        let isClubMember = user.clubs.includes(clubId);
        console.log(user);

        if (!isClubMember) {
          User.findByIdAndUpdate(req.user.id, { $push: { clubs: club._id } })
            .then((user) => {
              User.countDocuments({ clubs: clubId }, function (err, count) {
                // const memberCount = count;
                Club.findByIdAndUpdate(clubId, {
                  memberCount: count,
                  $push: { members: user._id }
                }).catch((err) => next(err));
              });
            })
            .then(() => {
              console.log('club is added to the user');
              res.redirect(`/clubs/club/${clubId}`); // does not work
            })
            .catch((err) => next(err));
        } else {
          console.log('this club exists for the user');
          res.redirect(`/clubs/club/${clubId}`);
          //next();
        }
      });
    })
    .catch((err) => next(err));
});

clubRouter.post('/club/:id/leave', (req, res, next) => {
  const clubId = req.params.id;

  Club.findById(clubId)
    .then((club) => {
      User.findById(req.user.id).then((user) => {
        let isClubMember = user.clubs.includes(clubId);
        console.log(user);

        if (isClubMember) {
          User.findByIdAndUpdate(req.user.id, { $pull: { clubs: club._id } })
            .then((user) => {
              User.countDocuments({ clubs: clubId }, function (err, count) {
                // const memberCount = count;
                Club.findByIdAndUpdate(clubId, {
                  memberCount: count,
                  $pull: { members: user._id }
                }).catch((err) => next(err));
              });
            })
            .then(() => {
              console.log('club is added to the user');
              res.redirect(`/clubs/club/${clubId}`); // does not work
            })
            .catch((err) => next(err));
        } else {
          console.log('this club exists for the user');
          res.redirect(`/clubs/club/${clubId}`);
          //next();
        }
      });
    })
    .catch((err) => next(err));
});
clubRouter.get('/club/:id/members', (req, res, next) => {
  const clubId = req.params.id;

  Club.findById(clubId).then((club) => {
    User.find({ clubs: clubId }).then((members) => {
      res.render('club/member-list', { club, members });
    });
  });
});

module.exports = clubRouter;
