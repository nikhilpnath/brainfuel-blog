import User from "../models/user.model";
import Comment from "../models/comment.model";
import { createError } from "../util/customError";
import { TCustomRequestHandler } from "../types/request.dto.types";

// Get Comments
export const getComments: TCustomRequestHandler<{ postId: string }> = async (
  req,
  res,
  next
) => {
  const { postId } = req.params;

  const comment = await Comment.find({ post: postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.status(200).json(comment);
};

//add comment
export const addComment: TCustomRequestHandler<
  { postId: string },
  { comment: string }
> = async (req, res, next) => {
  const { postId } = req.params;
  const { comment } = req.body;

  const { id: userId } = await User.findUserByClerkID(req.auth?.userId!);

  if (!comment) return next(createError("Enter a valid comment", 404));

  const newComment = new Comment({
    comment,
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
  const { id: userId } = await User.findUserByClerkID(req.auth?.userId!);

  const role = req.auth?.sessionClaims?.metadata?.role || "user";
  

  const deletedComment =
    role === "admin"
      ? await Comment.findByIdAndDelete(id)
      : await Comment.findOneAndDelete({
          _id: id,
          user: userId,
        });

  if (!deletedComment)  return next(createError("You can delete only your comment!", 401));

  res.status(200).json({ message: "Comment deleted successfully" });
};
