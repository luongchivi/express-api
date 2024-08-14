const DistrictModel = require('../../database/models/district');
const {
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');


async function getAllDistricts(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {
      provinceId: 'eq',
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

    const districts = await DistrictModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });


    const totalItemsFiltered = districts.count;
    const totalItemsUnfiltered = await DistrictModel.count();

    return buildResultListResponse(
      res,
      'Get all list districts successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        districts: districts.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list districts.';
    next(error);
  }
}

module.exports = {
  getAllDistricts,
};
