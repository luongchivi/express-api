const { buildResponseMessage } = require('../routes/shared');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return buildResponseMessage(res, error.details[0].message || 'Validation request error.', 400);
    }
    next();
  };
};

const validateResponse = (schema) => {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
      const responseData = JSON.parse(data);
      const { error } = schema.validate(responseData);
      if (error) {
        console.error({
          validateResponse: error.details[0].message
        });
      }
      return originalSend.apply(res, arguments);
    };
    next();
  }
}

const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return buildResponseMessage(res, error.details[0].message || 'Validation params error.', 400);
    }
    next();
  }
}

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return buildResponseMessage(res, error.details[0].message || 'Validation query error.', 400);
    }
    next();
  }
}

module.exports = {
  validateRequest,
  validateResponse,
  validateParams,
  validateQuery
};
