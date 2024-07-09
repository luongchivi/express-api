const express = require('express');


const router = express.Router();

const {
  verifyPermission,
  verifyRole,
} = require('../../middleware/authHandler');
const {
  validateResponse,
  validateRequest,
} = require('../../middleware/validationHandler');
const {
  addToCart,
} = require('./cartController');
const {
  addToCartReq,
  addToCartRes,
} = require('./cartSchema');

// POST /api/v1/carts
router.post(
  '/',
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateRequest(addToCartReq),
  validateResponse(addToCartRes),
  addToCart,
);

module.exports = router;
