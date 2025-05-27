import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
  },
  { timestamps: true }
);

export const Offer = mongoose.model('Offer', offerSchema);
