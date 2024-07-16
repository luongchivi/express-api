const GHNExpress = require('../../lib/GHNExpress');
const {
  buildSuccessResponse,
} = require('../shared');


async function getAllWards(req, res, next) {
  try {
    const { districtId } = req.query;
    const newGHNExpress = new GHNExpress();
    const resultGetWard = await newGHNExpress.getWard({
      district_id: districtId,
    });
    const { data } = resultGetWard;
    const results = data.map((item, index) => ({
      id: index,
      name: item.WardName,
      code: parseInt(item.WardCode, 10),
      districtId: item.DistrictID,
    }));

    return buildSuccessResponse(res, 'Get all list wards successfully', {
      wards: results || [],
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list wards.';
    next(error);
  }
}

module.exports = {
  getAllWards,
};
