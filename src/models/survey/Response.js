import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  survey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Survey",
    required: true,
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      response: { type: String }, // might adjust this based on the question type
    },
  ],
});

export default mongoose.model("Response", responseSchema);
