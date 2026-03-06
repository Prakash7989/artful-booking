const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getArtistBookings, 
  getUserBookings, 
  updateBookingStatus 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All booking routes are private

router.post('/', createBooking);
router.get('/artist', getArtistBookings);
router.get('/user', getUserBookings);
router.patch('/:id', updateBookingStatus);

module.exports = router;
