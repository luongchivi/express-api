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
  deleteBlog,
  updateBlog,
} = require('./blogController');
const {
  createBlogReq,
  createBlogRes,
  blogIdParam,
  getBlogRes,
  formDataFieldsUploadConfig,
  getAllBlogQuery,
  getAllBlogRes,
  deleteBlogRes,
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

// DELETE /api/v1/blogs/{blogId}
router.delete(
  '/:blogId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('delete'),
  validateParams(blogIdParam),
  validateResponse(deleteBlogRes),
  deleteBlog,
);

// PUT /api/v1/blogs/{blogId}
router.put(
  '/:blogId',
  verifyToken,
  verifyRole(['Admin']),
  verifyPermission('update'),
  validateParams(blogIdParam),
  formDataFields(formDataFieldsUploadConfig),
  validateResponse(deleteBlogRes),
  updateBlog,
);

module.exports = router;
