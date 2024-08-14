const ProvinceModel = require('../../database/models/province');
const {
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');


async function getAllProvinces(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {
      name: 'string',
      code: 'eq',
      id: 'eq',
    };

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const provinces = await ProvinceModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });


    const totalItemsFiltered = provinces.count;
    const totalItemsUnfiltered = await ProvinceModel.count();

    return buildResultListResponse(
      res,
      'Get all list provinces successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        provinces: provinces.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list provinces.';
    next(error);
  }
}

module.exports = {
  getAllProvinces,
};
