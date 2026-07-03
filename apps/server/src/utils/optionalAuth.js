const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Check if the request has a valid auth token without blocking unauthenticated users.
 * Unlike the `protect` middleware, this does NOT return a 401 error — it just returns true/false.
 */
const isAuthenticated = (req) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, env.JWT_ACCESS_SECRET);
      return true;
    }
  } catch {
    // Token invalid or expired — treat as unauthenticated
  }
  return false;
};

module.exports = { isAuthenticated };
