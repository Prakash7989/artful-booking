const State = require('../models/State');
const ArtForm = require('../models/ArtForm');
const User = require('../models/User');

// @desc    Get all states
// @route   GET /api/states
// @access  Public
const getStates = async (req, res) => {
  try {
    const states = await State.find();
    
    // Enrich with counts (optional, or just return states)
    // For a real app, we might want to pre-calculate these or use aggregation
    const enrichedStates = await Promise.all(states.map(async (state) => {
      const artFormsCount = await ArtForm.countDocuments({ state: state.id });
      const artistsCount = await User.countDocuments({ state: state.name, role: 'artist', isApproved: true });
      return {
        ...state._doc,
        artForms: artFormsCount,
        artists: artistsCount
      };
    }));

    res.status(200).json(enrichedStates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get state by ID (slug)
// @route   GET /api/states/:id
// @access  Public
const getStateById = async (req, res) => {
  try {
    const state = await State.findOne({ id: req.params.id });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const artForms = await ArtForm.find({ state: state.id });
    const featuredArtists = await User.find({ 
      state: state.name, 
      role: 'artist', 
      isApproved: true 
    }).limit(4);

    res.status(200).json({
      ...state._doc,
      artForms,
      featuredArtists
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStates,
  getStateById
};
