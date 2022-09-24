const cloudinary = require('../middleware/cloudinary');
const Show = require('../models/Show');
const User = require('../models/User');

module.exports = {
  getDashboard: async (req, res) => {
    console.log('test');
    try {
      res.render('dashboard.ejs');
    } catch(err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const shows = await Show.find().sort({ createdAt: "desc" }).lean();
      // const users = [];
      // for (let show of shows) {
      //   let user = await User.findById(show.user);
      //   users.push(user.userName);
      // }
      // console.log(users);
      
      res.render('feed.ejs', { shows: shows });
    } catch (err) {
      console.log(err);
    }
  },
  createShow: async (req, res) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Show.create({
        artist: req.body.artist,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        venue: req.body.venue,
        likes: 0,
        user: req.user.id,
      });
      console.log('Show has been added!');
      res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }
};