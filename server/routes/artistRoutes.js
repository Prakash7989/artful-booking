const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { 
  getArtists, 
  getArtistById, 
  getArtistProfile, 
  updateArtistProfile,
  addReview
} = require('../controllers/artistController');

router.get('/', getArtists);
router.get('/me', protect, getArtistProfile);
router.get('/:id', getArtistById);
router.put('/profile', protect, upload.array('images', 10), updateArtistProfile);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
