const express = require('express');


const router = express.Router();
const {
  verifyPermission,
  verifyRole,
  verifyToken,
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
  getCurrentCart,
} = require('./cartController');
const {
  addToCartReq,
  addToCartRes,
  productIdParam,
  updateQuantityProductInCartReq,
  updateQuantityProductInCartRes,
  deleteProductInCartRes,
  getCurrentCartRes,
} = require('./cartSchema');


// POST /api/v1/cart/products
router.post(
  '/products',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateRequest(addToCartReq),
  validateResponse(addToCartRes),
  addToCart,
);

// PATCH /api/v1/cart/products/{productId}
router.patch(
  '/products/:productId',
  verifyToken,
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
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('delete'),
  validateParams(productIdParam),
  validateResponse(deleteProductInCartRes),
  deleteProductInCart,
);

// GET /api/v1/cart/me
router.get(
  '/me',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('read'),
  validateResponse(getCurrentCartRes),
  getCurrentCart,
);

module.exports = router;
