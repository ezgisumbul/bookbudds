'use strict';

const bcryptjs = require('bcryptjs');
const { isEmail } = require('validator');
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please enter a name'],
    minlength: [6, 'Minimum Name length is 6 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: [true, ' That email is already registered'],
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum Password length is 6 characters'],
  },
  clubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club'
    }
  ],
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  picture: {
    type: String,
    default: '/images/surveillance_re_8tkl.svg'
  }

}, { timestamps: true });

schema.pre('save', async function (next) {
  const salt = await bcryptjs.genSalt();
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', schema);

module.exports = User;
