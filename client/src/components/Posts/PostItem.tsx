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
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* image */}
      <div className="md:hidden xl:block xl:w-2/3">
        <ImageCmp
          src={post.img ?? "postImg.jpeg"}
          alt="Recent Post"
          className="rounded-2xl object-cover"
          w="735"
          h='435'
        />
      </div>
      {/* details */}
      <div className="flex flex-col gap-4 xl:w-2/3 ">
        <Link
          to={`/posts/${post.slug}`}
          className="text-xl md:text-3xl xl:text-4xl font-semibold"
        >
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <button
            type="button"
            className="text-blue-800 hover:underline cursor-pointer"
            onClick={() => handleParams("author")(post.user.username)}
          >
            {post.user.username}
          </button>
          <span>on</span>
          <button
            type="button"
            className="text-blue-800 hover:underline cursor-pointer"
            onClick={() => handleParams("cat")(post.category)}
          >
            {category}
          </button>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc.substring(0, 300)}...</p>
        <Link
          to={`/posts/${post.slug}`}
          className="text-blue-800 underline text-sm"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostItem;
