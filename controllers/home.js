module.exports = {
  getIndex: (req, res) => {
    console.log('is this home?');
    res.render('index.ejs');
  },
};