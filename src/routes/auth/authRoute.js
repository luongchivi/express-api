const express = require('express');


const router = express.Router();
const {
  signUp,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
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
  resetPasswordParam,
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

// POST /api/v1/auth/reset-password/{resetToken}
router.post(
  '/reset-password/:resetToken',
  validateParams(resetPasswordParam),
  validateRequest(resetPasswordReq),
  validateResponse(resetPasswordRes),
  resetPassword,
);

module.exports = router;
