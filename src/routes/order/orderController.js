require('dotenv').config({ path: `${process.cwd()}/.env` });
const { Op } = require('sequelize');
const UserModel = require('../../database/models/user');
const CartModel = require('../../database/models/cart');
const CartItemModel = require('../../database/models/cartItem');
const OrderModel = require('../../database/models/order');
const OrderItemModel = require('../../database/models/orderItem');
const ProductModel = require('../../database/models/product');
const CategoryModel = require('../../database/models/category');
const {
  buildResponseMessage,
  buildSuccessResponse,
  parseQueryParams,
  buildResultListResponse,
} = require('../shared');
const sequelize = require('../../../config/database');
const { orderStatus, paymentType: paymentTypeEnum  } = require('./orderSchema');
const GHNExpress = require('../../lib/GHNExpress');
const AddressModel = require('../../database/models/address');
const ProvinceModel = require('../../database/models/province');
const DistrictModel = require('../../database/models/district');
const WardModel = require('../../database/models/ward');


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

    const address = await AddressModel.findOne({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: {
            exclude: ['password', 'deletedAt'],
          },
        },
        {
          model: ProvinceModel,
          as: 'province',
        },
        {
          model: DistrictModel,
          as: 'district',
        },
        {
          model: WardModel,
          as: 'ward',
        },
      ],
      transaction,
    });

    if (!address) {
      return buildResponseMessage(res, 'Address not found, please update your address before check out.', 404);
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

    if (cart.totalPrice > 1000000 && paymentType === 'COD') {
      return buildResponseMessage(res, 'Cash on delivery is only accepted when the total price is less than or equal to 1,000,000 VND.', 400);
    }

    // Kiểm tra số lượng tồn kho cho từng sản phẩm trong giỏ hàng
    let totalWeightPacket = 0.0;
    let totalHeightPacket = 0.0;
    const allLengthOfItems = [];
    const allWidthOfItems = [];
    const items = [];
    for (const item of cart.items) {
      const product = await ProductModel.findByPk(item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return buildResponseMessage(res, `Product with ID ${item.productId} not found.`, 404);
      }
      if (product.unitsInStock < item.quantity) {
        await transaction.rollback();
        return buildResponseMessage(res, `Not enough stock for product ${product.name}.`, 400);
      }
      totalWeightPacket += product.weight * item.quantity;
      totalHeightPacket += product.height * item.quantity;
      allLengthOfItems.push(product.length);
      allWidthOfItems.push(product.width);
      items.push({
        name: product.name,
        quantity: item.quantity,
        height: parseInt(product.height.toFixed()) || 1,
        weight: parseInt(product.weight.toFixed()) || 1,
        length: parseInt(product.length.toFixed()) || 15,
        width: parseInt(product.width.toFixed()) || 15,
      });
    }

    const lengthPacket = allLengthOfItems.length > 0 ? Math.max(...allLengthOfItems) : 0;
    const widthPacket = allWidthOfItems.length > 0 ? Math.max(...allWidthOfItems) : 0;

    // tạo mới newOrder và orderItems
    const totalAmount = cart.totalPrice;
    let payloadCreateNewOrder = {
      userId,
      totalAmount,
    };

    if (paymentType === 'Cash on Delivery') {
      payloadCreateNewOrder.orderStatus = orderStatus.PROCESSING;
      payloadCreateNewOrder.paymentType = paymentTypeEnum.CASH_ON_DELIVERY;
    } else if (paymentType === 'PayPal') {
      payloadCreateNewOrder.orderStatus = orderStatus.PROCESSING;
      payloadCreateNewOrder.paymentType = paymentTypeEnum.PAYPAL;
    }

    const newOrder = await OrderModel.create(payloadCreateNewOrder, { transaction });

    const orderItems = cart.items.map(item => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));
    await OrderItemModel.bulkCreate(orderItems, { transaction });
    await newOrder.reload({ include: [{ model: OrderItemModel, as: 'orderItems' }], transaction });

    // Tạo đơn shipping tới địa chỉ của khách hàng
    const newGHNExpress = new GHNExpress();
    let createOrderShipment = {
      from_name: 'Ecommerce Store',
      from_phone: process.env.GHN_EXPRESS_CLIENT_PHONE,
      from_ward_name: process.env.GHN_EXPRESS_CLIENT_WARD_NAME,
      from_district_name: process.env.GHN_EXPRESS_CLIENT_DISTRICT_NAME,
      from_province_name: process.env.GHN_EXPRESS_CLIENT_PROVINCE_NAME,
      to_name: `${user.lastName} ${user.firstName}`,
      to_phone: address.phone,
      to_address: address.address,
      to_ward_name: address.ward.name,
      to_ward_code: address.ward.code.toString(),
      to_district_name: address.district.name,
      weight: parseInt(totalWeightPacket.toFixed()) || 1,
      height: parseInt(totalHeightPacket.toFixed()) || 1,
      width: parseInt(widthPacket.toFixed()) || 15,
      length: parseInt(lengthPacket.toFixed()) || 15,
      service_type_id: 5, // Chuyển phát truyền thống
      required_note: 'KHONGCHOXEMHANG',
      items: items || [],
    };

    if (paymentType === 'Cash on Delivery') {
      createOrderShipment.cod_amount = totalAmount;
      createOrderShipment.payment_type_id = 2 // Người mua/Người nhận
    } else if (paymentType === 'PayPal') {
      createOrderShipment.payment_type_id = 1 // Người bán/Người gửi
    }

    const resultCreateShipment = await newGHNExpress.createShipment(createOrderShipment);
    const { data } = resultCreateShipment;

    await newOrder.update({
      totalAmount: totalAmount + data.total_fee,
      shippingOrderId: data.order_code,
      shippingFee: data.total_fee,
      expectedDeliveryTime: data.expected_delivery_time,
    }, { transaction });
    await newOrder.reload({ include: [{ model: OrderItemModel, as: 'orderItems' }], transaction });

    // Cập nhật số lượng sản phẩm
    for (const item of cart.items) {
      await ProductModel.update({
        unitsInStock: sequelize.literal(`units_in_stock - ${item.quantity}`),
        unitsOnOrder: sequelize.literal(`units_on_order + ${item.quantity}`),
      }, {
        where: { id: item.productId },
        transaction,
      });
    }

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

async function getShippingFeeOrder(req, res, next) {
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const address = await AddressModel.findOne({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: {
            exclude: ['password', 'deletedAt'],
          },
        },
        {
          model: ProvinceModel,
          as: 'province',
        },
        {
          model: DistrictModel,
          as: 'district',
        },
        {
          model: WardModel,
          as: 'ward',
        },
      ],
    });

    if (!address) {
      return buildResponseMessage(res, 'Address not found, please update your address before check out.', 404);
    }

    const cart = await CartModel.findOne({
      where: {
        userId,
      },
      include: {
        model: CartItemModel,
        as: 'items',
      },
    });

    if (!cart) {
      return buildResponseMessage(res, 'Cart is empty.', 400);
    }

    let totalWeightPacket = 0.0;
    let totalHeightPacket = 0.0;
    const allLengthOfItems = [];
    const allWidthOfItems = [];
    const items = [];
    for (const item of cart.items) {
      const product = await ProductModel.findByPk(item.productId);
      if (!product) {
        return buildResponseMessage(res, `Product with ID ${item.productId} not found.`, 404);
      }
      totalWeightPacket += product.weight * item.quantity;
      totalHeightPacket += product.height * item.quantity;
      allLengthOfItems.push(product.length);
      allWidthOfItems.push(product.width);
      items.push({
        name: product.name,
        quantity: item.quantity,
        height: parseInt(product.height.toFixed()) || 1,
        weight: parseInt(product.weight.toFixed()) || 1,
        length: parseInt(product.length.toFixed()) || 15,
        width: parseInt(product.width.toFixed()) || 15,
      });
    }

    const lengthPacket = allLengthOfItems.length > 0 ? Math.max(...allLengthOfItems) : 0;
    const widthPacket = allWidthOfItems.length > 0 ? Math.max(...allWidthOfItems) : 0;

    const newGHNExpress = new GHNExpress();
    const payloadCalculateShippingFee = {
      service_type_id: 5, // Chuyển phát truyền thống
      from_district_id: parseInt(process.env.GHN_EXPRESS_CLIENT_DISTRICT_ID, 10),
      from_ward_code: process.env.GHN_EXPRESS_CLIENT_WARD_CODE,
      to_district_id: parseInt(address.districtId, 10),
      to_ward_code: `${address.ward.code}`,
      weight: parseInt(totalWeightPacket.toFixed()) || 1,
      height: parseInt(totalHeightPacket.toFixed()) || 1,
      width: parseInt(widthPacket.toFixed()) || 15,
      length: parseInt(lengthPacket.toFixed()) || 15,
      cod_value: cart.totalPrice,
      items: items || [],
      name: items.map(product => product.name).join(', '),
    }

    const responseGetShippingFee = await newGHNExpress.calculateShippingFee(payloadCalculateShippingFee)
    if (responseGetShippingFee.code !== 200) {
      return buildResponseMessage(res, 'Error at calculate shipping fee.', 400);
    }
    const {data} =  responseGetShippingFee;
    return buildSuccessResponse(res, 'Get Shipping Fee Successfully.', {
      shippingFee: data,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get shipping fee order.';
    next(error);
  }
}

async function getAllOrderOfUser(req, res, next) {
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const currentPage = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);

    const filterableFields = {
      orderStatus: 'enum',
      paymentType: 'enum',
      totalAmount: 'number',
      createdAt: 'date',
    };

    const {
      where,
      order,
      limit,
      offset,
    } = parseQueryParams(req.query, filterableFields);

    const orders = await OrderModel.findAndCountAll({
      where: {
        ...where,
        userId: { [Op.eq]: userId },
      },
      order,
      limit,
      offset,
    });

    const totalItemsFiltered = orders.count;
    const totalItemsUnfiltered = await OrderModel.count();

    return buildResultListResponse(
      res,
      'Get all orders of user successfully.',
      currentPage,
      pageSize,
      totalItemsFiltered,
      totalItemsUnfiltered,
      {
        orders: orders.rows,
      },
      200,
    );
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get all list orders of user.';
    next(error);
  }
}

async function cancelOrder(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { orderId } = req.params;
    const order = await OrderModel.findOne({
      where: {
        id: orderId,
        userId,
      },
      transaction,
    });
    if (!order) {
      return buildResponseMessage(res, 'Order not found.', 404);
    }

    const { shippingOrderId } = order;
    // Cancel order shipping from GHN
    const newGHNExpress = new GHNExpress();
    const resultCancelOrder = await newGHNExpress.cancelOrder(shippingOrderId);
    console.log(resultCancelOrder);
    const { code } = resultCancelOrder;

    if (code !== 200) {
      return buildResponseMessage(res, 'Error when canceling order in GHN Express.', 400);
    }

    await order.update({
      orderStatus: orderStatus.CANCELLED,
      updatedAt: new Date().toISOString(),
    }, { transaction });

    await transaction.commit();
    return buildResponseMessage(res, 'Cancel order successfully.', 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to cancel order.';
    next(error);
  }
}

async function getOrderShippingDetails(req, res, next) {
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { orderId } = req.params;
    const order = await OrderModel.findOne({
      where: {
        id: orderId,
        userId,
      }
    });
    if (!order) {
      return buildResponseMessage(res, 'Order not found.', 404);
    }

    const { shippingOrderId } = order;

    const newGHNExpress = new GHNExpress();
    const resultOrderShippingOrder = await newGHNExpress.getOrderShippingDetails(shippingOrderId);
    console.log(resultOrderShippingOrder);
    const { code, data } = resultOrderShippingOrder;

    if (code !== 200) {
      return buildResponseMessage(res, 'Error when get shipping order details in GHN Express.', 400);
    }

    return buildSuccessResponse(res, 'Get shipping order details successfully.', {
      shippingOrder: data,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get shipping order details.';
    next(error);
  }
}

async function getOrderDetailUser(req, res, next) {
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { orderId } = req.params;
    const order = await OrderModel.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [
            {
              model: ProductModel,
              as: 'product',
              include: [
                {
                  model: CategoryModel,
                  as: 'category',
                  attributes: ['name'],
                }
              ]
            }
          ]
        },
        {
          model: UserModel,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email'],
          include: [
            {
              model: AddressModel,
              as: 'address',
              attributes: ['address', 'phone'],
            }
          ]
        }
      ]
    });
    if (!order) {
      return buildResponseMessage(res, 'Order not found.', 404);
    }

    return buildSuccessResponse(res, 'Get order details successfully.', {
      order,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get order details.';
    next(error);
  }
}

async function updateStatusOrder(req, res, next) {
  try {
    const { userId, email } = req.userInfo;
    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const { orderId } = req.params;
    const order = await OrderModel.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: OrderItemModel,
          as: 'orderItems',
          include: [
            {
              model: ProductModel,
              as: 'product',
            }
          ]
        },
      ]
    });
    if (!order) {
      return buildResponseMessage(res, 'Order not found.', 404);
    }

    await order.update({ orderStatus: orderStatus.PAID });

    return buildSuccessResponse(res, 'Get order details successfully.', {
      order,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update order status.';
    next(error);
  }
}

module.exports = {
  getAllOrderOfUser,
  checkoutOrder,
  cancelOrder,
  getOrderShippingDetails,
  getShippingFeeOrder,
  getOrderDetailUser,
  updateStatusOrder,
};
