const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse,
  createSchemaQuery,
} = require('../shared');


const addCategoryReq = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

const addCategoryRes = createResultsSchemaResponse({
  category: Joi.object().required(),
});

const getAllCategoriesRes = createResultsSchemaResponse({
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
});

const updateCategoryRes = createResultsSchemaResponse({
  category: Joi.object().required(),
});

const assignSupplierReq = Joi.object({
  "companyName": Joi.string().required(),
});

const assignSupplierRes = createMessageSchemaResponse();

const deleteSupplierAssignReq = Joi.object({
  "companyName": Joi.string().required(),
});

const deleteSupplierAssignRes = createMessageSchemaResponse();

const getAllCategoriesQuery = createSchemaQuery();

const formDataFieldsUploadConfig = [
  { name: 'iconImage', maxCount: 1 },
  { name: 'thumbImage', maxCount: 1 },
];

module.exports = {
  addCategoryReq,
  addCategoryRes,
  getAllCategoriesQuery,
  getAllCategoriesRes,
  categoryIdParam,
  getCategoryDetailsRes,
  deleteCategoryRes,
  updateCategoryReq,
  updateCategoryRes,
  assignSupplierReq,
  assignSupplierRes,
  deleteSupplierAssignReq,
  deleteSupplierAssignRes,
  formDataFieldsUploadConfig,
};
