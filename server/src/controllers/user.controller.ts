import User from "@models/user.model";
import Post from "@models/post.model";
import { createError } from "@util/customError";
import { isValidObjectId } from "@util/validators";
import { TCustomRequestHandler } from "../types/request.dto.types";

//get user saved posts - check if a post is saved
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

// get all saved posts with full post data (paginated)
export const getAllSavedPosts: TCustomRequestHandler<
  {},
  {},
  { page?: string; limit?: string }
> = async (req, res, next) => {
  const { savedPosts } = await User.findUserByClerkID(req.auth?.userId!);

  if (!savedPosts || savedPosts.length === 0) {
    return res.status(200).json({ posts: [], hasMore: false });
  }

  const pageNum = Math.max(Number(req.query.page) || 1, 1);
  const dataLimit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

  const totalPosts = await Post.countDocuments({ _id: { $in: savedPosts } });
  const hasMore = pageNum * dataLimit < totalPosts;

  const posts = await Post.find({ _id: { $in: savedPosts } })
    .populate("user", "username")
    .sort({ createdAt: -1 })
    .limit(dataLimit)
    .skip((pageNum - 1) * dataLimit)
    .lean();

  res.status(200).json({ posts, hasMore });
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
