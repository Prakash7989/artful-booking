const express = require('express');
const router = express.Router();
const {
  getArtists,
  approveArtist,
  rejectArtist,
  getAllUsers,
  deleteUser,
  getAllBookings,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/artists', getArtists);
router.patch('/artists/:id/approve', approveArtist);
router.patch('/artists/:id/reject', rejectArtist);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.delete('/users/:id', deleteUser);

module.exports = router;
