const Joi = require('joi');
const {
  createSchemaQuery,
  createListResultsSchemaResponse,
} = require('../shared');


const getAllDistrictsRes = createListResultsSchemaResponse({
  districts: Joi.array().items(Joi.object()).required(),
});


const getAllDistrictsQuery = createSchemaQuery({
  provinceId: Joi.number().optional(),
  name: Joi.string().optional(),
  code: Joi.number().optional(),
});

module.exports = {
  getAllDistrictsRes,
  getAllDistrictsQuery,
};
