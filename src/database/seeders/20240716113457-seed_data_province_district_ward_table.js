const { DB_TABLE_NAMES, getTableNameForMigrations } = require('../constants');
const GHNExpress = require('../../lib/GHNExpress');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      try {
        const newGHNExpress = new GHNExpress();
        const resultGetProvince = await newGHNExpress.getProvince();
        const { data } = resultGetProvince;
        const dataProvincesBulkInsert = data.map((item, index) => ({
          id: index,
          name: item.ProvinceName,
          code: item.ProvinceID,
          created_at: new Date(),
          updated_at: new Date(),
        }));

        await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.PROVINCE), dataProvincesBulkInsert, { transaction: t });

        const provinceIds = dataProvincesBulkInsert.map(item => item.code);
        const dataDistrictsBulkInsert = [];
        const districtIds = [];
        for (const provinceId of provinceIds) {
          const resultGetDistrict = await newGHNExpress.getDistrict({
            province_id: provinceId,
          });
          const { data } = resultGetDistrict;
          const dataDistricts = data.map(item => {
            districtIds.push(item.DistrictID);
            return {
              name: item.DistrictName,
              code: item.DistrictID,
              province_id: item.ProvinceID,
              created_at: new Date(),
              updated_at: new Date(),
            };
          });
          dataDistrictsBulkInsert.push(...dataDistricts);
        }

        await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.DISTRICT), dataDistrictsBulkInsert.map((item, index) => ({
          id: index,
          ...item,
        })), { transaction: t });

        const dataWardsBulkInsert = [];
        for (const districtId of districtIds) {
          const resultGetWard = await newGHNExpress.getWard({
            district_id: districtId,
          });
          const { data } = resultGetWard;

          console.log(`districtId: ${districtId}`);
          console.log(data);
          if (data) {
            const dataWards = data.map(item => ({
              name: item.WardName,
              code: parseInt(item.WardCode, 10),
              district_id: item.DistrictID,
              created_at: new Date(),
              updated_at: new Date(),
            }));
            dataWardsBulkInsert.push(...dataWards);
          }
        }

        await queryInterface.bulkInsert(getTableNameForMigrations(DB_TABLE_NAMES.WARD), dataWardsBulkInsert.map((item, index) => ({
          id: index,
          ...item,
        })), { transaction: t });
      } catch (e) {
        console.log(e);
      }
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async t => {
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.DISTRICT), null, { transaction: t });
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.PROVINCE), null, { transaction: t });
      await queryInterface.bulkDelete(getTableNameForMigrations(DB_TABLE_NAMES.WARD), null, { transaction: t });
    });
  },
};
