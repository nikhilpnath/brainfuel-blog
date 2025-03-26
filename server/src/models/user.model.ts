import { model, Schema, Types } from "mongoose";
import { createError } from "../util/customError";
import { TUserDocument, TUserModel } from "../types/user.types";

const userSchema = new Schema<TUserDocument>(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: String,
    savedPosts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

type TUserData = {
  _id: Types.ObjectId;
  savedPosts: string[];
};

userSchema.statics.findUserByClerkID = async function (clerkId: string) {
  const User = this;

  if (!clerkId) throw createError("You are not authenicated", 401);

  const userData: TUserData | null = await User.findOne({
    clerkUserId: clerkId,
  })
    .select("_id savedPosts")
    .lean();

  if (!userData) throw createError("User not found", 404);

  return { id: userData._id, savedPosts: userData.savedPosts };
};

export default model<TUserDocument, TUserModel>("User", userSchema);
