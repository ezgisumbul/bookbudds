const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  clubId: {
    type: mongoose.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const Member = mongoose.model('Member', memberSchema);
