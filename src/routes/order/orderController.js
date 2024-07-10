const UserModel = require('../../database/models/user');
const CartModel = require('../../database/models/cart');
const CartItemModel = require('../../database/models/cartItem');
const OrderModel = require('../../database/models/order');
const OrderItemModel = require('../../database/models/orderItem');
const {
  buildResponseMessage,
  buildSuccessResponse,
} = require('../shared');
const sequelize = require('../../../config/database');
const { orderStatus } = require('./orderSchema');


async function checkoutOrder(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { userId, email } = req.userInfo;
    const { paymentType } = req.body;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
      transaction,
    });
    if (!user) {
      await transaction.rollback();
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const cart = await CartModel.findOne({
      where: {
        userId,
      },
      include: {
        model: CartItemModel,
        as: 'items',
      },
      transaction,
    });

    if (!cart) {
      return buildResponseMessage(res, 'Cart is empty.', 400);
    }

    // tạo mới newOrder và orderItems
    const totalAmount = cart.totalPrice;
    const newOrder = await OrderModel.create({
      userId,
      paymentType,
      totalAmount,
      orderStatus: orderStatus.PROCESSING,
    }, { transaction });

    const orderItems = cart.items.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));
    await OrderItemModel.bulkCreate(orderItems, { transaction });
    await newOrder.reload({ include: [{ model: OrderItemModel, as: 'orderItems' }], transaction });

    // Nếu có các coupon check coupon đó xem có valid không
    // const validCoupons = [];
    // if (couponCodes && couponCodes.length > 0) {
    //   const now = new Date();
    //   for (const code of couponCodes) {
    //     const coupon = await CouponModel.findOne({ where: { code } }, transaction);
    //     if (!coupon) {
    //       return buildResponseMessage(res, `Coupon code: ${code} is not existed,`, 404);
    //     }
    //     if (coupon.expiry <= now) {
    //       return buildResponseMessage(res, `Coupon ${code} is expires.`, 400);
    //     }
    //     validCoupons.push(coupon);
    //   }
    // }
    //
    // // Tính lại tổng số tiền khi giảm giá
    // for (const coupon of validCoupons) {
    //   totalAmount ;
    // }

    // Xóa toàn bộ sản phẩm trong cart và cartItems
    await CartItemModel.destroy({
      where: {
        cartId: cart.id,
      },
      transaction,
    });
    await cart.destroy({ transaction });

    await transaction.commit();
    return buildSuccessResponse(res, 'Checkout order successfully.', {
      order: newOrder,
    }, 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to checkout order.';
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
  checkoutOrder,
};
