const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['customer', 'artist', 'admin'],
    default: 'customer'
  },
  profileImage: {
    type: String,
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  // Artist specific fields
  bio: {
    type: String
  },
  state: {
    type: String // We will match this with State model's id/name
  },
  artForm: {
    type: String
  },
  specialty: {
    type: String
  },
  experience: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  awards: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false // Artists should be false by default until admin approves
  },
  // Additional fields for Artist Profile
  story: {
    type: String
  },
  gallery: [{
    url: String,
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    title: String
  }],
  pastPerformances: [{
    event: String,
    venue: String,
    date: String
  }],
  pricing: {
    packages: [{
      name: String,
      duration: String,
      description: String,
      price: Number
    }],
    addOns: [{
      name: String,
      price: Number
    }]
  },
  availability: {
    bookedDates: [String],
    blockedDates: [String]
  },
  customerReviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: String
  }]
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
