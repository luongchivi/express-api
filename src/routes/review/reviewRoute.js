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
} = require('./reviewController');
const {
  addReviewProductReq,
  addReviewProductRes,
  productIdParam,
  formDataFieldsUploadConfig,
} = require('./reviewSchema');
const formDataFields = require('../../middleware/formDataHandler');


const router = express.Router();

// POST /api/v1/reviews
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

module.exports = router;
