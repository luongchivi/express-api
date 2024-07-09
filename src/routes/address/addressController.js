const AddressModel = require('../../database/models/address');
const UserModel = require('../../database/models/user');
const {
  buildSuccessResponse,
  buildResponseMessage,
} = require('../shared');


async function addAddress(req, res, next) {
  try {
    const { userId } = req.userInfo;
    const newAddress = await AddressModel.create({
      ...req.body,
      userId,
    });

    return buildSuccessResponse(res, 'Address added successfully.', {
      address: newAddress,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to add address.';
    next(error);
  }
}

async function getAddress(req, res, next) {
  try {
    const { addressId } = req.params;

    const address = await AddressModel.findByPk(addressId, {
      include: {
        model: UserModel,
        as: 'user',
        attributes: {
          exclude: ['password', 'deletedAt'],
        },
      },
    });

    if (!address) {
      return buildResponseMessage(res, 'Address not found', 404);
    }

    return buildSuccessResponse(res, 'Get address successfully.', {
      address,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to get address.';
    next(error);
  }
}

async function updateAddress(req, res, next) {
  try {
    const { addressId } = req.params;
    const { body } = req;

    const address = await AddressModel.findByPk(addressId);

    if (!address) {
      return buildResponseMessage(res, 'Address not found', 404);
    }

    await address.update(body);
    await address.reload();
    return buildSuccessResponse(res, 'Update new address successfully.', {
      address,
    }, 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to update address.';
    next(error);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const { addressId } = req.params;

    const address = await AddressModel.findByPk(addressId);

    if (!address) {
      return buildResponseMessage(res, 'Address not found', 404);
    }

    await address.destroy();

    return buildResponseMessage(res, 'Delete address successfully.', 200);
  } catch (error) {
    error.statusCode = 400;
    error.messageErrorAPI = 'Failed to delete address.';
    next(error);
  }
}

module.exports = {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
};
