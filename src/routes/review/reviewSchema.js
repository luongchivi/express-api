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

const getCountReviewStarProductRes = createResultsSchemaResponse({
  totalReviews: Joi.number().required(),
  totalZeroStar: Joi.number().required(),
  totalOneStar: Joi.number().required(),
  totalTwoStar: Joi.number().required(),
  totalThreeStar: Joi.number().required(),
  totalFourStar: Joi.number().required(),
  totalFiveStar: Joi.number().required(),
})

module.exports = {
  productIdParam,
  addReviewProductReq,
  addReviewProductRes,
  formDataFieldsUploadConfig,
  getCountReviewStarProductRes,
};
