const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const {
  DB_TABLE_NAMES,
  getTableNameForMigrations,
} = require('../constants');
const Province = require('./province');
const District = require('./district');
const Ward = require('./ward');


const Address = sequelize.define(getTableNameForMigrations(DB_TABLE_NAMES.ADDRESS), {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  wardId: {
    type: DataTypes.INTEGER,
  },
  districtId: {
    type: DataTypes.INTEGER,
  },
  provinceId: {
    type: DataTypes.INTEGER,
  },
  phone: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
});

// Thiết lập mối quan hệ giữa Address và Province
Address.belongsTo(Province, { foreignKey: 'provinceId', as: 'province' });
Province.hasOne(Address, { foreignKey: 'provinceId', as: 'address' });

// Thiết lập mối quan hệ giữa Address và District
Address.belongsTo(District, { foreignKey: 'districtId', as: 'district' });
District.hasMany(Address, { foreignKey: 'districtId', as: 'address' });

// Thiết lập mối quan hệ giữa Address và Ward
Address.belongsTo(Ward, { foreignKey: 'wardId', as: 'ward' });
Ward.hasMany(Address, { foreignKey: 'wardId', as: 'address' });

module.exports = Address;
