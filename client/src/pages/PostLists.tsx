import { useState } from "react";
import { useSearchParams } from "react-router";

import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import { TPostQueryData } from "@/types/types";
import { PostItem, Sidemenu } from "@/components";
import { useDebounceValue, usePostInfiniteQueryHook } from "@/hooks";

const fetchPostsWithParams = async (
  pageParam: number,
  searchParams?: string
): Promise<TPostQueryData> => {
  const searchParamsObj = searchParams
    ? Object.fromEntries(new URLSearchParams(searchParams))
    : {};

  const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/posts`, {
    params: { page: pageParam, limit: 10, ...searchParamsObj },
  });

  return res.data;
};

const PostLists = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const encodedParams = encodeURI(searchParams.toString());
  //thus we can avoid the url malformed error comes via using :(colon)

  const debouncedSearchParams = useDebounceValue(encodedParams, 700);

  const { allPosts, fetchNextPage, hasNextPage, message } =
    usePostInfiniteQueryHook(fetchPostsWithParams, debouncedSearchParams);

  return (
    <div className="mt-8">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="md:hidden px-4 py-2 bg-blue-800 w-max text-sm text-white rounded-xl mb-4"
      >
        {open ? "Close" : "Fliter or Search"}
      </button>

      <div className="flex flex-col-reverse gap-4 md:flex-row w-full">
        {message ? (
          <p className="flex-[2_2_0] text-xl">{message}</p>
        ) : (
          <div className={`${open ? "mt-5" : ""} flex-[2_2_0]`}>
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
          </div>
        )}
        <div className={`${open ? "block" : "hidden"} md:block flex-1`}>
          <div className="sticky top-8 h-max px-4 ">
            <Sidemenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostLists;
