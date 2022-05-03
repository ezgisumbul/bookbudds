const express = require('express');
const routeGuard = require('../middleware/route-guard');

const Club = require('../models/club');
const Member = require('../models/member');

const clubRouter = new express.Router();

// set app.js the following and change the routes:
// app.use('/clubs', clubRouter);

// GET '/club/:id' - Renders single club page
// POST '/club/:id/join' - Handles join to a club

// GET '/clubs' : List of clubs to be rendered

clubRouter.get('/list', (req, res, next) => {
  Club.find()
    .then((clubs) => {
      res.render('club/club-list', { clubs });
    })
    .catch((err) => next(err));
});

// POST '/clubs' : New created clubs to be published to the list

clubRouter.post('/list', (req, res) => {
  res.render('club/club-list');
});

clubRouter.get('/create', routeGuard, (req, res) => {
  res.render('club/create');
});

clubRouter.post('/create', routeGuard, (req, res, next) => {
  const { name, description } = req.body;
  Club.create({ name, description, creator: req.user._id })
    .then(res.redirect('/club/list'))
    .catch((err) => next(err));
});

clubRouter.get('/:id', routeGuard, (req, res, next) => {
  const { id } = req.params;
  Club.findById(id)
    .populate('creator')
    .then((club) => {
      res.render('club/club-single', { club });
    })
    .catch((err) => next(err));
});

// if we decide to do full crud on clubs:

// clubRouter.get('/club/:id/edit', (req, res, next) => {
//   res.render('club/club-single');
// });

// clubRouter.post('/club/:id/edit', (req, res, next) => {
//   res.render('club/club-single');
// });

// clubRouter.post('/club/:id/delete', (req, res, next) => {
//   res.render('club/club-single');
// });

// POST '/club/:id/join' - Handles join to a club

// POST route to submit the form to create a post
// ****************************************************************************************

// <form action="/post-create" method="POST">
// router.post('/post-create', (req, res, next) => {
//   const { title, content, author } = req.body;
//   // 'author' represents the ID of the user document

//   Post.create({ title, content, author })
//     .then((dbPost) => {
//       // when the new post is created, the user needs to be found and its posts updated with the
//       // ID of newly created post
//       return User.findByIdAndUpdate(author, { $push: { posts: dbPost._id } });
//     })
//     .then(() => res.redirect('/posts')) // if everything is fine, redirect to list of posts
//     .catch((err) => {
//       console.log(`Err while creating the post in the DB: ${err}`);
//       next(err);
//     });
// });

module.exports = clubRouter;
