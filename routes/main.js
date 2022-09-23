const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
const showsController = require('../controllers/shows');
const auth = require('../middleware/auth');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Main Routes
router.get('/', homeController.getIndex);

router.get('/dashboard', ensureAuth, showsController.getDashboard);

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

module.exports = router;