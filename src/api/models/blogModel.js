const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [
      true,
      "Something went wrong. Please reset authentication and try again.",
    ],
  },
  authorData: {
    _id: mongoose.Types.ObjectId,
    name: String,
    lastname: String,
    username: String,
  },
  title: String,
  blogContent: String,
  commercialSentence: String,
  coverImg: {
    type: String,
  },
  coverImgSrc: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: [
    {
      byID: {
        type: String,
      },
      _id: false
    },
  ],
  dislikes: [
    {
      byID: {
        type: String,
      },
      _id: false  // avoid automatic _id generation on MongoDB
    },
  ],
  comments: [
    {
      commentMessage: {
        type: String,
      },
      commentOwnerID: {
        type: String,
      },
      commentOwnerUsername: {
        type: String,
      },
      commentTime: {
        type: Date,
        default: new Date()
      },
      commentID: {
        type: String,
        required: true
      },
      _id: false  // avoid automatic _id generation on MongoDB
    },
  ],
  viewed: {
    type: Number,
    default: 0,
  },
  HomepageBlog: {
    type: Boolean,
    default: false
  }
});

const Blog = new mongoose.model("Blog", blogSchema);
module.exports = Blog;
