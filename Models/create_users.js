const mongoose = require("mongoose");

const createUsersSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: [true, "First Name is Required"],
    trim: true,
  },
  LastName: {
    type: String,
    required: [true, "Last Name is Required"],
    trim: true,
  },
  Age: {
    type: Number,
    required: [true, "Age is Required"],
    min: [1, "Age must be greater than 0"],
  },
  DOB: {
    type: String,
    required: [true, "Date of Birth is required"],
  },
  Email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter valid email address",
    },
  },
  Password: {
    type: String,
    required: [true, "Password is required"]
  },
  PhoneNumber: {
    type: String,
    required: [true, "Phone Number is Required"],
    validate: {
      validator: function (v) {
        return /^\+?\d{10,12}$/.test(v);
      },
      message: "Enter Valid Phone Number",
    },
  },
  Gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["Male", "Female", "Others"],
  },
});

module.exports = mongoose.model("User", createUsersSchema);
