const mongoose = require("mongoose");

const ContactQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    message: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("contactQuery", ContactQuerySchema);