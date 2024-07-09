const paymentType = Object.freeze({
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Bank Transfer',
  CASH_ON_DELIVERY: 'Cash on Delivery',
});

const orderStatus = Object.freeze({
  CANCELLED: 'Cancelled',
  PROCESSING: 'Processing',
  SUCCEEDED: 'Succeeded',
});

module.exports = {
  paymentType,
  orderStatus,
};
