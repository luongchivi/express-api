const { buildErrorResponse } = require('../routes/shared');


function errorHandler(err, req, res, _next) {
  const { statusCode, messageErrorAPI, ...restError } = err;

  if (err.name === 'MulterError') {
    return buildErrorResponse(res, `Invalid input form-data ${err.field}`, {
      err,
      messageErrorAPI,
      errorEndpoint: req.url,
    }, 400);
  }

  return buildErrorResponse(res, err.message || 'Internal Server Error.', {
    errorStack: restError,
    messageErrorAPI,
    errorEndpoint: req.url,
  }, statusCode || 500);
}

module.exports = errorHandler;
