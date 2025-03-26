import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import { PostItem } from "../";
import { TPostQueryData } from "../../types/types";
import { usePostInfiniteQueryHook } from "../../hooks";

const fetchPosts = async (pageParam: number): Promise<TPostQueryData> => {
  const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/posts`, {
    params: { page: pageParam, limit: 5 },
  });

  return res.data;
};

const RecentPosts = () => {
  const { allPosts, fetchNextPage, hasNextPage } =
    usePostInfiniteQueryHook(fetchPosts);

  return (
    <>
      {allPosts.length > 0 ? (
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={<h4>Loading...</h4>}
        >
          {allPosts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </InfiniteScroll>
      ) : (
        <h1 className="relative text-center text-xl font-semibold text-gray-500 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-1/3 before:border-t before:border-gray-300 before:transform before:-translate-y-1/2 after:content-[''] after:absolute after:top-1/2 after:right-0 after:w-1/3 after:border-t after:border-gray-300 after:transform after:-translate-y-1/2">
          Be the First to Post
        </h1>
      )}
    </>
  );
};

export default RecentPosts;
