const express = require('express');


const router = express.Router();
const {
  signUp,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerifyEmail,
} = require('./authController');
const {
  signUpReq,
  signUpRes,
  loginReq,
  loginRes,
  refreshTokenReq,
  refreshTokenRes,
  forgotPasswordReq,
  forgotPasswordRes,
  resetPasswordReq,
  resetPasswordRes,
  verifyEmailParam,
  verifyEmailRes,
  resendVerifyEmailReq,
  resendVerifyEmailRes,
} = require('./authSchema');
const {
  validateRequest,
  validateResponse,
  validateParams,
} = require('../../middleware/validationHandler');


// POST /api/v1/auth/signup
router.post(
  '/signup',
  validateRequest(signUpReq),
  validateResponse(signUpRes),
  signUp,
);

// GET /api/v1/auth/verify-email/{verifyEmailToken}
router.get(
  '/verify-email/:verifyEmailToken',
  validateParams(verifyEmailParam),
  validateResponse(verifyEmailRes),
  verifyEmail,
);

// POST /api/v1/auth/resend-verify-email/{verifyEmailToken}
router.post(
  '/resend-verify-email',
  validateResponse(resendVerifyEmailReq),
  validateResponse(resendVerifyEmailRes),
  resendVerifyEmail,
);

// POST /api/v1/auth/login
router.post(
  '/login',
  validateRequest(loginReq),
  validateResponse(loginRes),
  login,
);

// POST /api/v1/auth/refresh-token
router.post(
  '/refresh-token',
  validateRequest(refreshTokenReq),
  validateResponse(refreshTokenRes),
  refreshToken,
);

// POST /api/v1/auth/forgot-password
router.post(
  '/forgot-password',
  validateRequest(forgotPasswordReq),
  validateResponse(forgotPasswordRes),
  forgotPassword,
);

// POST /api/v1/auth/reset-password
router.post(
  '/reset-password',
  validateRequest(resetPasswordReq),
  validateResponse(resetPasswordRes),
  resetPassword,
);

module.exports = router;
