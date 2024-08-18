const Joi = require('joi');
const {
  createResultsSchemaResponse,
} = require('../shared');


const getAllOrderOfUserRes = createResultsSchemaResponse({
  sales: Joi.array().required(),
});

module.exports = {
  getAllOrderOfUserRes,
};
