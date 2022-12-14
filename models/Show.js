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
  tourName: String,
  venue: {
    type: String,
  },
  date: {
    type: Date,
  },
  formattedDate: {
    type: String,
  },
  userLikes: [String],
  attendedBy: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Show', ShowSchema);