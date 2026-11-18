import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import Comment from "./Comment";
import { TComment } from "@/types/types";
import { useUseQueryHook, useUseMutationHook } from "@/hooks";

type TUseQueryComments = Array<TComment>;

const CommentsSection = ({ postId }: { postId: string }) => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { isPending, error, data } = useUseQueryHook<TUseQueryComments>({
    queryKey: ["comments", postId],
    url: `comments/${postId}`,
  });

  const addCommentMutation = useUseMutationHook<{ comment: string }>({
    url: `comments/${postId}`,
    method: "post",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      },
    },
  });

  // form handling with native validation
  const handleFormData = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!user) {
      toast.error("Signin to leave a comment");
      return;
    }

    if (!form.checkValidity()) {
      return;
    }

    const formData = new FormData(form);
    const comment = (formData.get("comment") as string)?.trim() || "";

    if (!comment) return;

    addCommentMutation.mutate(
      { comment },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Discussion & Thoughts
        </h2>
        {data && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full">
            {data.length} {data.length === 1 ? "comment" : "comments"}
          </span>
        )}
      </div>

      <form onSubmit={handleFormData} noValidate={false}>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <textarea
            name="comment"
            rows={2}
            required
            aria-label="Write a comment"
            placeholder="Share your perspective or ask a question..."
            className="w-full py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 rounded-2xl border border-gray-200 transition-all bg-white text-gray-800 text-sm shadow-sm"
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending}
            className={`bg-blue-800 hover:bg-blue-900 rounded-2xl text-white px-6 py-3 font-semibold text-sm cursor-pointer transition-colors shadow-sm shrink-0 ${
              addCommentMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            {addCommentMutation.isPending ? "Sending..." : "Post Comment"}
          </button>
        </div>
      </form>

      {/* comments */}
      {isPending ? (
        <p>Loading....</p>
      ) : error ? (
        <p>Error Loading Comments</p>
      ) : (
        <>
          {addCommentMutation.isPending && (
            <Comment
              data={{
                comment: `${addCommentMutation.variables.comment} (sending...)`,
                createdAt: Date.now().toString(),
                user: {
                  img: user?.imageUrl || "",
                  username: user?.username || "",
                },
              }}
            />
          )}
          {data?.map((comment) => (
            <Comment key={comment._id} data={comment} postId={postId} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentsSection;
