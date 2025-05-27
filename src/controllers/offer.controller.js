import { Offer } from '../models/offer.model.js';

const send = (res, status, { success, message, data = null, error = null }) =>
  res.status(status).json({ success, message, data, error });

export const saveOrUpdateOffer = async (req, res) => {
  try {
    const { _id, product, discountPercentage, startDate, endDate, status } = req.body;

    let query;
    if (_id) {
      query = { _id };
    } else if (product) {
      // optional: ensure only one offer per product
      query = { product };
    } else {
      return send(res, 400, {
        success: false,
        message: 'Must provide either _id or product ID to create/update offer.',
      });
    }

    const updatedOffer = await Offer.findOneAndUpdate(
      query,
      { $set: { product, discountPercentage, startDate, endDate, status } },
      { new: true, upsert: true, runValidators: true }
    ).populate('product');

    const wasCreated = updatedOffer.createdAt.getTime() === updatedOffer.updatedAt.getTime();
    const action = wasCreated ? 'created' : 'updated';

    return send(res, wasCreated ? 201 : 200, {
      success: true,
      message: `Offer ${action} successfully`,
      data: updatedOffer,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error saving offer',
      error: err.message,
    });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('product').sort({ createdAt: -1 });
    return send(res, 200, {
      success: true,
      message: 'Offers fetched successfully',
      data: offers,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Failed to fetch offers',
      error: err.message,
    });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate('product');
    if (!offer) {
      return send(res, 404, {
        success: false,
        message: 'Offer not found',
      });
    }
    return send(res, 200, {
      success: true,
      message: 'Offer fetched successfully',
      data: offer,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error fetching offer',
      error: err.message,
    });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const deleted = await Offer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return send(res, 404, {
        success: false,
        message: 'Offer not found',
      });
    }
    return send(res, 200, {
      success: true,
      message: 'Offer deleted successfully',
      data: { _id: deleted._id },
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error deleting offer',
      error: err.message,
    });
  }
};
