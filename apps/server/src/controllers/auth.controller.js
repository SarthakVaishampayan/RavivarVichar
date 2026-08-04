const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../utils/email');

// ─── Audit helper ───
const logActivity = async (action, resource, resourceId, user, details) => {
  try {
    await ActivityLog.create({ action, resource, resourceId, user: user?._id, details });
  } catch (err) {
    // Audit failures must never break the primary flow
    console.error('Audit log write failed:', err.message);
  }
};

// ─── Tokens ───
// Tokens embed the user's tokenVersion so a password change revokes everything issued before it.
const generateTokens = (user) => {
  const accessToken = jwt.sign({ id: user._id, v: user.tokenVersion }, env.JWT_ACCESS_SECRET, { expiresIn: '24h' });
  const refreshToken = jwt.sign({ id: user._id, v: user.tokenVersion }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ─── Register (admin-only — route is protected) ───
const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 'User already exists with this email', 400);
  }

  const user = await User.create({ name, email, password });
  // Admin-only registration: do NOT issue tokens or swap the refresh cookie —
  // the creating admin keeps their own session.
  await logActivity('register', 'User', user._id, req.user, `Registered user: ${email}`);

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  }, 'Registration successful', 201);
});

// ─── Login ───
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    await logActivity('login_failed', 'User', null, null, `Failed login attempt for: ${email}`);
    return sendError(res, 'Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await logActivity('login_failed', 'User', user._id, null, `Failed login attempt for: ${email}`);
    return sendError(res, 'Invalid email or password', 401);
  }

  const tokens = generateTokens(user);
  setRefreshCookie(res, tokens.refreshToken);
  await logActivity('login', 'User', user._id, user, `Logged in: ${email}`);

  sendSuccess(res, {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken: tokens.accessToken,
  }, 'Login successful');
});

// ─── Refresh (rotates the refresh token on every use) ───
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
  if (decoded.v !== user.tokenVersion) {
    return sendError(res, 'Session revoked, please log in again', 401);
  }

  // Rotate: issue a brand-new refresh token, invalidating the presented one
  const tokens = generateTokens(user);
  setRefreshCookie(res, tokens.refreshToken);

  sendSuccess(res, { accessToken: tokens.accessToken });
});

// ─── Logout ───
const logout = catchAsync(async (req, res) => {
  res.clearCookie('refreshToken');
  if (req.user) {
    await logActivity('logout', 'User', req.user._id, req.user, `Logged out: ${req.user.email}`);
  }
  sendSuccess(res, null, 'Logged out successfully');
});

// ─── Change password (logged-in) ───
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    await logActivity('change_password_failed', 'User', user._id, user, 'Incorrect current password');
    return sendError(res, 'Current password is incorrect', 400);
  }
  if (currentPassword === newPassword) {
    return sendError(res, 'New password must be different from the current password', 400);
  }

  user.password = newPassword;
  user.tokenVersion += 1; // revoke all existing tokens
  await user.save();

  await logActivity('change_password', 'User', user._id, user, 'Password changed');
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Password changed successfully. Please log in again.');
});

// ─── Forgot password (public, sends reset link/token) ───
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  // Always respond the same way to avoid user enumeration
  const user = await User.findOne({ email });
  if (user) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.ADMIN_URL}/reset-password?token=${resetToken}`;
    await logActivity('forgot_password', 'User', user._id, user, `Password reset requested for: ${email}`);

    try {
      await sendEmail({
        to: email,
        subject: 'Reset your Ravivar Vichar admin password',
        html: `<p>You requested a password reset for your Ravivar Vichar admin account.</p>
<p>Click below to choose a new password (valid for 1 hour):</p>
<p><a href="${resetUrl}">${resetUrl}</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>`,
        text: `Reset your password here (valid for 1 hour): ${resetUrl}`,
      });
    } catch (err) {
      console.error('Reset email failed:', err.message);
    }
  }

  sendSuccess(res, null, 'If an account exists for that email, a reset link has been sent.');
});

// ─── Reset password (public, token from email) ───
const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken');

  if (!user) {
    return sendError(res, 'Reset token is invalid or has expired', 400);
  }

  user.password = newPassword;
  user.tokenVersion += 1; // revoke all existing tokens
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await logActivity('reset_password', 'User', user._id, user, `Password reset for: ${user.email}`);
  sendSuccess(res, null, 'Password reset successful. You can now log in with your new password.');
});

// ─── Me ───
const getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  sendSuccess(res, { user });
});

module.exports = { register, login, refresh, logout, changePassword, forgotPassword, resetPassword, getMe };
