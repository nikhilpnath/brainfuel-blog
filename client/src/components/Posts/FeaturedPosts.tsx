import { Link } from "react-router";

import { format } from "@/utils/timeAgo";
import { Image } from "@/components";
import { TPostQueryData, TPosts } from "@/types/types";
import { useUseQueryHook, useNetworkStatus } from "@/hooks";
import FeaturedSkeleton from "./FeaturedSkeleton";

const FeaturedPosts = () => {
  const isOnline = useNetworkStatus(false);

  // 1. Fetch posts explicitly marked as featured
  const { fetchStatus: featuredFetchStatus, data: featuredData } =
    useUseQueryHook<TPostQueryData>({
      queryKey: ["featuredPost"],
      url: "posts?featured=true&limit=4&sort=newest",
      enabled: isOnline,
    });

  const featuredPostsList: TPosts[] = featuredData?.posts || [];
  const needsFallback = featuredPostsList.length < 4;

  // 2. Smart fallback: if fewer than 4 featured posts, fetch newest regular posts
  const { fetchStatus: fallbackFetchStatus, data: fallbackData } =
    useUseQueryHook<TPostQueryData>({
      queryKey: ["latestFallbackPosts"],
      url: "posts?limit=4&sort=newest",
      enabled: isOnline && needsFallback,
    });

  // Combine featured posts with latest fallback posts without duplicating
  const combinedPosts: TPosts[] = [...featuredPostsList];
  if (needsFallback && fallbackData?.posts) {
    for (const post of fallbackData.posts) {
      if (combinedPosts.length >= 4) break;
      if (!combinedPosts.some((p) => p._id === post._id)) {
        combinedPosts.push(post);
      }
    }
  }

  const isInitialLoading =
    isOnline &&
    combinedPosts.length === 0 &&
    (featuredFetchStatus === "fetching" ||
      (needsFallback && fallbackFetchStatus === "fetching"));

  if (isInitialLoading) {
    return <FeaturedSkeleton />;
  }

  if (combinedPosts.length === 0) {
    return null;
  }

  const firstSection = combinedPosts[0];
  const remainingSection = combinedPosts.slice(1);

  const removeCategoryHyphen = (text: string) =>
    text ? text.split("-").join(" ").toLowerCase() : "";

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-8">
      {/* First section*/}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <Image
          key={firstSection.img}
          src={firstSection.img}
          alt={firstSection.title}
          className="rounded-3xl"
          w="895"
          h="590"
          priority="high"
        />
        {/* details */}
        <div className="flex items-center gap-4">
          <h1 className="lg:text-lg font-semibold">01.</h1>
          <Link
            to={`/posts?cat=${firstSection.category?.toLowerCase()}`}
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
          to={`/posts/${firstSection.slug}`}
          className="text-xl lg:text-3xl font-semibold lg:font-bold hover:text-blue-800 transition-colors"
        >
          {firstSection.title}
        </Link>
      </div>

      {/* Second section*/}
      {remainingSection.length > 0 && (
        <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-between">
          {remainingSection.map(
            ({ title, img, category, createdAt, slug }, index) => (
              <div
                className="lg:h-1/3 flex justify-between gap-4"
                key={slug || index}
              >
                <div className="w-1/3 aspect-video">
                  <Image
                    src={img}
                    className="rounded-3xl object-cover w-full h-full"
                    alt={title}
                    w="298"
                  />
                </div>
                {/* details and title */}
                <div className="w-2/3">
                  <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
                    <h1 className="font-semibold">0{index + 2}.</h1>
                    <Link
                      to={`/posts?cat=${category?.toLowerCase()}`}
                      className="text-blue-800"
                    >
                      {removeCategoryHyphen(category)}
                    </Link>
                    <span className="text-gray-500 text-sm">
                      {format(createdAt)}
                    </span>
                  </div>

                  <Link
                    to={`/posts/${slug}`}
                    className="text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium hover:text-blue-800 transition-colors"
                  >
                    {title}
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedPosts;
