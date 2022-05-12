'use strict';

const { Router } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('./../models/user');
const fileUpload = require('./../middleware/file-upload');

// handle errors
const handleSignUpError = (err) => {
  const error = new Error();

  console.log(err.message, err.code);
  // let errors = { email: '', name: '', password: '' };

  // email validation
  if (err.message.includes('Please enter an email')) {
    error.message += 'Please enter an email\n';
  }
  if (err.message.includes('Please enter a valid email')) {
    error.message += 'Please enter a valid email\n';
  }
  if (err.message.includes("There's no user with that email")) {
    error.message += "There's no user with that email\n";
  }
  // password validation
  if (err.message.includes('Please enter a password')) {
    error.message += 'Please enter a password\n';
  }
  if (err.message.includes('Minimum Password length')) {
    error.message += 'Minimum Password length is 6 characters\n';
  }
  if (err.message.includes('Wrong password')) {
    error.message += 'Wrong Password. Please try again\n';
  }

  // name validation
  if (err.message.includes('Please enter a name')) {
    error.message += 'Please enter a name\n';
  } else if (err.message.includes('Minimum Name length')) {
    error.message += 'Minimum Name length is 6 characters\n';
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
};

const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

router.post(
  '/sign-up',
  fileUpload.single('picture'),
  async (req, res, next) => {
    const { name, email, password } = req.body;

    let picture;
    if (req.file) {
      picture = req.file.path;
    }

    return User.create({
      name,
      email,
      password,
      picture
    })
      .then((user) => {
        req.session.userId = user._id;
        res.redirect(`/profile/${user._id}`);
      })
      .catch((err) => {
        const error = handleSignUpError(err);
        res.render('authentication/sign-up', { error, name, email });
      });
  }
);

router.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
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
        return bcryptjs.compare(password, user.password);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect(`/profile/${user._id}`);
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((err) => {
      const error = handleSignUpError(err);
      res.render('authentication/sign-in', { error, email });
      //next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
