import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  picture: { type: String, require: true },
  duration: { type: Number, required: true },
  reward: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  views: { type: Number, default: 0 },
  currentViews: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Survey", surveySchema);
