const Joi = require('joi');
const {
  createSchemaQuery,
  createListResultsSchemaResponse,
} = require('../shared');


const getAllWardsRes = createListResultsSchemaResponse({
  wards: Joi.array().items(Joi.object()).required(),
});

const getAllWardsQuery = createSchemaQuery({
  districtId: Joi.number().optional(),
  name: Joi.string().optional(),
  code: Joi.number().optional(),
});

module.exports = {
  getAllWardsRes,
  getAllWardsQuery,
};
