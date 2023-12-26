import mongoose from "mongoose";

const surveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  images: { type: [String] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  noOfResponses: { type: Number, required: true },
  currentResponses: { type: Number, default: 0 },
  respondersId: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
});

export default mongoose.model("Survey", surveySchema);
