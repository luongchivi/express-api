const express = require('express');


const router = express.Router();
const {
  validateResponse,
  validateQuery,
} = require('../../middleware/validationHandler');
const {
  getAllDistricts,
} = require('./districtController');
const {
  getAllDistrictsRes,
  getAllDistrictsQuery,
} = require('./districtSchema');


// GET /api/v1/districts
router.get(
  '/',
  validateQuery(getAllDistrictsQuery),
  validateResponse(getAllDistrictsRes),
  getAllDistricts,
);


module.exports = router;
