const GHNExpress = require('../../lib/GHNExpress');
const {
  buildSuccessResponse,
} = require('../shared');


async function getAllProvinces(req, res, next) {
  try {
    const newGHNExpress = new GHNExpress();
    const resultGetProvince = await newGHNExpress.getProvince();
    const { data } = resultGetProvince;
    const results = data.map((item, index) => ({
      id: index,
      name: item.ProvinceName,
      code: item.ProvinceID,
    }));

    return buildSuccessResponse(res, 'Get all list provinces successfully', {
      provinces: results || [],
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list provinces.';
    next(error);
  }
}

module.exports = {
  getAllProvinces,
};
