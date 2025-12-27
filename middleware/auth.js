const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_in_production');
      
      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized to access this route' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Role-based authorization
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }

    next();
  };
};

// Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_change_in_production', {
    expiresIn: '30d'
  });
};



