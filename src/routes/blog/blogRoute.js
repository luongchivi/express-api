const express = require('express');
const {
  verifyToken,
  verifyRole,
  verifyPermission,

} = require('../../middleware/authHandler');
const {
  validateRequest,
  validateResponse,
} = require('../../middleware/validationHandler');
const {
  createBlog,
} = require('./blogController');
const {
  createBlogReq,
  createBlogRes,
  formDataFieldsUploadConfig,
} = require('./blogSchema');
const formDataFields = require('../../middleware/formDataHandler');
const router = express.Router();

// POST /api/v1/blogs
router.post(
  '/',
  verifyToken,
  verifyRole(['Admin', 'User']),
  verifyPermission('write'),
  formDataFields(formDataFieldsUploadConfig),
  validateRequest(createBlogReq),
  validateResponse(createBlogRes),
  createBlog,
);

module.exports = router;
