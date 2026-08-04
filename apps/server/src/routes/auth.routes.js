const express = require('express');
const router = express.Router();
const {
  register, login, refresh, logout, changePassword, forgotPassword, resetPassword, getMe,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  loginSchema, registerSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema,
} = require('@ravivarvichar/shared');

// Registration is admin-only — prevents anyone from creating their own admin account
router.post('/register', protect, authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, validate(changePasswordSchema), changePassword);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

module.exports = router;
