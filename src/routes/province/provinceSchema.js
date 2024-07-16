const Joi = require('joi');
const {
  createResultsSchemaResponse,
} = require('../shared');


const getAllProvincesRes = createResultsSchemaResponse({
  provinces: Joi.array().items(Joi.object()).required(),
});


module.exports = {
  getAllProvincesRes,
};
