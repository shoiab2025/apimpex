import mongoose from 'mongoose';

const greetingSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    content: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Greeting', greetingSchema);
