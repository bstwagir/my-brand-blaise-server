const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, 
      ref: 'Comment' }],
    likes: {
      type: Array,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);