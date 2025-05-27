import { Review } from '../models/review.model.js';

const send = (res, status, { success, message, data = null, error = null }) =>
  res.status(status).json({ success, message, data, error });

export const saveOrUpdateReview = async (req, res) => {
  try {
    const { _id, user, product, rating, comment } = req.body;

    let query;
    if (_id) {
      query = { _id };
    } else if (user && product) {
      // Assume 1 review per user per product
      query = { user, product };
    } else {
      return send(res, 400, {
        success: false,
        message: 'Must include _id or both user and product',
      });
    }

    const updated = await Review.findOneAndUpdate(
      query,
      { $set: { rating, comment, user, product } },
      { new: true, upsert: true, runValidators: true }
    ).populate('user').populate('product');

    const wasCreated = updated.createdAt.getTime() === updated.updatedAt.getTime();
    const action = wasCreated ? 'created' : 'updated';

    return send(res, wasCreated ? 201 : 200, {
      success: true,
      message: `Review ${action} successfully`,
      data: updated,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error saving review',
      error: err.message,
    });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user')
      .sort({ createdAt: -1 });

    return send(res, 200, {
      success: true,
      message: 'Reviews fetched',
      data: reviews,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Failed to fetch reviews',
      error: err.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return send(res, 404, { success: false, message: 'Review not found' });
    }

    return send(res, 200, {
      success: true,
      message: 'Review deleted',
      data: { _id: deleted._id },
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error deleting review',
      error: err.message,
    });
  }
};
