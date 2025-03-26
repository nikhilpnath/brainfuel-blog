import { model, Schema } from "mongoose";
import User from "./user.model";
import Comment from "./comment.model";

import { TPostSchemaModelType } from "../types/post.types";

const postSchema = new Schema<TPostSchemaModelType>(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    media: {
      type: [String],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visit: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//removing the postId from the users's savedPosts array and deleing the comments

postSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const Post = this;

    await Promise.all([
      Comment.deleteMany({ post: Post._id }),
      User.updateMany(
        { savedPosts: Post._id },
        { $pull: { savedPosts: Post._id } }
      ),
    ]);

    next();
  }
);

export default model<TPostSchemaModelType>("Post", postSchema);
