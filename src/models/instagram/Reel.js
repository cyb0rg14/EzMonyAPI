import mongoose from "mongoose";

const reelSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  currentViews: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Reel", reelSchema);
