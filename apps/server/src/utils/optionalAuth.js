const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

/**
 * Check if the request has a valid auth token without blocking unauthenticated users.
 * Unlike the `protect` middleware, this does NOT return a 401 error — it just returns true/false.
 * Enforces token revocation: tokens whose version no longer matches the user are treated as
 * unauthenticated (e.g. after a password change).
 */
const isAuthenticated = async (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return false;
      return decoded.v === user.tokenVersion;
    }
  } catch {
    // Token invalid, expired, or revoked — treat as unauthenticated
  }
  return false;
};

module.exports = { isAuthenticated };
