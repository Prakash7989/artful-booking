const express = require('express');
const router = express.Router();
const { registerUser, loginUser, adminLogin, getMe, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);                              // customers + artists only
router.post('/admin-login', adminLogin);                      // admins only
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);

module.exports = router;
