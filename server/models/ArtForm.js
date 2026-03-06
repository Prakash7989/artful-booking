const mongoose = require('mongoose');

const artFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Classical Dance', 'Folk Dance', 'Classical Music', 'Folk Music', 'Folk Theatre', 'Puppetry', 'Musical Storytelling', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: '/placeholder.svg'
  },
  state: {
    type: String, // Linking to state id/name
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ArtForm', artFormSchema);
