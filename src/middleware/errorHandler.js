const { buildErrorResponse } = require('../routes/shared');


function errorHandler(err, req, res, _next) {
  const { statusCode, messageErrorAPI, ...restError } = err;

  buildErrorResponse(res, err.message || 'Internal Server Error.', {
    errorStack: restError,
    messageErrorAPI,
    errorEndpoint: req.url,
  }, statusCode || 500);
}

module.exports = errorHandler;
