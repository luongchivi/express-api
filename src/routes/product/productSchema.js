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
  thumbImageUrl: Joi.string().required(),
  imageUrl: Joi.array().items(Joi.string()).optional(),
  unitPrice: Joi.number().required(),
  unitsInStock: Joi.number().optional(),
  unitsOnOrder: Joi.number().optional(),
  unitsSold: Joi.number().optional(),
  discount: Joi.number().optional(),
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
  thumbImageUrl: Joi.string().optional(),
  imageUrl: Joi.array().items(Joi.string()).optional(),
  unitPrice: Joi.number().optional(),
  unitsInStock: Joi.number().optional(),
  unitsOnOrder: Joi.number().optional(),
  unitsSold: Joi.number().optional(),
  discount: Joi.number().optional(),
  supplierId: Joi.number().allow(null).optional(),
  categoryId: Joi.number().allow(null).optional(),
});

const updateProductRes = createResultsSchemaResponse({
  product: Joi.object().required(),
});

const getProductDetailsRes = createResultsSchemaResponse({
  product: Joi.object().required(),
});

const deleteProductRes = createMessageSchemaResponse();

const uploadImagesProductRes = createResultsSchemaResponse({
  product: Joi.object().required(),
});

const getAllProductsQuery = createSchemaQuery({
  name: Joi.string().optional(),
  unitPrice: Joi.number().optional(),
  unitsInStock: Joi.number().optional(),
  unitsOnOrder: Joi.number().optional(),
  unitsSold: Joi.number().optional(),
  createdAt: Joi.string().optional(),
});

module.exports = {
  getAllProductsRes,
  addProductReq,
  addProductRes,
  productIdParam,
  updateProductReq,
  updateProductRes,
  getProductDetailsRes,
  deleteProductRes,
  uploadImagesProductRes,
  getAllProductsQuery,
};
