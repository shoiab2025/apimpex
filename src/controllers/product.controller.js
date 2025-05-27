// controllers/productController.js
import mongoose from 'mongoose';
import Product from '../models/product.model.js';

const DEFAULT_PAGE_SIZE = 20;

/* --------------------------- create product --------------------------- */
// POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      pricePerKg,
      stockQuantityKg = 0,
      imageUrls = [],
      vendor, // typically req.user.id if you add auth
    } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      pricePerKg,
      stockQuantityKg,
      imageUrls,
      vendor,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/* ---------------------------- list products --------------------------- */
// GET /api/products?category=...&vendor=...&page=1&limit=20&active=true
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      vendor,
      active = true,
      page = 1,
      limit = DEFAULT_PAGE_SIZE,
      search,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;
    if (active !== 'all') filter.isActive = active !== 'false';

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter)
      .populate('category', 'name')
      .populate('vendor',   'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({ total, page: +page, pageSize: products.length, products });
  } catch (err) {
    next(err);
  }
};

/* -------------------------- get single product ------------------------ */
// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: 'Invalid product id' });

    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('vendor',   'name email');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

/* --------------------------- update product --------------------------- */
// PUT/PATCH /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };

    // Prevent direct overwrite of vendor or _id unless intentionally allowed
    delete update._id;

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

/* --------------------------- delete product --------------------------- */
// DELETE /api/products/:id  – soft-delete (set isActive:false)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deactivated', product });
  } catch (err) {
    next(err);
  }
};

/* ----------------------------- stock patch --------------------------- */
// PATCH /api/products/:id/stock  { "deltaKg": -5 }
export const adjustStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deltaKg } = req.body;

    if (typeof deltaKg !== 'number')
      return res.status(400).json({ message: 'deltaKg must be a number' });

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { stockQuantityKg: deltaKg } },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stockQuantityKg < 0) {
      product.stockQuantityKg = 0;
      await product.save();
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};
