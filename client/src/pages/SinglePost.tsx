import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";

import DOMPurify from "dompurify";
import { format } from "@/utils/timeAgo";
import { toast } from "react-toastify";

import {
  CommentsSection,
  Image,
  ErrorCmp,
  PostActions,
  Sidemenu,
} from "@/components";
import { useUseQueryHook } from "@/hooks";
import { TPosts as TUSeQueryData } from "@/types/types";

const SinglePost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { isPending, error, data } = useUseQueryHook<TUSeQueryData>({
    queryKey: ["post", slug],
    url: `posts/${slug}`,
    enabled: !!slug,
    retry: false,
    stale: "infinity",
  });

  // showing error only once
  useEffect(
    function limitingError() {
      if (error) {
        toast.error(error.response?.data.message);
      }
    },
    [error]
  );


  if (isPending) return <p>Loading...</p>;

  if (!data) {
    return (
      <ErrorCmp
        icon="📄"
        title="Post Not Found"
        text="Oops! We couldn't find any post matching:"
        path={slug}
        desc="The article may have been deleted, moved, or the URL might be mistyped."
        btnText="Browse All Posts"
        btnAction={() => navigate("/posts")}
        secondaryBtnText="Back to Home"
        secondaryBtnAction={() => navigate("/")}
      />
    );
  }

  // sanitizing html data
  const sanitizedHTML = DOMPurify.sanitize(data.content!, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  });

  const removeHyphen = (text: string) => text.split("-").join(" ");

  return (
    <div className="flex flex-col gap-8">
      {/* first section */}
      <div className="flex flex-col lg:flex-row gap-8 my-5">
        {/* details */}
        <div className="flex flex-col gap-4 lg:w-3/4">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link
              to={`/posts?author=${data.user.username}`}
              className="text-blue-800"
            >
              {data.user.username}
            </Link>
            <span>on</span>
            <Link to={`/posts?cat=${data.category}`} className="text-blue-800">
              {removeHyphen(data.category)}
            </Link>
            <span>{format(data.createdAt)}</span>
          </div>

          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>

        {/* image */}
        {data.img && (
          <div className="w-full lg:w-2/5 shrink-0">
            <Image
              src={data.img}
              alt={data.title || "post_image"}
              className="rounded-2xl w-full h-64 md:h-72 object-cover"
              w="600"
            />
          </div>
        )}
      </div>

      {/* second section */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* main column (article body + comments) */}
        <div className="flex flex-col gap-10 md:w-4/5 flex-[2_2_0]">
          <div
            className="flex flex-col gap-6 text-justify lg:text-lg post-content"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
          <hr className="border-gray-200/80 my-2" />
          <CommentsSection postId={data._id} />
        </div>

        {/* sidemenu - sticky on desktop */}
        <div className="h-max md:sticky md:top-8 flex-1">
          <div className="flex flex-col gap-4 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Author
            </h2>
            <div className="flex items-center gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm">
              <img
                src={data.user.img}
                alt="User profile"
                className="w-12 h-12 rounded-full object-cover"
                width="48"
                height="48"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Written by</span>
                <Link
                  to={`/posts?author=${data.user.username}`}
                  className="text-blue-800 font-semibold hover:underline"
                >
                  {data.user.username}
                </Link>
              </div>
            </div>

            {/* post actions */}
            <PostActions
              post={{
                _id: data._id,
                slug: data.slug,
                isFeatured: data.isFeatured,
                username: data.user.username,
              }}
            />
          </div>
          <Sidemenu showFilter={false} />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
