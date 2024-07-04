const Joi = require('joi');
const { Op } = require('sequelize');


function buildResponseMessage(res, message, statusCode = 200) {
  return res.status(statusCode).json({
    results: {
      statusCode,
      message
    }
  });
}

function buildSuccessResponse(res, message, data = {}, statusCode = 200) {
  return res.status(statusCode).json({
    results: {
      statusCode,
      message,
      ...data
    }
  })
}

function buildResultListResponse(
  res,
  message,
  currentPage,
  pageSize,
  totalItemsFiltered,
  totalItemsUnfiltered,
  data= {},
  statusCode = 200
) {
  const totalPages = Math.ceil(totalItemsFiltered / pageSize);

  return res.status(statusCode).json({
    results: {
      statusCode,
      message,
      currentPage,
      pageSize,
      totalPages,
      totalItemsFiltered,
      totalItemsUnfiltered,
      ...data
    }
  })
}

function buildErrorResponse(res, message, data = {}, statusCode = 500) {
  return res.status(statusCode).json({
    results: {
      statusCode,
      message,
      ...data
    }
  })
}

function createListResultsSchemaResponse(schema = {}) {
  return Joi.object({
    results: Joi.object({
      statusCode: Joi.number().required(),
      message: Joi.string().required(),
      currentPage: Joi.number().required(),
      pageSize: Joi.number().required(),
      totalPages: Joi.number().required(),
      totalItemsFiltered: Joi.number().required(),
      totalItemsUnfiltered: Joi.number().required(),
      ...schema
    })
  })
}

function createResultsSchemaResponse(schema = {}) {
  return Joi.object({
    results: Joi.object({
      statusCode: Joi.number().required(),
      message: Joi.string().required(),
      ...schema
    })
  })
}

function createMessageSchemaResponse() {
  return Joi.object({
    results: Joi.object({
      statusCode: Joi.number().required(),
      message: Joi.string().required()
    })
  })
}

function createSchemaQuery(schema = {}) {
  return Joi.object({
    page: Joi.number().optional(),
    pageSize: Joi.number().optional(),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().optional(),
    ...schema
  })
}

function parseQueryParams(query, filterableFields = {})  {
  const pageSize = parseInt(query.pageSize, 10);
  const page = parseInt(query.page, 10);
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder.toUpperCase();

  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const where = {};

  Object.keys(filterableFields).forEach(field => {
    if (query[field] !== undefined) {
      const fieldType = filterableFields[field];
      switch (fieldType) {
        case 'string':
          where[field] = { [Op.like]: `%${query[field]}%` };
          break;
        case 'boolean':
          where[field] = query[field] === 'true' ? true : false;
          break;
        case 'number':
          where[field] = parseFloat(query[field]);
          break;
        case 'date':
          const dateFilter = query[field].split(',');
          if (dateFilter.length === 2) {
            const [startDate, endDate] = dateFilter;
            validateDate(startDate);
            validateDate(endDate);
            where[field] = {
              [Op.between]: [
                new Date(startDate).setUTCHours(0,0,0,0),
                new Date(endDate).setUTCHours(23, 59, 59, 999)
              ]
            };
          } else if (dateFilter.length === 1) {
            validateDate(query[field]);
            where[field] = {
              [Op.between]: [
                new Date(query[field]).setUTCHours(0,0,0,0),
                new Date(query[field]).setUTCHours(23, 59, 59, 999)
              ]
            };
          }
          break;
        // Add more cases as needed
        default:
          break;
      }
    }
  });

  const order = [[sortBy, sortOrder]];

  return { where, order, limit, offset };
};

const validateDate = (dateString) => {
  const schema = Joi.date().iso();

  const { error } = schema.validate(dateString);
  if (error) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
};

module.exports = {
  buildResponseMessage,
  buildSuccessResponse,
  buildErrorResponse,
  createResultsSchemaResponse,
  createListResultsSchemaResponse,
  createMessageSchemaResponse,
  parseQueryParams,
  createSchemaQuery,
  buildResultListResponse,
  validateDate,
};
