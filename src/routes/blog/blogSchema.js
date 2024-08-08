const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createListResultsSchemaResponse,
  createSchemaQuery,
  createMessageSchemaResponse,
} = require('../shared');


const createBlogReq = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const createBlogRes = createResultsSchemaResponse({
  blog: Joi.object().required(),
});

const formDataFieldsUploadConfig = [
  { name: 'thumbImage', maxCount: 1 },
];

const blogIdParam = Joi.object({
  blogId: Joi.number().required(),
});

const getBlogRes = createResultsSchemaResponse({
  blog: Joi.object().required(),
});

const getAllBlogQuery = createSchemaQuery({
  title: Joi.string().optional(),
  userId: Joi.number().optional(),
  createdAt: Joi.string().optional(),
});

const getAllBlogRes = createListResultsSchemaResponse({
  blogs: Joi.array().required(),
});

const deleteBlogRes = createMessageSchemaResponse();

module.exports = {
  createBlogReq,
  createBlogRes,
  formDataFieldsUploadConfig,
  blogIdParam,
  getBlogRes,
  getAllBlogQuery,
  getAllBlogRes,
  deleteBlogRes,
};
