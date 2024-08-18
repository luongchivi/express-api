require('dotenv').config({ path: `${process.cwd()}/.env` });
const { Op } = require('sequelize');
const moment = require('moment');
const OrderModel = require('../../database/models/order');
const OrderItemModel = require('../../database/models/orderItem');
const {
  buildSuccessResponse,
} = require('../shared');
const sequelize = require('../../../config/database');


async function getSalesMonthly(req, res, next) {
  try {
    const startDate = moment().startOf('month').toDate();
    const endDate = moment().endOf('month').toDate();

    // Query the database for all orders within the current month
    const salesData = await OrderItemModel.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('order_items.created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('order_items.quantity')), 'itemsSold'],
      ],
      include: [
        {
          model: OrderModel,
          as: 'order',
          where: {
            createdAt: {
              [Op.between]: [startDate, endDate],
            },
          },
          attributes: [], // Exclude all attributes from the Order model
        },
      ],
      group: [sequelize.fn('DATE', sequelize.col('order_items.created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('order_items.created_at')), 'ASC']],
    });

    const formattedData = salesData.map(data => ({
      date: data.dataValues.date,
      itemsSold: data.dataValues.itemsSold,
    }));

    return buildSuccessResponse(res, 'Get sales of month successfully.', {
      sales: formattedData,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get sales of month.';
    next(error);
  }
}

module.exports = {
  getSalesMonthly,
};
