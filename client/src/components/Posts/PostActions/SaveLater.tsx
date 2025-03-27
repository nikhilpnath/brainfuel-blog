import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

import { useQueryClient } from "@tanstack/react-query";
import { debounceMutation } from "@/utils/debounceMutation";
import { useUseMutationHook, useUseQueryHook } from "@/hooks";

const SaveLater = ({ postId }: { postId: string }) => {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useUseQueryHook<{ isPostSaved: boolean }>({
    queryKey: ["savedPosts"],
    url: `users/savedposts/${postId}`,
    enabled: Boolean(isSignedIn),
    tokenRequired: true,
  });

  const isSaved: boolean = data?.isPostSaved || false;

  const saveLaterMutation = useUseMutationHook<{ postId: string }>({
    url: "users/savelater",
    method: "patch",
    toastData: `${isSaved ? "Removed from" : "Added to"} savelater`,
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
    },
  });

  const handleSaveLater = debounceMutation(() => {
    if (!isSignedIn) return toast.error("Sign in to save posts.");
    saveLaterMutation.mutate({ postId });
  });

  return (
    <>
      {/* save later */}
      {isSignedIn && isPending ? (
        "Loading...."
      ) : error ? (
        "Error Fetching"
      ) : (
        <button
          className="flex items-center gap-2 py-2 text-sm"
          onClick={handleSaveLater}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="20px"
            height="20px"
          >
            <path
              d="M12 4C10.3 4 9 5.3 9 7v34l15-9 15 9V7c0-1.7-1.3-3-3-3H12z"
              stroke="black"
              strokeWidth="2"
              fill={isSaved ? "black" : "none"}
            />
          </svg>
          <span>{isSaved ? "Unsave Post" : "Save Later"}</span>
          {saveLaterMutation.isPending && (
            <span className="text-xs">(in progress..)</span>
          )}
        </button>
      )}
    </>
  );
};

export default SaveLater;
