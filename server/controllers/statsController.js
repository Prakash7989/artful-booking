const User = require('../models/User');
const Booking = require('../models/Booking');
const State = require('../models/State');
const ArtForm = require('../models/ArtForm');

// @desc    Get counts for home page stats
// @route   GET /api/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    // 1. Basic Counts
    const totalArtists = await User.countDocuments({ 
      role: 'artist', 
      isApproved: true 
    });

    const successfulBookings = await Booking.countDocuments({ 
      status: { $in: ['confirmed', 'completed'] } 
    });

    const statesList = await User.distinct('state', { 
      role: 'artist', 
      isApproved: true 
    });
    const statesCovered = statesList.length;

    // 2. State-wise Statistics
    const allStates = await State.find({});
    const artistCountsByState = await User.aggregate([
      { $match: { role: 'artist', isApproved: true } },
      { $group: { _id: '$state', count: { $sum: 1 } } }
    ]);

    const artFormCountsByState = await ArtForm.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } }
    ]);

    const stateStats = allStates.map(state => {
      const artistCount = artistCountsByState.find(s => s._id === state.id)?.count || 0;
      const artFormCount = artFormCountsByState.find(s => s._id === state.id)?.count || 0;
      return {
        id: state.id,
        name: state.name,
        artistCount,
        artFormCount,
        icon: state.icon
      };
    });

    // 3. Art Form Statistics
    const allArtForms = await ArtForm.find({});
    const artistCountsByArtForm = await User.aggregate([
      { $match: { role: 'artist', isApproved: true } },
      { $group: { _id: '$artForm', count: { $sum: 1 } } }
    ]);

    const artFormStats = allArtForms.map(af => {
      const artistCount = artistCountsByArtForm.find(a => a._id === af.name)?.count || 0;
      return {
        id: af._id,
        name: af.name,
        state: af.state,
        artistCount,
        icon: af.image // Using image/icon
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalArtists,
        successfulBookings,
        statesCovered,
        stateStats,
        artFormStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
