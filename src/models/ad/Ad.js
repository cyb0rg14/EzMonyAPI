import mongoose from "mongoose"

const adSchema = new mongoose.Schema({
  files: {
    type: [String],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
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
  destinationUrl: {
    type: String,
  },
  callToAction: {
    type: String,
  },
  targetAudience: {
    age: {
      type: String,
    },
    geolocation: {
      type: String,
    },
    keywords: {
      type: [String],
    }
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
  views: {
    type: Number,
    default: 0,
  },
  currentViews: {
    type: Number,
    default: 0,
  },
  viewersId: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
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
});

export default mongoose.model("Ad", adSchema);