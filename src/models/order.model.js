import mongoose from 'mongoose';

// --------------------------------------------------
//  Sub‑schema for each item in an order
// --------------------------------------------------
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantityKg: {
      type: Number,
      required: true,
      min: 0.001,
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

// --------------------------------------------------
//  Main order schema
// --------------------------------------------------
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // -------------------------
    //  Order + payment status
    // -------------------------
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'Card'],
    },

    // -------------------------
    //  Delivery information
    // -------------------------
    deliveryAddress: {
      street: { type: String, required: true },
      doorNo: { type: String, required: true },
      landmark: { type: String }, // optional
      buildingName: { type: String }, // optional
      floor: { type: String }, // optional (could be "G", "1", "12A", etc.)
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    deliveryDate: Date,
    deliveryTime: String,
    deliveryType: {
      type: String,
      enum: ['booking', 'same_day'],
    },
  },
  { timestamps: true },
);

export default mongoose.model('Order', orderSchema);
