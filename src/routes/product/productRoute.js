require('dotenv').config({ path: `${process.cwd()}/.env` });
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
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  getAllProducts,
  addProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
} = require('./productController');
const {
  getAllProductsRes,
  addProductReq,
  addProductRes,
  productIdParam,
  updateProductReq,
  updateProductRes,
  getProductDetailsRes,
  deleteProductRes,
  getAllProductsQuery,
  formDataFieldsUploadConfig,
} = require('./productSchema');
const formDataFields = require('../../middleware/formDataHandler');


// GET /api/v1/products
router.get(
  '/',
  validateQuery(getAllProductsQuery),
  validateResponse(getAllProductsRes),
  getAllProducts,
);

// POST /api/v1/products
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  formDataFields(formDataFieldsUploadConfig),
  validateRequest(addProductReq),
  validateResponse(addProductRes),
  addProduct,
);

// GET /api/v1/products/{productId}
router.get(
  '/:productId',
  validateParams(productIdParam),
  validateResponse(getProductDetailsRes),
  getProductDetails,
);

// PUT /api/v1/products/{productId}
router.put(
  '/:productId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(productIdParam),
  formDataFields(formDataFieldsUploadConfig),
  validateRequest(updateProductReq),
  validateResponse(updateProductRes),
  updateProduct,
);

// DELETE /api/v1/products/{productId}
router.delete(
  '/:productId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(productIdParam),
  validateResponse(deleteProductRes),
  deleteProduct,
);


module.exports = router;
