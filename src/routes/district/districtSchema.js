const Joi = require('joi');
const {
  createSchemaQuery,
  createListResultsSchemaResponse,
} = require('../shared');


const getAllDistrictsRes = createListResultsSchemaResponse({
  districts: Joi.array().items(Joi.object()).required(),
});


const getAllDistrictsQuery = createSchemaQuery({
  provinceId: Joi.string().optional(),
  name: Joi.string().optional(),
  code: Joi.string().optional(),
  id: Joi.string().optional(),
});

module.exports = {
  getAllDistrictsRes,
  getAllDistrictsQuery,
};
