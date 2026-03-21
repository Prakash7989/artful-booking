require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB().then(() => {
  const seedData = require('./utils/seedData');
  seedData();
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/states', require('./routes/stateRoutes'));
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Health check route for Vercel deployment
app.get('/', (req, res) => {
  res.status(200).json({ message: "Backend is running successfully on Vercel!" });
});


// Basic error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
