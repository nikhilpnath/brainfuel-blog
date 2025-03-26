import { useQueryClient } from "@tanstack/react-query";

import { TPosts as TUSeQueryData } from "../../../types/types";
import { debounceMutation } from "../../../utils/debounceMutation";
import { useUseMutationHook, useUseQueryHook } from "../../../hooks";

const FeaturePost = ({ postId, slug }: { postId: string; slug: string }) => {
  const queryClient = useQueryClient();

  const { data } = useUseQueryHook<TUSeQueryData>({
    queryKey: ["featurepost", slug],
    url: `posts/${slug}`,
  });

  const featurePostMutation = useUseMutationHook<{ postId: string }>({
    url: "posts/feature",
    method: "patch",
    options: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["featurepost", slug] }),
    },
  });

  const handleFeature = debounceMutation(() =>
    featurePostMutation.mutate({ postId })
  );

  return (
    <>
      <button
        className="flex items-center gap-2 py-2 text-sm "
        onClick={handleFeature}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="20px"
          height="20px"
        >
          <path
            d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
            stroke="black"
            strokeWidth="2"
            fill={data?.isFeatured ? "black" : "none"}
          />
        </svg>
        <span>Feature</span>
        {featurePostMutation.isPending && (
          <span className="text-xs">(in progress..)</span>
        )}
      </button>
    </>
  );
};

export default FeaturePost;
