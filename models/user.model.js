const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: "User name is required",
    unique: true
  },

  email: {
    type: String,
    required: "email is required",
    unique: true
  },

  password: {
    type: String,
    required: "password is required",
  },

  accountStatus: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});


const User = mongoose.model("User", UserSchema);


module.exports = {
  User
}