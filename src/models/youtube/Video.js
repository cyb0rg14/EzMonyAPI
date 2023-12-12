import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalViews: { type: Number, default: 0 },
  currentViews: { type: Number, default: 0 },
  category: { type: String, required: true },
  subCategory: { type: String, default: true },
  targetPersonalizedAudience: { type: Boolean, default: false },
  geolocation: { type: String, default: null },
  ageGroup: { type: String, default: null },
  preference: { type: String, default: null },
  tags: { type: [String], default: [] },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

export default mongoose.model("Video", videoSchema);
