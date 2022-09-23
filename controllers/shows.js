const User = require('../models/User');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      res.render('dashboard.ejs');
    } catch(err) {
      console.log(err);
    }
  }
};