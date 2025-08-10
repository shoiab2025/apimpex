import { Delivery } from '../models/delivery.model.js';
import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import {toObjectId} from '../utils/mongooseHelpers.js';

/**
 * Helper to standardise all JSON responses.
 */
const send = (res, statusCode, { success, message, data = null, error = null }) =>
  res.status(statusCode).json({ success, message, data, error });

export const saveOrUpdateDelivery = async (req, res) => {
  try {
    let { id } = req.params;
    let { order, deliveryAgent, ...details } = req.body;

    // Convert IDs
    id = toObjectId(id);
    order = toObjectId(order);
    deliveryAgent = toObjectId(deliveryAgent);

    if (!order || !deliveryAgent) {
      return res.error(400, "Invalid Order or Delivery Agent ID");
    }

    // Update branch
    if (id) {
      const updated = await Delivery.findByIdAndUpdate(id, details, { new: true });
      return updated
        ? res.success(200, "Delivery updated", updated)
        : res.error(404, "Delivery not found");
    }

    // Check existence

    
    const singam = await Order.find({})
    const [orderDoc, agentDoc] = await Promise.all([
      Order.findById(order),
      User.findById(deliveryAgent)
    ]);
    if (!orderDoc) return res.error(404, "Order not found");
    if (!agentDoc) return res.error(404, "Delivery Agent not found");

    // Create or update
    const delivery = await Delivery.findOneAndUpdate(
      { order, deliveryAgent },
      { order, deliveryAgent, ...details },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.success(201, "Delivery created/updated", delivery);
  } catch (err) {
    console.error(err);
    res.error(500, "Server error", err.message);
  }
};


/**
 * GET /api/deliveries
 * Optional query params: status, from, to
 */
export const getAllDeliveries = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const filter = {};
    if (status) filter.deliveryStatus = status;
    if (from || to) filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to)   filter.createdAt.$lte = new Date(to);

    const deliveries = await Delivery.find(filter)
      .populate('order')
      .sort({ createdAt: -1 });

    return send(res, 200, {
      success: true,
      message: 'Deliveries fetched',
      data: deliveries,
    });
  } catch (err) {
    return next(err)
  }
};

/**
 * GET /api/deliveries/:id
 */
export const getDeliveryById = async (req, res) => {
  try {
    const doc = await Delivery.findById(req.params.id).populate('order');
    if (!doc) {
      return send(res, 404, { success: false, message: 'Delivery not found' });
    }
    return send(res, 200, { success: true, message: 'Delivery fetched', data: doc });
  } catch (err) {
    return send(res, 500, { success: false, message: 'Error fetching delivery', error: err.message });
  }
};

/**
 * DELETE /api/deliveries/:id
 */
export const deleteDelivery = async (req, res) => {
  try {
    const doc = await Delivery.findByIdAndDelete(req.params.id);
    if (!doc) return send(res, 404, { success: false, message: 'Delivery not found' });

    return send(res, 200, {
      success: true,
      message: 'Delivery deleted',
      data: { _id: doc._id },
    });
  } catch (err) {
    return send(res, 500, { success: false, message: 'Error deleting delivery', error: err.message });
  }
};


function convertStringToModelId(modelId){
  if (typeof modelId === 'string') {
    return mongoose.Types.ObjectId(modelId);
  }

  return modelId;
}

function giveanyname(model, id){
  const modelExist = model.findOne({ _id: convertStringToModelId(id) });
  return modelExist;
}

