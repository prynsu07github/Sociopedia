import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
        },
        userAvatar: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = new mongoose.model("Post", postSchema);

export default Post;
