import { TAxiosError, TPostQueryData, TPosts } from "@/types/types";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

type tUseCustomHookReturn = {
  allPosts: TPosts[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  message?: string;
  isPending: boolean;
};

type TFetchData = (
  pageParam: number,
  searchParam?: string
) => Promise<TPostQueryData>;

export default function usePostInfiniteQueryHook(
  fetchData: TFetchData,
  searchParam?: string
): tUseCustomHookReturn {
  
  const { data, error, fetchNextPage, hasNextPage, status } = useInfiniteQuery<
    TPostQueryData,
    TAxiosError,
    InfiniteData<TPostQueryData, number>,
    [string, string?],
    number
  >
  ({
    queryKey: searchParam ? ["posts", searchParam.toString()] : ["posts"],
    queryFn: ({ pageParam = 1 }) => fetchData(pageParam, searchParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
    gcTime: 1000 * 60 * 10,
  });

  if (status === "pending")
    return { allPosts: [], fetchNextPage, hasNextPage, isPending: true };

  if (status === "error") {
    console.error("An error has occurred:", error.message);
    return { allPosts: [], fetchNextPage, hasNextPage, isPending: false };
  }

  const allPosts = data.pages.flatMap((page) => page.posts) || [];

  return {
    allPosts,
    fetchNextPage,
    hasNextPage: hasNextPage || false,
    message: data.pages[0]?.message,
    isPending: false,
  };
}
