import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: [String], required: true },
  subCategories: { type: [String], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  noOfViews: { type: Number, default: 0 },
  metrics: {
    impressions: { type: Number, default: 0 },
    currentViews: { type: Number, default: 0 },
    wentToYoutube: { type: Number, default: 0 },
  },
  targetAudience: {
    ageGroups: { type: [String], default: [] },
    geolocations: { type: [String], default: []},
    tags: { type: [String], default: [] },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  }
});

export default mongoose.model("Video", videoSchema);
