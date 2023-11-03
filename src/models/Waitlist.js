import mongoose from "mongoose";

const WaitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("Waitlist", WaitlistSchema);
