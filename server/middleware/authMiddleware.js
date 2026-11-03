
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Verify that the account still exists and is active
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'User account not found. Please log in again.'
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: 'Your account has been deactivated.'
      });
    }

    req.user = {
      id: user._id,
      role: user.role
    };

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = authMiddleware;
