const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createListResultsSchemaResponse,
  createMessageSchemaResponse
} = require('../shared');


const addSupplierReq = Joi.object({
  companyName: Joi.string().required(),
  contactName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().optional(),
  region: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  country: Joi.string().optional(),
  phone: Joi.string().optional(),
  fax: Joi.string().optional(),
  homePage: Joi.string().optional(),
});

const addSupplierRes = createResultsSchemaResponse({
  supplier: Joi.object().required()
});

const getAllSuppliersRes = createListResultsSchemaResponse({
  suppliers: Joi.array()
});

const supplierIdParam = Joi.object({
  supplierId: Joi.number().required(),
});

const getSupplierDetailsRes = createResultsSchemaResponse({
  supplier: Joi.object().required()
});

const deleteSupplierRes = createMessageSchemaResponse();

const updateSupplierReq = Joi.object({
  companyName: Joi.string().optional(),
  contactName: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  region: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  country: Joi.string().optional(),
  phone: Joi.string().optional(),
  fax: Joi.string().optional(),
  homePage: Joi.string().optional(),
});

const updateSupplierRes = createResultsSchemaResponse({
  supplier: Joi.object().required()
});

module.exports = {
  getAllSuppliersRes,
  addSupplierReq,
  addSupplierRes,
  supplierIdParam,
  getSupplierDetailsRes,
  deleteSupplierRes,
  updateSupplierReq,
  updateSupplierRes
}
