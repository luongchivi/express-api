const express = require('express');
const {
  verifyToken,
  verifyRole,
  verifyPermission,
} = require('../../middleware/authHandler');
const {
  validateRequest,
  validateResponse,
  validateParams,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  addReviewProduct,
  getCountReviewStarProduct,
  getReviewsProduct,
} = require('./reviewController');
const {
  addReviewProductReq,
  addReviewProductRes,
  productIdParam,
  formDataFieldsUploadConfig,
  getCountReviewStarProductRes,
  getReviewsProductRes,
  getReviewsProductQuery,
} = require('./reviewSchema');
const formDataFields = require('../../middleware/formDataHandler');


const router = express.Router();

// POST /api/v1/reviews/{productId}/product
router.post(
  '/:productId/product',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  validateParams(productIdParam),
  formDataFields(formDataFieldsUploadConfig),
  validateRequest(addReviewProductReq),
  validateResponse(addReviewProductRes),
  addReviewProduct,
);

// GET /api/v1/reviews/{productId}/product
router.get(
  '/:productId/product',
  validateParams(productIdParam),
  validateQuery(getReviewsProductQuery),
  validateResponse(getReviewsProductRes),
  getReviewsProduct,
);

// GET /api/v1/reviews/{productId}/count-review-star-product
router.get(
  '/:productId/count-review-star-product',
  validateParams(productIdParam),
  validateResponse(getCountReviewStarProductRes),
  getCountReviewStarProduct,
);

module.exports = router;
