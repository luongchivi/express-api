const Joi = require('joi');
const {
  createListResultsSchemaResponse,
  createResultsSchemaResponse,
  createMessageSchemaResponse,
  createSchemaQuery,
} = require('../shared');


const getAllProductsRes = createListResultsSchemaResponse({
  products: Joi.array().required(),
});

const addProductReq = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  unitPrice: Joi.number().required(),
  unitsInStock: Joi.number().optional(),
  unitsOnOrder: Joi.number().optional(),
  unitsSold: Joi.number().optional(),
  supplierId: Joi.number().allow(null).optional(),
  categoryId: Joi.number().allow(null).optional(),
  weight: Joi.number().required(),
  length: Joi.number().required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
});

const addProductRes = createResultsSchemaResponse({
  product: Joi.object().required(),
});

const productIdParam = Joi.object({
  productId: Joi.number().required(),
});

const updateProductReq = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  unitPrice: Joi.number().optional(),
  unitsInStock: Joi.number().optional(),
  unitsOnOrder: Joi.number().optional(),
  unitsSold: Joi.number().optional(),
  supplierId: Joi.number().allow(null).optional(),
  categoryId: Joi.number().allow(null).optional(),
  weight: Joi.number().optional(),
  length: Joi.number().optional(),
  width: Joi.number().optional(),
  height: Joi.number().optional(),
});

const updateProductRes = createResultsSchemaResponse({
  product: Joi.object().required(),
});

const getProductDetailsRes = createResultsSchemaResponse({
  product: Joi.object().required(),
});

const deleteProductRes = createMessageSchemaResponse();

const getAllProductsQuery = createSchemaQuery({
  name: Joi.string().optional(),
  unitPrice: Joi.number().optional(),
  unitsInStock: Joi.number().optional(),
  unitsOnOrder: Joi.number().optional(),
  unitsSold: Joi.number().optional(),
  createdAt: Joi.string().optional(),
});

const formDataFieldsUploadConfig = [
  { name: 'thumbImage', maxCount: 1 }, // 1 ảnh thumbnail
  { name: 'images', maxCount: 10 }, // Tối đa 10 ảnh
];

module.exports = {
  getAllProductsRes,
  addProductReq,
  addProductRes,
  productIdParam,
  updateProductReq,
  updateProductRes,
  getProductDetailsRes,
  deleteProductRes,
  getAllProductsQuery,
  formDataFieldsUploadConfig,
};
