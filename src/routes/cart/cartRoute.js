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
  updateQuantityProductInCart,
} = require('./cartController');
const {
  addToCartReq,
  addToCartRes,
  updateQuantityProductInCartReq,
  updateQuantityProductInCartRes,
} = require('./cartSchema');

// POST /api/v1/cart
router.post(
  '/',
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateRequest(addToCartReq),
  validateResponse(addToCartRes),
  addToCart,
);

// PUT /api/v1/cart
router.put(
  '/update-quantity',
  verifyRole(['Admin', 'User']),
  verifyPermission('update'),
  validateRequest(updateQuantityProductInCartReq),
  validateResponse(updateQuantityProductInCartRes),
  updateQuantityProductInCart,
);

module.exports = router;
