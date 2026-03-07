const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

// Generate JWT — role is embedded so each role's token is structurally distinct
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: role === 'admin' ? '8h' : '30d', // Admins get shorter-lived tokens
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, bio, state, specialty, awards } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (role === 'artist') {
      if (!bio || !state || !specialty) {
        return res.status(400).json({ message: 'Please provide bio, state, and specialty for an artist profile' });
      }
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let profileImageUrl = undefined;

    // Handle Cloudinary Upload
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'artful-booking/users'
      });
      profileImageUrl = uploadResponse.secure_url;
    }

    // Create user
    const userRole = role || 'customer';
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      profileImage: profileImageUrl,
      bio,
      state,
      specialty,
      awards,
      isApproved: userRole === 'artist' ? false : true,
      approvalStatus: userRole === 'artist' ? 'draft' : 'approved'
    });

    if (user) {
      if (user.role === 'artist' && !user.isApproved) {
         res.status(201).json({
           message: 'Artist profile created successfully. Pending admin approval.',
           pendingApproval: true
         });
      } else {
         res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            token: generateToken(user._id, user.role),
         });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user (customer / artist only — admins must use /api/auth/admin-login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Admins must log in via the dedicated admin endpoint
    if (user.role === 'admin') {
      return res.status(403).json({
        message: 'Admin accounts must sign in at /admin/login',
        redirectTo: '/admin/login',
      });
    }

    // Artists must be approved before they can log in
    if (user.role === 'artist' && !user.isApproved) {
      return res.status(401).json({ message: 'Your artist account is pending admin approval' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate an admin (admin only)
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. This login is for administrators only.',
        redirectTo: '/login',
      });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set in authMiddleware protect
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.state = req.body.state !== undefined ? req.body.state : user.state;
      user.specialty = req.body.specialty !== undefined ? req.body.specialty : user.specialty;

      // Handle Cloudinary Upload
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'artful-booking/users'
        });
        user.profileImage = uploadResponse.secure_url;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        state: updatedUser.state,
        specialty: updatedUser.specialty,
        token: req.headers.authorization.split(' ')[1], // Preserve existing token (role unchanged)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  updateUserProfile,
};
