import mongoose from "mongoose"

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  keywords: {
    type: [String],
  },
  docs: {
    type: [String], 
  },
  contactInfo: {
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  deliveryOptions: {
    type: String,
  },
  targetAudience: {
    age: {
      type: String,
    },
  },
  duration: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['image', 'video', 'text'],
    default: 'text',
  },
  paymentInfo: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', 
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
  },
  feedback: {
    type: String,
  },
});

export default mongoose.model("Ad", adSchema);