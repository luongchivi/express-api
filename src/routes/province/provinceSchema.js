const Joi = require('joi');
const {
  createListResultsSchemaResponse,
  createSchemaQuery,
} = require('../shared');


const getAllProvincesRes = createListResultsSchemaResponse({
  provinces: Joi.array().items(Joi.object()).required(),
});

const getAllProvincesQuery = createSchemaQuery({
  name: Joi.string().optional(),
  id: Joi.string().optional(),
  code: Joi.string().optional(),
});


module.exports = {
  getAllProvincesRes,
  getAllProvincesQuery,
};
