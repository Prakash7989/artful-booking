const User = require('../models/User');

// @desc    Get all artists with filters
// @route   GET /api/artists
// @access  Public
const getArtists = async (req, res) => {
  try {
    const { search, artForm, state, sort } = req.query;
    
    let query = { role: 'artist', isApproved: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { artForm: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }

    if (artForm && artForm !== 'All Art Forms') {
      query.artForm = artForm;
    }

    if (state && state !== 'All States') {
      query.state = state;
    }

    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'price-low') sortOption = { price: 1 };
    else if (sort === 'price-high') sortOption = { price: -1 };
    else if (sort === 'reviews') sortOption = { reviewsCount: -1 };
    else sortOption = { createdAt: -1 };

    const artists = await User.find(query).sort(sortOption);
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get artist by ID
// @route   GET /api/artists/:id
// @access  Public
const getArtistById = async (req, res) => {
  try {
    const artist = await User.findById(req.params.id).select('-password');
    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }
    // Add defaults for missing fields to prevent frontend crashes
    const artistObj = artist.toObject();
    
    if (!artistObj.gallery || artistObj.gallery.length === 0) {
      artistObj.gallery = [{ url: artistObj.profileImage || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', type: 'image', title: 'Profile' }];
    }
    
    if (!artistObj.pastPerformances) artistObj.pastPerformances = [];
    if (!artistObj.customerReviews) artistObj.customerReviews = [];
    if (!artistObj.pricing) {
      artistObj.pricing = {
        packages: [{ name: 'Standard Performance', duration: '2 Hours', description: 'Complete traditional performance', price: artistObj.price || 0 }],
        addOns: []
      };
    }
    if (!artistObj.availability) {
      artistObj.availability = { bookedDates: [], blockedDates: [] };
    }

    res.status(200).json(artistObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper to calculate profile completeness
const calculateCompleteness = (artist) => {
  const fields = [
    { name: 'bio', label: 'Professional Bio', weight: 20 },
    { name: 'story', label: 'Story of Your Art', weight: 15 },
    { name: 'specialty', label: 'Specialty', weight: 10 },
    { name: 'experience', label: 'Experience', weight: 10 },
    { name: 'price', label: 'Base Price', weight: 10 },
    { name: 'gallery', label: 'Gallery Images', weight: 15, isArray: true },
    { name: 'pricing', label: 'Pricing Packages', weight: 20, isNested: 'packages' }
  ];

  let score = 0;
  const missing = [];

  fields.forEach(field => {
    let hasValue = false;
    if (field.isArray) {
      hasValue = artist[field.name] && artist[field.name].length > 0;
    } else if (field.isNested) {
      hasValue = artist[field.name] && artist[field.name][field.isNested] && artist[field.name][field.isNested].length > 0;
    } else {
      hasValue = !!artist[field.name];
    }

    if (hasValue) {
      score += field.weight;
    } else {
      missing.push(field.label);
    }
  });

  return { score, missing };
};

// @desc    Get current artist profile
// @route   GET /api/artists/me
// @access  Private (Artist)
const getArtistProfile = async (req, res) => {
  try {
    const artist = await User.findById(req.user._id).select('-password');
    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist profile not found' });
    }

    const artistObj = artist.toObject();
    
    // Ensure safe defaults
    if (!artistObj.gallery) artistObj.gallery = [];
    if (!artistObj.pastPerformances) artistObj.pastPerformances = [];
    if (!artistObj.customerReviews) artistObj.customerReviews = [];
    if (!artistObj.pricing) artistObj.pricing = { packages: [], addOns: [] };
    if (!artistObj.availability) artistObj.availability = { bookedDates: [], blockedDates: [] };

    // Calculate completeness
    const completeness = calculateCompleteness(artistObj);
    artistObj.completeness = completeness;

    res.status(200).json(artistObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update artist profile
// @route   PUT /api/artists/profile
// @access  Private (Artist)
const updateArtistProfile = async (req, res) => {
  try {
    const artist = await User.findById(req.user._id);

    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const { 
      name, bio, state, specialty, 
      experience, price, story, 
      galleryToDelete, availability,
      pricing, available, approvalStatus
    } = req.body;

    // Update basic fields
    artist.name = name || artist.name;
    artist.bio = bio !== undefined ? bio : artist.bio;
    artist.state = state !== undefined ? state : artist.state;
    artist.specialty = specialty !== undefined ? specialty : artist.specialty;
    artist.experience = experience !== undefined ? experience : artist.experience;
    artist.price = price !== undefined ? Number(price) : artist.price;
    artist.story = story !== undefined ? story : artist.story;
    artist.available = available !== undefined ? available === 'true' || available === true : artist.available;
    artist.approvalStatus = approvalStatus !== undefined ? approvalStatus : artist.approvalStatus;

    // Handle Availability & Pricing (passed as JSON strings in multipart/form-data)
    if (availability) artist.availability = JSON.parse(availability);
    if (pricing) artist.pricing = JSON.parse(pricing);

    // Handle Gallery Deletions
    if (galleryToDelete) {
      const deleteIds = JSON.parse(galleryToDelete);
      artist.gallery = artist.gallery.filter(item => !deleteIds.includes(item._id.toString()));
    }

    // Handle New Image Uploads for Gallery
    if (req.files && req.files.length > 0) {
      const cloudinary = require('../config/cloudinary');
      const uploadPromises = req.files.map(async (file) => {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'artful-booking/galleries'
        });
        return {
          url: uploadResponse.secure_url,
          type: 'image',
          title: file.originalname.split('.')[0]
        };
      });

      const newGalleryItems = await Promise.all(uploadPromises);
      artist.gallery.push(...newGalleryItems);
    }

    const updatedArtist = await artist.save();
    res.status(200).json(updatedArtist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a review for an artist
// @route   POST /api/artists/:id/reviews
// @access  Private (Customer)
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const artist = await User.findById(req.params.id);

    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const review = {
      user: req.user.name,
      rating: Number(rating),
      comment,
      date: new Date().toISOString()
    };

    artist.customerReviews.push(review);
    artist.reviewsCount = artist.customerReviews.length;

    // Calculate dynamic rating
    const totalRating = artist.customerReviews.reduce((acc, item) => item.rating + acc, 0);
    artist.rating = (totalRating / artist.customerReviews.length).toFixed(1);

    await artist.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArtists,
  getArtistById,
  getArtistProfile,
  updateArtistProfile,
  addReview
};
