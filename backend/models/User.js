const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that each email is unique
  },
  password: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
