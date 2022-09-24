const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  venue: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Show', ShowSchema);