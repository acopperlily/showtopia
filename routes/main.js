const express = require('express');
const router = express.Router();
//const authController = require('../controllers/auth');
const homeController = require('../controllers/home');
//const showsController = require('../controllers/shows');
//const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Main Routes
router.get('/', homeController.getIndex);

module.exports = router;