const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Base protect middleware — validates token and cross-checks embedded role vs DB role
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      // Cross-validate: the role embedded in the token must match the DB role.
      // This prevents using a customer token to hit admin routes even if ids matched.
      if (decoded.role && decoded.role !== user.role) {
        return res.status(401).json({ message: 'Token role mismatch — please login again' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access guard
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: '${req.user.role}' role cannot access this resource`,
      });
    }
    next();
  };
};

// Convenience role-specific protect middlewares
const protectAdmin    = [protect, authorize('admin')];
const protectArtist   = [protect, authorize('artist')];
const protectCustomer = [protect, authorize('customer')];

module.exports = { protect, authorize, protectAdmin, protectArtist, protectCustomer };

