const path = require('path');
const fs = require('fs');
const slugify = require('slugify');
const {
  getTableNameForMigrations,
  DB_TABLE_NAMES,
} = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      const filePath = path.join(__dirname, '..', 'datasource', 'ecommerce.json');
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        const { categories, products } = data;
        const dataCategories = categories.map((item, index) => {
          const { link: _, ...rest } = item;
          return {
            id: index + 1,
            ...rest,
          };
        });
        const dataProducts = products.map((item, index) => ({
          id: index + 1,
          ...item,
          image_url: `{${item.image_url.join(',')}}`,
          name: `${item.name} ${index + 1}`,
          slug: slugify(`${item.name} ${index + 1}`.toLowerCase()),
        }));
        await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY), dataCategories, { transaction: t });
        await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), dataProducts, { transaction: t });
      } catch (error) {
        console.error(error);
        console.error(`Error loading datasource: ${error.message}`);
      }
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.PRODUCT), null, { transaction: t });
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.CATEGORY), null, { transaction: t });
    });
  },
};
