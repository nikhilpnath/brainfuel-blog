import User from "@models/user.model";
import { createError } from "@util/customError";
import { isValidObjectId } from "@util/validators";
import { TCustomRequestHandler } from "../types/request.dto.types";

//get user saved posts
export const getUserSavedPosts: TCustomRequestHandler<{
  postId: string;
}> = async (req, res, next) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return next(createError("Invalid post ID", 400));
  }

  const { savedPosts } = await User.findUserByClerkID(req.auth?.userId!);

  const isPostSaved = savedPosts?.includes(postId);

  res.status(200).json({
    savedPosts,
    isPostSaved,
  });
};

// add or remove posts - saved list
export const addOrRemovePost: TCustomRequestHandler<
  {},
  { postId: string }
> = async (req, res, next) => {
  const { postId } = req.body;

  if (!isValidObjectId(postId)) {
    return next(createError("Invalid post ID", 400));
  }

  const { id, savedPosts } = await User.findUserByClerkID(req.auth?.userId!);

  const isSaved = savedPosts.some((id) => id === postId);

  if (!isSaved) {
    await User.updateOne(
      { _id: id },
      {
        $push: { savedPosts: postId },
      }
    );
  } else {
    await User.updateOne(
      { _id: id },
      {
        $pull: { savedPosts: postId },
      }
    );
  }

  res.status(200).end();
};
