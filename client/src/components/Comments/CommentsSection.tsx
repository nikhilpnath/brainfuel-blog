import { useRef, useState } from "react";

import { toast } from "react-toastify";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import Comment from "./Comment";
import { TComment } from "../../types/types";
import {useUseQueryHook,useUseMutationHook} from "../../hooks";

type TUseQueryComments = Array<TComment>;

const CommentsSection = ({ postId }: { postId: string }) => {
  const [cmterror, setCmtError] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
        if (textAreaRef.current) textAreaRef.current.value = "";
      },
    },
  });

  // form handling
  const handleFormData = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    if (!user) {
      toast.error("Signin to leave a comment");
      return;
    }

    const comment: string = formData.get("comment")?.toString() || "";

    if (!comment) {
      setCmtError("Please enter a valid comment");
      return;
    }

    setCmtError("");
    addCommentMutation.mutate({ comment });
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-gray-500 underline text-xl">Post Your Thoughts</h1>

      <form onSubmit={handleFormData}>
        <div className="flex flex-col gap-2 md:flex-row md:gap-8 md:items-center">
          <textarea
            name="comment"
            rows={2}
            ref={textAreaRef}
            placeholder="write something..."
            className={`w-full py-2 px-4 focus:outline-none placeholder:italic rounded-xl ${
              cmterror ? "border-2 border-red-600" : "mb-2 md:mb-0"
            }`}
          />
          {cmterror && (
            <p className="text-red-600 text-sm md:hidden">{cmterror} *</p>
          )}
          <button
            disabled={addCommentMutation.isPending}
            className={`bg-blue-800 rounded text-white px-6 py-3 font-medium ${
              addCommentMutation.isPending
                ? "opacity-50 cursor-not-allowed"
                : ""
            } `}
          >
            Send
          </button>
        </div>
        {cmterror && (
          <p className="mt-2 text-red-600 hidden md:block">{cmterror} *</p>
        )}
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
