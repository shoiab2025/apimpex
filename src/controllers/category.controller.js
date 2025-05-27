import Category from '../models/category.model.js';

const send = (res, status, { success, message, data = null, error = null }) =>
  res.status(status).json({ success, message, data, error });

export const saveOrUpdateCategory = async (req, res) => {
  try {
    const payload = req.body;
    let query = null;

    if (payload._id) {
      query = { _id: payload._id };
    } else if (payload.name) {
      query = { name: payload.name };
    }

    if (!query) {
      return send(res, 400, {
        success: false,
        message: 'Must provide _id or name to create/update a category',
      });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      query,
      { $set: payload },
      { new: true, upsert: true, runValidators: true }
    );

    const wasCreated = updatedCategory.createdAt.getTime() === updatedCategory.updatedAt.getTime();
    const action = wasCreated ? 'created' : 'updated';

    return send(res, wasCreated ? 201 : 200, {
      success: true,
      message: `Category ${action} successfully`,
      data: updatedCategory,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error saving category',
      error: err.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return send(res, 200, {
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Failed to fetch categories',
      error: err.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return send(res, 404, { success: false, message: 'Category not found' });
    }
    return send(res, 200, {
      success: true,
      message: 'Category found',
      data: category,
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error retrieving category',
      error: err.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return send(res, 404, { success: false, message: 'Category not found' });
    }
    return send(res, 200, {
      success: true,
      message: 'Category deleted successfully',
      data: { _id: deleted._id },
    });
  } catch (err) {
    return send(res, 500, {
      success: false,
      message: 'Error deleting category',
      error: err.message,
    });
  }
};
