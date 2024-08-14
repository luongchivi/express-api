const Joi = require('joi');
const {
  createSchemaQuery,
  createListResultsSchemaResponse,
} = require('../shared');


const getAllWardsRes = createListResultsSchemaResponse({
  wards: Joi.array().items(Joi.object()).required(),
});

const getAllWardsQuery = createSchemaQuery({
  districtId: Joi.string().optional(),
  name: Joi.string().optional(),
  code: Joi.string().optional(),
  id: Joi.string().optional(),
});

module.exports = {
  getAllWardsRes,
  getAllWardsQuery,
};
