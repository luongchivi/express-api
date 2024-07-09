const UserModel = require('../../database/models/user');
const { buildResponseMessage } = require('../shared');


async function addOrder(req, res, next) {
  try {
    const { userId, email } = req.info;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add new order.';
    next(error);
  }
}

// async function getAllOrders(req, res, next) {
//   try {
//
//   } catch (error) {
//     error.statusCode = 400;
//     error.messageErrorAPI = 'Failed to get all list orders.';
//     next(error);
//   }
// }

module.exports = {
  // getAllOrders,
  addOrder,
};
