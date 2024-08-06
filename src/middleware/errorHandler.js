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

  if (err.name.startsWith('Sequelize')) {
    // Handle Sequelize-specific errors
    switch (err.name) {
      case 'SequelizeUniqueConstraintError':
        return buildErrorResponse(res, err?.message || 'Unique constraint error.', {
          errorStack: restError,
          messageErrorAPI,
          errorEndpoint: req.url,
        }, 400);

      case 'SequelizeValidationError':
        return buildErrorResponse(res, err?.message || 'Validation error.', {
          errorStack: restError,
          messageErrorAPI,
          errorEndpoint: req.url,
        }, 400);

      case 'SequelizeForeignKeyConstraintError':
        return buildErrorResponse(res, err?.message || 'Foreign key constraint error.', {
          errorStack: restError,
          messageErrorAPI,
          errorEndpoint: req.url,
        }, 400);

      case 'SequelizeDatabaseError':
        return buildErrorResponse(res, err?.message || 'Database error.', {
          errorStack: restError,
          messageErrorAPI,
          errorEndpoint: req.url,
        }, 400);

      default:
        return buildErrorResponse(res, err.message || 'Internal Server Error.', {
          errorStack: restError,
          messageErrorAPI,
          errorEndpoint: req.url,
        }, 500);
    }
  }

  return buildErrorResponse(res, err.message || 'Internal Server Error.', {
    errorStack: restError,
    messageErrorAPI,
    errorEndpoint: req.url,
  }, statusCode || 500);
}

module.exports = errorHandler;
