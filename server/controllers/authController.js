const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
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
      isApproved: userRole === 'artist' ? false : true
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
            token: generateToken(user._id),
         });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      if (user.role === 'artist' && !user.isApproved) {
        return res.status(401).json({ message: 'Your artist account is pending admin approval' });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
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
        token: req.headers.authorization.split(' ')[1], // Preserve existing token
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
  getMe,
  updateUserProfile,
};
