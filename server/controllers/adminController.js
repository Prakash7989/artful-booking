const User = require('../models/User');

// @desc    Get all artists (pending + approved + rejected)
// @route   GET /api/admin/artists
// @access  Private/Admin
const getArtists = async (req, res) => {
  try {
    const artists = await User.find({ role: 'artist' }).sort({ createdAt: -1 });
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve an artist
// @route   PATCH /api/admin/artists/:id/approve
// @access  Private/Admin
const approveArtist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'artist') {
      return res.status(400).json({ message: 'User is not an artist' });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: 'Artist approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject an artist
// @route   PATCH /api/admin/artists/:id/reject
// @access  Private/Admin
const rejectArtist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'artist') {
      return res.status(400).json({ message: 'User is not an artist' });
    }

    user.isApproved = false;
    await user.save();

    res.status(200).json({ message: 'Artist rejected successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin account' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArtists,
  approveArtist,
  rejectArtist,
  getAllUsers,
  deleteUser,
};
