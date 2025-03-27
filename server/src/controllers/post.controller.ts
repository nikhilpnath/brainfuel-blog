import { RequestHandler } from "express";
import ImageKit from "imagekit";

import Post from "@models/post.model";
import User from "@models/user.model";
import { createError } from "@util/customError";

import  { TPostType } from "../types/post.types";
import { TCustomRequestHandler } from "../types/request.dto.types";

type TQueryParams = {
  page: string;
  limit: string;
  cat?: string;
  author?: string;
  search?: string;
  sort?: "newest" | "oldest" | "popular" | "trending";
  featured?: "true" | "false";
};

type TPostQuery = {
  category?: string;
  user?: string;
  title?: { $regex: string; $options: string };
  isFeatured?: boolean;
  createdAt?: { $gte: Date };
};

//image kit

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT!,
  publicKey: process.env.IK_PUBLIC_KEY!,
  privateKey: process.env.IK_PRIVATE_KEY!,
});

//posts collection
export const getPosts: TCustomRequestHandler<{}, {}, TQueryParams> = async (
  req,
  res,
  next
) => {
  const {
    page,
    limit,
    cat,
    author,
    featured,
    search: searchVal,
    sort,
  } = req.query || {};

  const pageNum = Number(page) || 1;
  const dataLimit = Number(limit) || 5;
  const search = searchVal?.trim();

  const query: TPostQuery = {};

  if (cat) {
    query.category = cat;
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id").lean();

    if (!user) {
      return next(createError("No post found!", 404));
    }

    query.user = user._id.toString();
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  let sortObj: Record<string, 1 | -1> = { createdAt: -1 };

  if (sort) {
    switch (sort) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured === "true") {
    query.isFeatured = true;
  }

  const totalPosts = await Post.countDocuments(query);
  const hasMore = pageNum * dataLimit < totalPosts;

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(dataLimit)
    .skip((pageNum - 1) * dataLimit);

  if (posts.length === 0) {
    return res.status(200).json({
      message: "No posts found",
      posts: [],
      hasMore: false,
    });
  }

  res.status(200).json({ posts, hasMore });
};

//get post by slug
export const getPost: TCustomRequestHandler<{ slug: string }> = async (
  req,
  res,
  next
) => {
  const { slug } = req.params;

  const post = await Post.findOne({ slug }).populate("user", "username img");

  if (!post) return next(createError("Post not found", 404));

  res.status(200).json(post);
};

// create post
export const createPost: TCustomRequestHandler<{}, TPostType> = async (
  req,
  res,
  next
) => {
  const { id } = await User.findUserByClerkID(req.auth?.userId!);

  //checking if any of the input is empty
  const emptyFields: string[] = [];

  for (const [key, value] of Object.entries(req.body)) {
    if (value === "") {
      emptyFields.push(key);
    }
  }

  if (emptyFields.length > 0) {
    return next(
      createError(`Please fill all fields: ${emptyFields.join(", ")}`, 400)
    );
  }

  const { img, title, desc, category, isFeatured, visit, content, media } =
    req.body;

  // creating slug
  let slug = title.split(" ").join("-").toLowerCase();

  let baseSlug = slug;

  let slugExists = await Post.findOne({ slug });

  for (let counter = 2; slugExists; counter++) {
    slug = `${baseSlug}-${counter}`;

    slugExists = await Post.findOne({ slug });

    if (!slugExists) {
      break;
    }
  }

  const blogPost = {
    img,
    title,
    slug,
    desc,
    category,
    media,
    isFeatured,
    visit,
    content,
    user: id,
  };

  const newPost = new Post(blogPost);
  await newPost.save();

  res.status(201).json({ message: "Post has been added", slug });
};

//feature post
export const featurePost: TCustomRequestHandler<
  {},
  { postId: string }
> = async (req, res, next) => {
  const { postId } = req.body;

  const clerkUserId = req.auth?.userId;

  if (!clerkUserId) return next(createError("You are not authenicated", 401));

  const role = req.auth?.sessionClaims?.metadata?.role || "user";

  if (role !== "admin")
    return next(createError("You cannot feature post", 403));

  const post = await Post.findById(postId);

  if (!post) return next(createError("Post Not found", 404));

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    {
      new: true,
    }
  );

  res.status(200).json({ isFeatured: updatedPost?.isFeatured });
};

//delete post
export const deletePost: TCustomRequestHandler<{ postId: string }> = async (
  req,
  res,
  next
) => {
  const { postId } = req.params;

  const { id } = await User.findUserByClerkID(req.auth?.userId!);
  const role = req.auth?.sessionClaims?.metadata?.role || "user";

  const post =
    role === "admin"
      ? await Post.findById(postId)
      : await Post.findOne({ _id: postId, user: id });

  if (!post) return next(createError("Couldn't find any post", 404));

  try {
    //bulk deleting medias uploaded in imagekit
    await imagekit.bulkDeleteFiles(post.media);
  } catch (err) {
    return next(
      createError(
        "Failed to delete media files — invalid ImageKit file IDs.",
        400
      )
    );
  }

  await post.deleteOne(); // trigger middleware

  res.status(200).json({ message: "Post Deleted Sucessfully" });
};

// image kit - upload authentication

export const uploadAuth: RequestHandler = (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
};
