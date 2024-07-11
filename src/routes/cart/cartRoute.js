const express = require('express');


const router = express.Router();

const {
  verifyPermission,
  verifyRole,
} = require('../../middleware/authHandler');
const {
  validateResponse,
  validateRequest,
  validateParams,
} = require('../../middleware/validationHandler');
const {
  addToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
} = require('./cartController');
const {
  addToCartReq,
  addToCartRes,
  productIdParam,
  updateQuantityProductInCartReq,
  updateQuantityProductInCartRes,
  deleteProductInCartRes,
} = require('./cartSchema');

// POST /api/v1/cart/products
router.post(
  '/products',
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateRequest(addToCartReq),
  validateResponse(addToCartRes),
  addToCart,
);

// PATCH /api/v1/cart/products/{productId}
router.patch(
  '/products/:productId',
  verifyRole(['Admin', 'User']),
  verifyPermission('update'),
  validateParams(productIdParam),
  validateRequest(updateQuantityProductInCartReq),
  validateResponse(updateQuantityProductInCartRes),
  updateQuantityProductInCart,
);

// DELETE /api/v1/cart/products/{productId}
router.delete(
  '/products/:productId',
  verifyRole(['Admin', 'User']),
  verifyPermission('delete'),
  validateParams(productIdParam),
  validateResponse(deleteProductInCartRes),
  deleteProductInCart,
);

module.exports = router;
