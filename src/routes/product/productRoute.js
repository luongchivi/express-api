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
  uploadImagesProduct,
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
  uploadImagesProductRes,
  getAllProductsQuery,
} = require('./productSchema');
const uploadCloud = require('../../lib/cloudinary');


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

// POST /api/v1/products/{productId}/image-upload
router.post(
  '/:productId/image-upload',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('write'),
  validateParams(productIdParam),
  uploadCloud.array('images', parseInt(process.env.UPLOAD_MAX, 10)),
  validateResponse(uploadImagesProductRes),
  uploadImagesProduct,
);


module.exports = router;
