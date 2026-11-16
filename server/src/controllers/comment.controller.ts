import User from "@models/user.model";
import Post from "@models/post.model";
import Comment from "@models/comment.model";
import { createError } from "@util/customError";
import { isValidObjectId, validateCommentInput } from "@util/validators";
import { TCustomRequestHandler } from "../types/request.dto.types";

// Get Comments
export const getComments: TCustomRequestHandler<{ postId: string }> = async (
  req,
  res,
  next
) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return next(createError("Invalid post ID", 400));
  }

  const comment = await Comment.find({ post: postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(comment);
};

//add comment
export const addComment: TCustomRequestHandler<
  { postId: string },
  { comment: string }
> = async (req, res, next) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return next(createError("Invalid post ID", 400));
  }

  const validation = validateCommentInput(req.body);
  if (validation.error || !validation.comment) {
    return next(createError(validation.error || "Enter a valid comment", 400));
  }

  const postExists = await Post.exists({ _id: postId });
  if (!postExists) {
    return next(createError("Post not found", 404));
  }

  const { id: userId } = await User.findUserByClerkID(req.auth?.userId!);

  const newComment = new Comment({
    comment: validation.comment,
    user: userId,
    post: postId,
  });

  await newComment.save();

  res.status(201).json({ message: "Comment added successfully" });
};

//delete comment
export const deleteComment: TCustomRequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(createError("Invalid comment ID", 400));
  }

  const { id: userId } = await User.findUserByClerkID(req.auth?.userId!);

  const role = req.auth?.sessionClaims?.metadata?.role || "user";

  const deletedComment =
    role === "admin"
      ? await Comment.findByIdAndDelete(id)
      : await Comment.findOneAndDelete({
          _id: id,
          user: userId,
        });

  if (!deletedComment) return next(createError("You can delete only your comment!", 401));

  res.status(200).json({ message: "Comment deleted successfully" });
};
