const Joi = require('joi');
const {
  createResultsSchemaResponse,
  createSchemaQuery,
} = require('../shared');


const getAllWardsRes = createResultsSchemaResponse({
  wards: Joi.array().items(Joi.object()).required(),
});

const getAllWardsQuery = createSchemaQuery({
  districtId: Joi.number().required(),
});

module.exports = {
  getAllWardsRes,
  getAllWardsQuery,
};
