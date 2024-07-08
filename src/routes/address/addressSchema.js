const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createMessageSchemaResponse
} = require('../shared');

const addAddressReq = Joi.object({
  street: Joi.string().optional(),
  district: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  phone: Joi.string().optional(),
});

const addAddressRes = createResultsSchemaResponse({
  address: Joi.object().optional(),
});

const addressIdParam = Joi.object({
  addressId: Joi.number().required(),
});

const getAddressRes = createResultsSchemaResponse({
  address: Joi.object().required(),
});

const updateAddressReq = Joi.object({
  street: Joi.string().optional(),
  district: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  phone: Joi.string().optional(),
});

const updateAddressRes = createResultsSchemaResponse({
  address: Joi.object().required(),
})

const deleteAddressRes = createMessageSchemaResponse();

module.exports = {
  addAddressReq,
  addAddressRes,
  addressIdParam,
  getAddressRes,
  updateAddressReq,
  updateAddressRes,
  deleteAddressRes
}
