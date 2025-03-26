import Post from "../models/post.model";
import { TCustomRequestHandler } from "../types/request.dto.types";

export const increaseVisit: TCustomRequestHandler<{ slug: string }> = async (
  req,
  res,
  next
) => {
  const { slug } = req.params;

  await Post.findOneAndUpdate({ slug }, { $inc: { visit: 1 } });

  next();
};
