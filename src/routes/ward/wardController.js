const WardModel = require('../../database/models/ward');
const {
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');


async function getAllWards(req, res, next) {
  try {
    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {
      name: 'string',
      code: 'eq',
      districtId: 'eq',
      id: 'eq',
    };

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const wards = await WardModel.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });


    const totalItemsFiltered = wards.count;
    const totalItemsUnfiltered = await WardModel.count();

    return buildResultListResponse(
      res,
      'Get all list wards successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        wards: wards.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list wards.';
    next(error);
  }
}

module.exports = {
  getAllWards,
};
