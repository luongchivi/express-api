const Joi = require('joi');
const {
  createListResultsSchemaResponse,
} = require('../shared');


const getAllProvincesRes = createListResultsSchemaResponse({
  provinces: Joi.array().items(Joi.object()).required(),
});


module.exports = {
  getAllProvincesRes,
};
