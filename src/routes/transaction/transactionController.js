const TransactionPaypalModel = require('../../database/models/transactionPaypal');
const {
  buildSuccessResponse,
  buildResponseMessage,
} = require('../shared');
const UserModel = require('../../database/models/user');
const OrderModel = require('../../database/models/order');


async function saveTransactionPaypal(req, res, next) {
  try {
    const { payloadResponsePaypal, orderId } = req.body;
    const payload = JSON.parse(payloadResponsePaypal);
    const { userId, email } = req.userInfo;

    const order = await OrderModel.findOne({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      return buildResponseMessage(res, 'Order not found.', 404);
    }

    const user = await UserModel.findOne({
      where: {
        id: userId,
        email,
      },
    });
    if (!user) {
      return buildResponseMessage(res, 'User not found.', 404);
    }

    const newTransaction = await TransactionPaypalModel.create({
      userId,
      orderId,
      paypalId: payload?.id,
      intent: payload?.intent,
      status: payload?.status,
      currencyCode: payload?.purchase_units[0]?.amount.currency_code,
      value: payload?.purchase_units[0]?.amount?.value,
      emailAddress: payload?.purchase_units[0]?.payee?.email_address,
      merchantId: payload?.purchase_units[0]?.payee?.merchant_id,
      fullName: payload?.purchase_units[0]?.shipping?.name?.full_name,
      addressLineOne: payload?.purchase_units[0]?.shipping?.address?.address_line_1,
      adminAreaTwo: payload?.purchase_units[0]?.shipping?.address?.admin_area_2,
      adminAreaOne: payload?.purchase_units[0]?.shipping?.address?.admin_area_1,
      postalCode: payload?.purchase_units[0]?.shipping?.address?.postal_code,
      countryCode: payload?.purchase_units[0]?.shipping?.address?.country_code,
      payerId: payload?.payer?.payer_id,
      phoneNumber: payload?.payer?.phone?.phone_number?.national_number,
      rawResponse: payload,
    });

    return buildSuccessResponse(res, 'Add new transaction Paypal successfully.', {
      transactionPaypal: newTransaction,
    }, 201);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to save transaction paypal.';
    next(error);
  }
}


module.exports = {
  saveTransactionPaypal,
};
