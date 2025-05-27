import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantityKg: Number,
    pricePerKg: Number,
    totalPrice: Number,
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [orderItemSchema],
    totalAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['COD', 'UPI', 'Card'] },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    deliveryDate: Date,
    deliveryTime: String,
    deliveryType: { type: String, enum: ['booking', 'same_day'] },
  },
  { timestamps: true },
);
export default mongoose.model('Order', orderSchema);
