const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const showsController = require('../controllers/shows');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// Show routes
router.get('/:id', ensureAuth, showsController.getShow);

router.post('/createShow', upload.single('file'), showsController.createShow);

//router.put('/likeShow/:id', showsController.likeShow);
router.put('/updateAttendance/:id', showsController.updateAttendance);
router.put('/updateLikes/:id', showsController.updateLikes);

router.delete('/deleteShow/:id', showsController.deleteShow);

module.exports = router;