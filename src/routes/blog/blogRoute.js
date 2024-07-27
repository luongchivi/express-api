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
  createBlog,
  getBlog,
  getAllBlog,
} = require('./blogController');
const {
  createBlogReq,
  createBlogRes,
  blogIdParam,
  getBlogRes,
  formDataFieldsUploadConfig,
  getAllBlogQuery,
  getAllBlogRes,
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

// GET /api/v1/blogs/{blogId}
router.get(
  '/:blogId',
  validateParams(blogIdParam),
  validateResponse(getBlogRes),
  getBlog,
);

// GET /api/v1/blogs
router.get(
  '/',
  validateQuery(getAllBlogQuery),
  validateResponse(getAllBlogRes),
  getAllBlog,
);

module.exports = router;
