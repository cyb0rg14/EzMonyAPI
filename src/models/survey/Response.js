import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Response", responseSchema);
