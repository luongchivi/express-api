const Joi = require('joi');
const { createResultsSchemaResponse } = require('../shared');


const productIdParam = Joi.object({
  productId: Joi.number().required(),
});

const addReviewProductReq = Joi.object({
  rating: Joi.number().required().min(0).max(5),
  comment: Joi.string().optional(),
});

const addReviewProductRes = createResultsSchemaResponse({
  review: Joi.object().required(),
});

const formDataFieldsUploadConfig = [
  { name: 'feedbackImages', maxCount: 10 }, // Tối đa 10 ảnh
];

module.exports = {
  productIdParam,
  addReviewProductReq,
  addReviewProductRes,
  formDataFieldsUploadConfig,
};
