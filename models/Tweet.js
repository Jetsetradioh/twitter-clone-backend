import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Koppling till User
      ref: "User",
      required: true,
    },
    tweets: {
      type: String,
      required: true,
      maxlength: 140,
    },
    image: {
      type: String,
      default: "",
    },
    likes: {
      type: Number,
      default: 0,
    },
    retweets: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Tweet", tweetSchema);
