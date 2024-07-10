const inflection = require('inflection');


const DB_TABLE_NAMES = Object.freeze({
  ADDRESS: 'address',
  USER: 'user',
  ROLE: 'role',
  PERMISSION: 'permission',
  USER_ROLE: 'user_role',
  ROLE_PERMISSION: 'role_permission',
  CATEGORY: 'category',
  SUPPLIER: 'supplier',
  PRODUCT: 'product',
  COUPON: 'coupon',
  ORDER: 'order',
  ORDER_ITEM: 'order_item',
  CART: 'cart',
  CART_ITEM: 'cart_item',
  ORDER_COUPON: 'order_coupon',
});

// inflection.pluralize(tableName): Chuyển đổi tên bảng từ dạng số ít sang số nhiều.
// inflection.underscore(...): Chuyển đổi chuỗi ký tự thành dạng underscore (ví dụ: "UserRoles" thành "user_roles").
function getTableNameForMigrations(tableName) {
  return inflection.underscore(inflection.pluralize(tableName));
}

module.exports = {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
};
