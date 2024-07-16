const GHNExpress = require('../../lib/GHNExpress');
const {
  buildSuccessResponse,
} = require('../shared');


async function getAllDistricts(req, res, next) {
  try {
    const { provinceId } = req.query;
    const newGHNExpress = new GHNExpress();
    const resultGetDistrict = await newGHNExpress.getDistrict({
      province_id: provinceId,
    });
    const { data } = resultGetDistrict;
    const results = data.map((item, index) => ({
      id: index,
      name: item.DistrictName,
      code: item.DistrictID,
      provinceId: item.ProvinceID,
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
  getAllDistricts,
};
