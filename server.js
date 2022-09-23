const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const flash = require('express-flash');
const logger = require('morgan');
const connectDB = require('./config/database');
const mainRoutes = require('./routes/main');
// const showRoutes = require('./routes/shows');
// const commentRoutes = require('./routes/comments');

// Use .env file in config folder
require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();

// Use EJS for views
app.set('view engine', 'ejs');

// Static folder
app.use(express.static('public'));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(logger('dev'));

// Use forms for put/delete
app.use(methodOverride('_method'));

// Set up sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages
app.use(flash());

// Set up routes
app.use('/', mainRoutes);
// app.use('/show', showRoutes);
// app.use('/comment', commentRoutes);

// Server running
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}.`);
});