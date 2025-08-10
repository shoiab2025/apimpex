import mongoose from 'mongoose';
// =======================
// Delivery Schema
// =======================
const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    deliveryAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryStatus: {
      type: String,
      enum: ['out_for_delivery', 'delivered'],
      default: 'out_for_delivery',
    },
    estimatedTime: { type: Date },
    deliveredAt: { type: Date },
    deliveryNotes: { type: String },
  },
  { timestamps: true }
);

export const Delivery = mongoose.model('Delivery', deliverySchema);

