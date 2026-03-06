const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true // Slug like 'kerala', 'tamil-nadu'
  },
  name: {
    type: String,
    required: true
  },
  region: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Islands'],
    required: true
  },
  icon: {
    type: String, // Emoji or icon name
    default: '🏛️'
  },
  description: {
    type: String,
    required: true
  },
  culturalHighlights: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('State', stateSchema);
