const express = require('express');


const router = express.Router();
const {
  validateResponse,
} = require('../../middleware/validationHandler');
const {
  getAllProvinces,
} = require('./provinceController');
const {
  getAllProvincesRes,
} = require('./provinceSchema');


// GET /api/v1/provinces
router.get(
  '/',
  validateResponse(getAllProvincesRes),
  getAllProvinces,
);


module.exports = router;
