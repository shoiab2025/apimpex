import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: String,
    pricePerKg: { type: Number, required: true },
    stockQuantityKg: { type: Number, default: 0 },
    imageUrls: [String],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model('Product', productSchema);
