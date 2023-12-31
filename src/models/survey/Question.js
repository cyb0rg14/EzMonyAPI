import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: {
    type: String,
    enum: ["option", "answer"],
    lowercase: true,
    required: true,
  },
  options: { type: [String] },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
});

export default mongoose.model("Question", questionSchema);
