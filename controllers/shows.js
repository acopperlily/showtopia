const cloudinary = require('../middleware/cloudinary');
const Show = require('../models/Show');
const User = require('../models/User');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      //const shows = await Show.find({ user: req.user.id });
      const shows = await Show.find({ '_id': { $in: req.user.showsAttended }});
      res.render('dashboard.ejs', { user: req.user, shows: shows });
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
  getShow: async (req, res) => {
    try {
      const show = await Show.findById(req.params.id);
      res.render('show.ejs', { show: show, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createShow: async (req, res) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      const show = await Show.create({
        artist: req.body.artist,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        tourName: req.body.tourName,
        venue: req.body.venue,
        likes: 0,
        userLikes: [],
        attendedBy: [req.user.id],
        createdBy: req.user.id,
      });

      // Add show to user array
      const query = { _id: req.user.id };
      const updateShows = {
        $push: { showsAttended: show.id }
      };
      await User.updateOne(query, updateShows);

      console.log('Show has been added!');
      res.redirect('/dashboard');
    } catch (err) {
      console.log(err);
    }
  },
  deleteShow: async (req, res) => {
    try {
      // Find show by ID
      let show = await Show.findById({ _id: req.params.id });

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(show.cloudinaryId);

      // Delete show ID from each user
      for (let userId of show.attendedBy) {
        const query = { _id: userId };
        const removeShow = {
          $pull: {
            showsAttended: show.id
          }
        }
        await User.updateOne(query, removeShow);
      }

      // Delete show from DB
      await Show.remove({ _id: req.params.id });
      console.log('Deleted show');
      res.redirect('/dashboard');
    } catch (err) {
      res.redirect('/dashboard');
    }
  },
  updateLikes: async (req, res) => {
    try {
      // let show = await Show.findOneAndUpdate({ _id: req.params.id }, {
      //   $set: {
      //     userLikes: {
      //       $cond: [{
      //         userLikes: {$in: ["$userLikes", req.user.id],
      //         $pull: { userLikes: req.user.id },
      //         $push: { userLikes: req.user.id }
      //         }
      //       }]
      //     }
      //   }
      // })
      let show = await Show.findById({ _id: req.params.id });
      if (show.userLikes.includes(req.user.id)) {
        await Show.updateOne({ _id: req.params.id }, {
          $pull: { userLikes: req.user.id }
        });
      } else {
        await Show.updateOne({ _id: req.params.id }, {
          $push: { userLikes: req.user.id }
        });
      }
      res.redirect(`/show/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  updateAttendance: async (req, res) => {
    try {
      let show = await Show.findById({ _id: req.params.id });
      let user = await User.findById({ _id: req.user.id });

      console.log('show:', show);
      console.log('user:', user);
      console.log(show.attendedBy.includes(user.id));
      console.log(user.showsAttended.includes(show.id));

      console.log(req.params);
      console.log(req.user);

      if (show.attendedBy.includes(user.id)) {
        await Show.updateOne({ _id: req.params.id }, { $pull: { attendedBy: user.id }});
        await User.updateOne({ _id: req.user.id }, { $pull: { showsAttended: show.id }});
      } else {
        await Show.updateOne({ _id: req.params.id }, { $push: { attendedBy: user.id }});
        await User.updateOne({ _id: req.user.id }, { $push: { showsAttended: show.id }});
      }

      console.log('Attendance has been updated!');
      res.redirect(`/show/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }
};