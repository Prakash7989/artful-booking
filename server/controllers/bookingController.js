const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
const createBooking = async (req, res) => {
  try {
    const { artistId, date, message, pricingPackage, location } = req.body;

    const artist = await User.findById(artistId);
    if (!artist || artist.role !== 'artist' || !artist.available) {
      return res.status(404).json({ message: 'Artist not found or not available' });
    }

    // Check for double booking
    const existingBooking = await Booking.findOne({
      artist: artistId,
      date: new Date(date).toISOString(),
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Artist is already booked or has a pending request for this date' });
    }

    const booking = await Booking.create({
      customer: req.user._id,
      artist: artistId,
      date,
      price: pricingPackage ? pricingPackage.price : artist.price,
      pricingPackage,
      location: location || 'Venue TBD',
      message
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for an artist
// @route   GET /api/bookings/artist
// @access  Private (Artist)
const getArtistBookings = async (req, res) => {
  try {
    if (req.user.role !== 'artist') {
      return res.status(403).json({ message: 'Only artists can view their bookings' });
    }

    const bookings = await Booking.find({ artist: req.user._id })
      .populate('customer', 'name email profileImage')
      .sort({ date: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a customer
// @route   GET /api/bookings/user
// @access  Private (Customer)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('artist', 'name email profileImage artForm state')
      .sort({ date: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id
// @access  Private (Artist)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the artist for this booking can update it
    if (booking.artist.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    // If confirmed, update artist's blocked dates
    if (status === 'confirmed') {
      const artist = await User.findById(booking.artist);
      if (artist) {
        const bookingDate = new Date(booking.date).toISOString().split('T')[0];
        if (!artist.availability.bookedDates.includes(bookingDate)) {
          artist.availability.bookedDates.push(bookingDate);
          await artist.save();
        }
      }
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getArtistBookings,
  getUserBookings,
  updateBookingStatus
};
