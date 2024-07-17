require('dotenv').config({ path: `${process.cwd()}/.env` });
const superagent = require('superagent');


class GHNExpress {
  constructor() {
    this.apiToken = process.env.GHN_EXPRESS_API_TOKEN;
    this.shopId = process.env.GHN_EXPRESS_SHOP_ID;
    this.baseUrl = process.env.GHN_EXPRESS_BASE_URL;
  }

  get baseHeaders() {
    return {
      'Content-Type': 'application/json',
      Token: this.apiToken,
      ShopId: this.shopId,
    };
  }

  async createShipment(order) {
    try {
      const response = await superagent
        .post(`${this.baseUrl}/v2/shipping-order/create`)
        .set(this.baseHeaders)
        .send(order);

      return response.body;
    } catch (error) {
      console.error('Error creating shipment:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async getAvailableServices(districtId, wardCode) {
    try {
      const response = await superagent
        .post(`${this.baseUrl}/v2/shipping-order/available-services`)
        .set(this.baseHeaders)
        .send({
          from_district_id: this.shopDistrictId,
          to_district_id: districtId,
          ward_code: wardCode,
        });

      return response.body;
    } catch (error) {
      console.error('Error getting available services:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async calculateShippingFee(order) {
    try {
      const response = await superagent
        .post(`${this.baseUrl}/v2/shipping-order/fee`)
        .set(this.baseHeaders)
        .send(order);

      return response.body;
    } catch (error) {
      console.error('Error calculating shipping fee:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async getOrderStatus(orderCode) {
    try {
      const response = await superagent
        .get(`${this.baseUrl}/v2/shipping-order/detail`)
        .set(this.baseHeaders)
        .query({ order_code: orderCode });

      return response.body;
    } catch (error) {
      console.error('Error getting order status:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async getProvince() {
    try {
      const response = await superagent
        .get(`${this.baseUrl}/master-data/province`)
        .set(this.baseHeaders);

      return response.body;
    } catch (error) {
      console.error('Error getting province:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async getDistrict(query) {
    try {
      const response = await superagent
        .get(`${this.baseUrl}/master-data/district`)
        .set(this.baseHeaders)
        .query({ ...query });

      return response.body;
    } catch (error) {
      console.error('Error getting district:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async getWard(query) {
    try {
      const response = await superagent
        .get(`${this.baseUrl}/master-data/ward`)
        .set(this.baseHeaders)
        .query({ ...query });

      return response.body;
    } catch (error) {
      console.error('Error getting ward:', error.response ? error.response.body : error.message);
      throw error;
    }
  }

  async getShop(payload) {
    try {
      const response = await superagent
        .get(`${this.baseUrl}/v2/shop/all`)
        .set(this.baseHeaders)
        .send(payload);

      return response.body;
    } catch (error) {
      console.error('Error getting shops:', error.response ? error.response.body : error.message);
      throw error;
    }
  }
}

module.exports = GHNExpress;
