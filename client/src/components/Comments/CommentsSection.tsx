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
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-gray-500 underline text-xl">Post Your Thoughts</h1>

      <form onSubmit={handleFormData} noValidate={false}>
        <div className="flex flex-col gap-2 md:flex-row md:gap-8 md:items-center">
          <textarea
            name="comment"
            rows={2}
            required
            aria-label="Write a comment"
            placeholder="write something..."
            className="w-full py-2 px-4 focus:outline-none placeholder:italic rounded-xl border border-gray-200 mb-2 md:mb-0 transition-colors bg-white text-gray-800"
          />
          <button
            type="submit"
            disabled={addCommentMutation.isPending}
            className={`bg-blue-800 rounded text-white px-6 py-3 font-medium cursor-pointer ${
              addCommentMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            Send
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
