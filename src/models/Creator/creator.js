import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const creatorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullname: { type: String, required: true, minlength: 4 },
  password: { type: String, required: true },
  surveysCreated: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  adsCreated: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  videosCreated: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  reelsCreated: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  moneySpent: {
    today: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  socialLinks: {
    instagram: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    linkedin: { type: String },
    other: { type: String },
  },
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String, required: true },
  },
});

creatorSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

creatorSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Creator", creatorSchema);
