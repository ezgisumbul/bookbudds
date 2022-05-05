'use strict';

const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('./../models/user');


// handle errors
const handleSignUpError = (err) => {
  const error = new Error();

  console.log(err.message, err.code);
  // let errors = { email: '', name: '', password: '' };

  // incorrect email
  if (err.message.includes('email')) {
    error.message += 'The email provided is invalid.\n';
  }

  // incorrect password
  if (err.message.includes('password')) {
    error.message += 'That password is invalid.\n';
  }

  // duplicate email error
  if (err.code === 11000) {
    error.message += 'That email is already registered.\n';
  }

  // validation errors
  /*
  if (err.message.includes('User validation failed')) {
    //console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      //console.log(val);
      //console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  */

  return error;
}


const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', async (req, res, next) => {
  const { name, email, password } = req.body;

  return User.create({
    name,
    email,
    password
  })
    .then((user) => {
      req.session.userId = user._id;
      res.redirect('/private');
    })
    .catch((err) => {
      const error = handleSignUpError(err);
      res.render('sign-up', { error });
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
