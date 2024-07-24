const Joi = require('joi');
const { createResultsSchemaResponse } = require('../shared');


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

module.exports = {
  createBlogReq,
  createBlogRes,
  formDataFieldsUploadConfig,
}
