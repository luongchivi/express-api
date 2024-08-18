const Joi = require('joi');
const {
  createResultsSchemaResponse,
} = require('../shared');


const saveTransactionPaypalReq = Joi.object({
  payloadResponsePaypal: Joi.string().required(),
  orderId: Joi.number().required(),
});

const saveTransactionPaypalRes = createResultsSchemaResponse({
  transactionPaypal: Joi.object().required(),
});

module.exports = {
  saveTransactionPaypalReq,
  saveTransactionPaypalRes,
};
