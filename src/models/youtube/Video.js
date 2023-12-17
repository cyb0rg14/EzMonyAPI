import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalViews: { type: Number, default: 0 },
  metrics: {
    impressions: { type: Number, default: 0 },
    currentViews: { type: Number, default: 0 },
    wentToYoutube: { type: Number, default: 0 },
  },
  targetAudience: {
    age: { type: String, default: null },
    geolocation: { type: String, default: null },
    preference: { type: String, default: null },
    tags: { type: [String], default: [] },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

export default mongoose.model("Video", videoSchema);
