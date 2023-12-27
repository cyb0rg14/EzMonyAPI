import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
  files: { type: [String] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: [String], required: true },
  subCategories: { type: [String], required: true },
  destinationUrl: { type: String, required: true },
  callToAction: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  noOfViews: { type: Number, default: 0 },
  viewersId: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  metrics: {
    impressions: { type: Number, default: 0 },
    currentViews: { type: Number, default: 0 },
    clickOnUrl: { type: Number, default: 0 },
  },
  targetAudience: {
    ageGroups: { type: [String] },
    geolocations: { type: [String] },
    tags: { type: [String] },
  },
  contactInfo: {
    email: { type: String },
    phone: { type: String },
    website: { type: String },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "User",
  },
});

export default mongoose.model("Ad", adSchema);
