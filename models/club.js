// const { unique } = require('handlebars-helpers/lib/array');
const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 200,
      unique: true
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true
    },

    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },

    picture: {
      type: String,
      default: '/images/club-cover.jpg'
    },

    memberCount: {
      type: Number
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],

    isMember: [
      {
        type: Boolean
      }
    ]
  },
  { timestamps: true }
);

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
