const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,  
    },
    postId: { type: mongoose.Schema.Types.ObjectId, 
             ref: 'Post' },
    userId: { type: mongoose.Schema.Types.ObjectId, 
             ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);