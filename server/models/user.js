const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
    },
    otpCode: {
      type: Number,
    },
    otpCreateTime: {
      type: Date,
      default: Date.now,
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "ToDo" }],
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
