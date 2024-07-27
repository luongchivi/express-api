const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createListResultsSchemaResponse,
  createSchemaQuery,
} = require('../shared');


const createBlogReq = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

const createBlogRes = createResultsSchemaResponse({
  blog: Joi.object().required(),
});

const formDataFieldsUploadConfig = [
  { name: 'images', maxCount: 10 },
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

module.exports = {
  createBlogReq,
  createBlogRes,
  formDataFieldsUploadConfig,
  blogIdParam,
  getBlogRes,
  getAllBlogQuery,
  getAllBlogRes,
};
