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
      transaction,
    });
    if (!user) {
      await transaction.rollback();
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const {
      productId,
      quantity,
    } = req.body;
    // Kiểm tra sản phẩm có tồn tại hay không
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      await transaction.rollback();
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
      await cart.reload({ include: [{ model: CartItemModel, as: 'items' }], transaction });
    }

    // Tìm sản phẩm trong giỏ hàng
    const cartItem = await CartItemModel.findOne({
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
      await CartItemModel.create({
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

async function updateQuantityProductInCart(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { userId, email } = req.userInfo;
    const { productId } = req.params;
    const { quantity } = req.body;

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

    // Kiểm tra sản phẩm có tồn tại hay không
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      await transaction.rollback();
      return buildResponseMessage(res, 'Product not found.', 404);
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
      await transaction.rollback();
      return buildResponseMessage(res, 'Cart is empty.', 400);
    }

    const cartItem = await CartItemModel.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
      transaction,
    });

    if (!cartItem) {
      await transaction.rollback();
      return buildResponseMessage(res, 'Item not found.', 404);
    }

    await cartItem.update({
      quantity,
      totalPrice: quantity * product.unitPrice,
    }, { transaction });
    await cartItem.reload({ transaction });

    const cartItemsInCart = await CartItemModel.findAll({
      where: { cartId: cart.id },
      transaction,
    });

    // Cập nhật lại giá tiền của giỏ hàng cart
    const newTotalQuantityCart = cartItemsInCart.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalPriceCart = cartItemsInCart.reduce((sum, item) => sum + item.totalPrice, 0);

    await cart.update({
      totalQuantity: newTotalQuantityCart,
      totalPrice: newTotalPriceCart,
    }, { transaction });

    await cart.reload({ transaction });
    await transaction.commit();
    return buildSuccessResponse(res, 'Update quantity product in cart successfully.', {
      cart,
    }, 200);
  } catch (error) {
    await transaction.rollback();
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update quantity product in cart.';
    next(error);
  }
}

async function deleteProductInCart(req, res, next) {
  const transaction = await sequelize.transaction();
  try {
    const { userId, email } = req.userInfo;
    const { productId } = req.params;

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

    // Kiểm tra sản phẩm có tồn tại hay không
    const product = await ProductModel.findByPk(productId);
    if (!product) {
      await transaction.rollback();
      return buildResponseMessage(res, 'Product not found.', 404);
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
      await transaction.rollback();
      return buildResponseMessage(res, 'Cart is empty.', 400);
    }

    const cartItem = await CartItemModel.findOne({
      where: {
        cartId: cart.id,
        productId,
      },
      transaction,
    });

    if (!cartItem) {
      await transaction.rollback();
      return buildResponseMessage(res, 'Item not found.', 404);
    }

    await cartItem.destroy({ transaction });

    const cartItemsInCart = await CartItemModel.findAll({
      where: { cartId: cart.id },
      transaction,
    });

    // Cập nhật lại giá tiền của giỏ hàng cart
    const newTotalQuantityCart = cartItemsInCart.reduce((sum, item) => sum + item.quantity, 0);
    const newTotalPriceCart = cartItemsInCart.reduce((sum, item) => sum + item.totalPrice, 0);

    await cart.update({
      totalQuantity: newTotalQuantityCart,
      totalPrice: newTotalPriceCart,
    }, { transaction });

    await cart.reload({ transaction });
    await transaction.commit();
    return buildSuccessResponse(res, 'Delete product in cart successfully.', {
      cart,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete product in cart.';
    next(error);
  }
}

module.exports = {
  addToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
};
