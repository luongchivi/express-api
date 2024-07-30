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
} = require('../../middleware/validationHandler');
const {
  addReviewProduct,
  getCountReviewStarProduct,
} = require('./reviewController');
const {
  addReviewProductReq,
  addReviewProductRes,
  productIdParam,
  formDataFieldsUploadConfig,
  getCountReviewStarProductRes,
} = require('./reviewSchema');
const formDataFields = require('../../middleware/formDataHandler');


const router = express.Router();

// POST /api/v1/reviews/{productId}
router.post(
  '/:productId',
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
  validateResponse(getCountReviewStarProductRes),
  getCountReviewStarProduct,
);

module.exports = router;
