const express = require('express');
const router = express.Router();
const {
  verifyPermission,
  verifyRole
} = require('../../middleware/authHandler');
const {
  validateResponse,
  validateRequest,
  validateParams
} = require('../../middleware/validationHandler');
const {
  getAllProducts,
  addProduct,
  getProductDetails,
  updateProduct,
  deleteProduct
} = require('../product/productController');
const {
  getAllProductsRes,
  addProductReq,
  addProductRes,
  productIdParam,
  updateProductReq,
  updateProductRes,
  getProductDetailsRes,
  deleteProductRes
} = require('../product/productSchema');


// GET /api/v1/products
router.get(
  '/',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateResponse(getAllProductsRes),
  getAllProducts
);

// POST /api/v1/products
router.post(
  '/',
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateRequest(addProductReq),
  validateResponse(addProductRes),
  addProduct
);

// GET /api/v1/categories/{categoryId}
router.get(
  '/:productId',
  verifyRole(['Admin']),
  verifyPermission('read'),
  validateParams(productIdParam),
  validateResponse(getProductDetailsRes),
  getProductDetails
);

// PUT /api/v1/categories/{categoryId}
router.put(
  '/:productId',
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(productIdParam),
  validateRequest(updateProductReq),
  validateResponse(updateProductRes),
  updateProduct
);

// DELETE /api/v1/categories/{categoryId}
router.delete(
  '/:productId',
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(productIdParam),
  validateResponse(deleteProductRes),
  deleteProduct
);


module.exports = router;
