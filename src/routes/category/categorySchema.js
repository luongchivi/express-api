const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createListResultsSchemaResponse,
  createMessageSchemaResponse,
} = require('../shared');


const addCategoryReq = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
});

const addCategoryRes = createResultsSchemaResponse({
  category: Joi.object().required(),
});

const getAllCategoriesRes = createListResultsSchemaResponse({
  categories: Joi.array(),
});

const categoryIdParam = Joi.object({
  categoryId: Joi.number().required(),
});

const getCategoryDetailsRes = createResultsSchemaResponse({
  category: Joi.object().required(),
});

const deleteCategoryRes = createMessageSchemaResponse();

const updateCategoryReq = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
});

const updateCategoryRes = createResultsSchemaResponse({
  category: Joi.object().required(),
});

module.exports = {
  addCategoryReq,
  addCategoryRes,
  getAllCategoriesRes,
  categoryIdParam,
  getCategoryDetailsRes,
  deleteCategoryRes,
  updateCategoryReq,
  updateCategoryRes,
};
