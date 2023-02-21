const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, 
             ref: 'Post' },
    user_id: { type: mongoose.Schema.Types.ObjectId, 
             ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);