import { Delivery } from '../models/delivery.model.js';

/**
 * Helper to standardise all JSON responses.
 */
const send = (res, statusCode, { success, message, data = null, error = null }) =>
  res.status(statusCode).json({ success, message, data, error });

/**
 * Create OR update a Delivery in a single call.
 *
 * How it decides:
 * 1. If req.body._id is present ➜ update that record (404 if not found).
 * 2. Else if a Delivery already exists for req.body.order ➜ update that one.
 * 3. Else ➜ create a brand-new Delivery.
 *
 * Returns:
 *   { success, message, data } on success
 *   { success:false, message, error } on any failure
 */
export const saveOrUpdateDelivery = async (req, res) => {
  try {
    const payload = req.body;

    // -----------------------------
    // STEP 1 – Determine upsert key
    // -----------------------------
    let query = null;

    if (payload._id) {
      query = { _id: payload._id };
    } else if (payload.order) {
      // Guarantee one Delivery per Order if that’s your business rule
      query = { order: payload.order };
    }

    // If we have a query, attempt to upsert; otherwise create new directly
    let savedDoc;
    if (query) {
      savedDoc = await Delivery.findOneAndUpdate(
        query,
        { $set: payload },               // update fields
        { new: true, upsert: true, runValidators: true }
      ).populate('order');
    } else {
      // No _id and no order supplied – cannot decide what to do
      return send(res, 400, {
        success: false,
        message: 'Must supply either _id or order to create / update a delivery',
        error: 'ValidationError',
      });
    }

    // Distinguish create vs update by checking isNew
    const wasCreated = savedDoc.createdAt.getTime() === savedDoc.updatedAt.getTime();
    const action = wasCreated ? 'created' : 'updated';

    return send(res, wasCreated ? 201 : 200, {
      success: true,
      message: `Delivery ${action} successfully`,
      data: savedDoc,
    });
  } catch (err) {
    // Handle “not found when _id provided but no doc exists”
    if (err.kind === 'ObjectId' || err.code === 11000) {
      return send(res, 404, {
        success: false,
        message: 'Delivery not found',
        error: err.message,
      });
    }
    return send(res, 500, {
      success: false,
      message: 'Server error saving delivery',
      error: err.message,
    });
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
    return send(res, 500, {
      success: false,
      message: 'Error fetching deliveries',
      error: err.message,
    });
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
