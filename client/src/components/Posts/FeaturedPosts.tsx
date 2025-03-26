import { Link } from "react-router";

import { format } from "timeago.js";

import { Image } from "../";
import { featuredPosts } from "../../utils/data";
import { TPostQueryData } from "../../types/types";
import useUseQueryHook from "../../hooks/useUseQuery.hook";
import useNetworkStatus from "../../hooks/useNetworkStatus.hook";

const FeaturedPosts = () => {
  const isOnline = useNetworkStatus(false);

  const { fetchStatus, data } = useUseQueryHook<TPostQueryData>({
    queryKey: ["featuredPost"],
    url: "posts?featured=true&limit=4&sort=newest",
    enabled: isOnline,
  });

  if (fetchStatus === "fetching" && isOnline) return "Loading....";

  const Posts = (data && data?.posts) || [];

  let count = 2;
  const firstSection = Posts.length > 0 ? Posts[0] : featuredPosts[0];
  const remainingSection =
    Posts.slice(1).length > 0 ? Posts.slice(1) : featuredPosts.slice(1);

  const removeCategoryHyphen = (text: string) =>
    text.split("-").join(" ").toLowerCase();

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      {/* First section*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <Image
            key={firstSection.img}
            src={firstSection.img}
            alt="featured_image"
            className="rounded-3xl"
            w="895"
            h="590"
          />
        {/* details */}
        <div className="flex items-center gap-4">
          <h1 className="lg:text-lg font-semibold">01.</h1>
          <Link
            to={`/posts?cat=${firstSection.category.toLowerCase()}`}
            className="text-blue-800 lg:text-lg"
          >
            {removeCategoryHyphen(firstSection.category)}
          </Link>
          <span className="text-gray-500">
            {format(firstSection.createdAt)}
          </span>
        </div>
        {/* title */}
        <Link
          to={firstSection.slug === "/" ? "/" : `/posts/${firstSection.slug}`}
          className="text-xl lg:text-3xl font-semibold lg:font-bold"
        >
          {firstSection.title}
        </Link>
      </div>

      {/* Second section*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* remaining */}

        {remainingSection.map(
          ({ title, img, category, createdAt, slug }, index) => (
            <div
              className="lg:h-1/3 flex justify-between gap-4"
              key={category + index}
            >
              <div className="w-1/3 aspect-video">
                <Image
                  src={img}
                  className="rounded-3xl object-cover w-full h-full"
                  alt="featured_image"
                  w="298"
                />
              </div>
              {/* details and title */}
              <div className="w-2/3">
                <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                  <h1 className="font-semibold">0{count++}.</h1>
                  <Link
                    to={`/posts?cat=${category.toLowerCase()}`}
                    className="text-blue-800"
                  >
                    {removeCategoryHyphen(category)}
                  </Link>
                  <span className="text-gray-500 text-sm">
                    {format(createdAt)}
                  </span>
                </div>

                <Link
                  to={slug === "/" ? "/" : `/posts/${slug}`}
                  className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium"
                >
                  {title}
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default FeaturedPosts;
