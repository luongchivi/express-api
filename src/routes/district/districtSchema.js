const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createSchemaQuery,
} = require('../shared');


const getAllDistrictsRes = createResultsSchemaResponse({
  districts: Joi.array().items(Joi.object()).required(),
});


const getAllDistrictsQuery = createSchemaQuery({
  provinceId: Joi.number().required(),
});

module.exports = {
  getAllDistrictsRes,
  getAllDistrictsQuery,
};
