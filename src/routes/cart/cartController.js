const UserModel = require('../../database/models/user');
const ProductModel = require('../../database/models/product');
const CartModel = require('../../database/models/cart');
const CartItemModel = require('../../database/models/cartItem');
const sequelize = require('../../../config/database');
const {
  buildResponseMessage,
  buildSuccessResponse,
} = require('../shared');


async function addToCart(req, res, next) {
  const transaction = await sequelize.transaction();

  try {
    const {
      userId,
      email,
    } = req.userInfo;

    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const {
      productId,
      quantity,
    } = req.body;
    // Kiểm tra sản phẩm có tồn tại hay không
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      return buildResponseMessage(res, 'Product not found.', 404);
    }

    let cart = await CartModel.findOne({
      where: {
        userId,
      },
      include: {
        model: CartItemModel,
        as: 'items',
      },
      transaction,
    });
    // Tìm giỏ hàng của người dùng hoặc tạo giỏ hàng mới nếu chưa tồn tại
    if (!cart) {
      cart = await CartModel.create({ userId }, { transaction });
      await cart.reload({ transaction });
    }

    // Tìm sản phẩm trong giỏ hàng
    let cartItem = await CartItemModel.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
      transaction,
    });
    if (cartItem) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng và tổng giá
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * product.unitPrice;
      await cartItem.save({ transaction });
      await cartItem.reload({ transaction });
    } else {
      cartItem = await CartItemModel.create({
        cartId: cart.id,
        productId,
        quantity,
        unitPrice: product.unitPrice,
        totalPrice: quantity * product.unitPrice,
      }, { transaction });
    }

    cart.totalQuantity += quantity;
    cart.totalPrice += quantity * product.unitPrice;
    await cart.save({ transaction });
    await transaction.commit();
    await cart.reload();

    return buildSuccessResponse(res, 'Add item to cart successfully.', {
      cart,
    }, 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add product to cart.';
    next(error);
  }
}


module.exports = {
  addToCart,
};
