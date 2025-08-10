import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const addressSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home',
    },
    doorNo: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    landmark: String, // optional
    buildingName: String, // optional
    floor: String, // optional
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    address: [addressSchema],
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin', 'delivery_agent'],
      default: 'customer',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// userSchema.methods.comparePassword = function (plain) {
//   return bcrypt.compare(plain, this.passwordHash);
// };

export default mongoose.model('User', userSchema);
