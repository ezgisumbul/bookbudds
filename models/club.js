const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 200
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
      type: String
    }
  },
  { timestamps: true }
);

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
