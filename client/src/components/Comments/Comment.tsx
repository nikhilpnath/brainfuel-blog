import { memo } from "react";
import { format } from "timeago.js";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";

import { TComment } from "@/types/types";
import { useUseMutationHook } from "@/hooks";

type TProp = {
  data: TComment;
  postId?: string;
};

const Comment = ({ data, postId }: TProp) => {

  const { user } = useUser();

  const queryClient = useQueryClient();

  const role = user?.publicMetadata.role;

  const deleteCommentMutation = useUseMutationHook<void>({
    url: `comments/${data._id}`,
    method: "delete",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      },
    },
  });

  const handleCommentDelete = () => deleteCommentMutation.mutate();

  return (
    <div className="p-4 bg-slate-50 rounded-xl">
      {/* title */}
      <div className="flex gap-4 items-center mb-4">
        <img
          src={data.user.img}
          alt="User Image"
          className="w-10 h-10 rounded-full object-cover"
          width="40"
        />
        <span className="font-medium">{data.user.username}</span>
        <span className=" text-xs text-gray-500">{format(data.createdAt)}</span>
        {user && (data.user.username === user.username || role === "admin") && (
          <button
            onClick={handleCommentDelete}
            className={`text-xs text-red-700 ${
              deleteCommentMutation.isPending ? "text-red-400" : ""
            }`}
          >
            Delete{" "}
            {deleteCommentMutation.isPending && <span>(in progress..)</span>}
          </button>
        )}
      </div>

      {/* content */}
      <div className="pr-4">
        <p className="text-justify">{data.comment}</p>
      </div>
    </div>
  );
};

export default memo(Comment);
