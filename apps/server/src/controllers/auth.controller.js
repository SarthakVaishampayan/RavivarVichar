const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// Generate access & refresh tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Set refresh token as httpOnly cookie
const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// POST /api/v1/auth/register
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 'User already exists with this email', 400);
  }

  const user = await User.create({ name, email, password });
  const tokens = generateTokens(user._id);
  setRefreshCookie(res, tokens.refreshToken);

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: tokens.accessToken,
  }, 'Registration successful', 201);
});

// POST /api/v1/auth/login
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password', 401);
  }

  const tokens = generateTokens(user._id);
  setRefreshCookie(res, tokens.refreshToken);

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: tokens.accessToken,
  }, 'Login successful');
});

// POST /api/v1/auth/refresh
const refresh = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return sendError(res, 'No refresh token', 401);
  }

  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return sendError(res, 'User not found', 401);
  }

  const tokens = generateTokens(user._id);
  setRefreshCookie(res, tokens.refreshToken);

  sendSuccess(res, { accessToken: tokens.accessToken });
});

// POST /api/v1/auth/logout
const logout = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logged out successfully');
});

// GET /api/v1/auth/me
const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, { user });
});

module.exports = { register, login, refresh, logout, getMe };
