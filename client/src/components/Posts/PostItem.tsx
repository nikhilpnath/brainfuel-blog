import { format } from "@/utils/timeAgo";
import { Link, useLocation, useNavigate } from "react-router";

import { TPosts } from "@/types/types";
import { Image as ImageCmp } from "@/components";
import { updateSearchParams } from "@/utils/updateSearchParams";

type TParam = {
  post: TPosts;
};

const PostItem = ({ post }: TParam) => {
  const location = useLocation();
  const navigate = useNavigate();

  //removing '-'
  const category = post.category.split("-").join(" ");

  //currying
  const handleParams = (key: string) => (value: string) => {
    if (location.pathname === "/posts") {
      const obj = { [key]: value, navigate };
      updateSearchParams(obj);
    } else {
      navigate(`/posts?${key}=${value}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-12">
      {/* image */}
      <div className="w-full md:w-2/5 xl:w-1/3 shrink-0">
        <ImageCmp
          src={post.img ?? "featured1.jpeg"}
          alt={post.title}
          className="rounded-2xl object-cover w-full h-56 md:h-full max-h-64"
          w="735"
          h="435"
        />
      </div>
      {/* details */}
      <div className="flex flex-col gap-4 md:w-3/5 xl:w-2/3">
        <Link
          to={`/posts/${post.slug}`}
          className="text-xl md:text-3xl xl:text-4xl font-semibold hover:text-blue-800 transition-colors"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-500 text-sm flex-wrap">
          <span>Written by</span>
          <button
            type="button"
            className="text-blue-800 font-medium hover:underline cursor-pointer"
            onClick={() => handleParams("author")(post.user.username)}
          >
            {post.user.username}
          </button>
          <span>•</span>
          <button
            type="button"
            className="text-blue-800 font-medium hover:underline cursor-pointer capitalize"
            onClick={() => handleParams("cat")(post.category)}
          >
            {category}
          </button>
          <span>•</span>
          <span className="text-gray-400">{format(post.createdAt)}</span>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {post.desc.substring(0, 300)}...
        </p>
        <Link
          to={`/posts/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:text-blue-950 group w-max transition-colors mt-1"
        >
          <span>Read Article</span>
          <span
            className="transform transition-transform group-hover:translate-x-1 text-base font-bold"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
