const express = require('express');
const router = express.Router();
const {
  signUp,
  login,
  refreshToken
} = require('./authController');
const {
  signUpReq,
  signUpRes,
  loginReq,
  loginRes,
  refreshTokenReq,
  refreshTokenRes
} = require('./authSchema');
const {
  validateRequest,
  validateResponse
} = require('../../middleware/validationHandler');


// POST /api/v1/auth/signup
router.post(
  '/signup',
  validateRequest(signUpReq),
  validateResponse(signUpRes),
  signUp
);

// POST /api/v1/auth/login
router.post('/login',
  validateRequest(loginReq),
  validateResponse(loginRes),
  login
);

// POST /api/v1/auth/refresh-token
router.post(
  '/refresh-token',
  validateRequest(refreshTokenReq),
  validateResponse(refreshTokenRes),
  refreshToken
);

module.exports = router;
