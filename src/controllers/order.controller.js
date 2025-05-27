import Order from '../models/order.model.js';

const send = (res, status, { success, message, data = null, error = null }) =>
  res.status(status).json({ success, message, data, error });

export const saveOrUpdateOrder = async (req, res) => {
  try {
    const { _id, user, items, totalAmount, status, paymentStatus, paymentMethod, deliveryAddress, deliveryDate, deliveryTime, deliveryType } = req.body;

    if (!_id && !user) {
      return send(res, 400, {
        success: false,
        message: 'User ID is required to create an order.',
      });
    }

    // Calculate totalAmount from items if not provided
    let calculatedTotal = totalAmount;
    if (!totalAmount && Array.isArray(items)) {
      calculatedTotal = items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
    }

    let query = _id ? { _id } : { user };

    const updatedOrder = await Order.findOneAndUpdate(
      query,
      {
        $set: {
          user,
          items,
          totalAmount: calculatedTotal,
          status,
          paymentStatus,
          paymentMethod,
          deliveryAddress,
          deliveryDate,
          deliveryTime,
          deliveryType,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const wasCreated = updatedOrder.createdAt.getTime() === updatedOrder.updatedAt.getTime();
    const action = wasCreated ? 'created' : 'updated';

    return send(res, wasCreated ? 201 : 200, {
      success: true,
      message: `Order ${action} successfully`,
      data: updatedOrder,
    });
  } catch (error) {
    return send(res, 500, {
      success: false,
      message: 'Error saving order',
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    // Optionally filter by user id query param: ?user=userid
    const filter = {};
    if (req.query.user) {
      filter.user = req.query.user;
    }

    const orders = await Order.find(filter).populate('user').populate('items.product').sort({ createdAt: -1 });
    return send(res, 200, {
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });
  } catch (error) {
    return send(res, 500, {
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('items.product');
    if (!order) {
      return send(res, 404, { success: false, message: 'Order not found' });
    }
    return send(res, 200, {
      success: true,
      message: 'Order fetched successfully',
      data: order,
    });
  } catch (error) {
    return send(res, 500, {
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return send(res, 404, { success: false, message: 'Order not found' });
    }
    return send(res, 200, {
      success: true,
      message: 'Order deleted successfully',
      data: { _id: deleted._id },
    });
  } catch (error) {
    return send(res, 500, {
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};
