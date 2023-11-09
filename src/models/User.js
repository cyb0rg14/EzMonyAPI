import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
    minlength: 4,
  },
  password: {
    type: String,
    required: true,
  },
  Interests: {
    type: Array,
    default: [],
  },
  age: {
    type: Number,
    default: null,
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Other",
  },
  location: {
    type: String,
    default: null,
  },
  occupation: {
    type: String,
    default: null
  }
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", UserSchema);
