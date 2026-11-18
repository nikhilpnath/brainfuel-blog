import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

import axios from "axios";

import { TPostQueryData } from "@/types/types";
import { ErrorCmp, InfiniteScroll, PostItem } from "@/components";
import { usePostInfiniteQueryHook } from "@/hooks";
import { useAuth } from "@clerk/clerk-react";

const SavedPosts = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchSavedPosts = async (pageParam: number): Promise<TPostQueryData> => {
    const token = await getToken();
    const res = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/api/users/saved`,
      {
        params: { page: pageParam, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  };

  const { allPosts, fetchNextPage, hasNextPage, isPending } =
    usePostInfiniteQueryHook(fetchSavedPosts, "saved");

  if (!isLoaded) return <div>Loading...</div>;

  if (isLoaded && !isSignedIn) {
    return (
      <ErrorCmp
        icon="🔖"
        title="Your Reading List"
        text="Sign in to access your saved posts and build your personal reading list."
        btnText="Sign In to Continue →"
        btnAction={() => navigate("/login")}
        secondaryBtnText="Explore Posts"
        secondaryBtnAction={() => navigate("/posts")}
      />
    );
  }

  return (
    <div className="mt-6 max-w-4xl mx-auto mb-16">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Saved Posts
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Your personal reading list — posts you've bookmarked for later.
        </p>
      </div>

      {/* Content */}
      {isPending ? (
        <p className="text-center py-6 text-gray-400">
          Loading saved posts...
        </p>
      ) : allPosts.length > 0 ? (
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
        <ErrorCmp
          icon="🔖"
          title="No Saved Posts Yet"
          text="You haven't saved any posts yet. Browse articles and tap the bookmark icon to save them here."
          btnText="Browse Posts"
          btnAction={() => navigate("/posts")}
        />
      )}
    </div>
  );
};

export default SavedPosts;
