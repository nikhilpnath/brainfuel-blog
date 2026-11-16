import { useQueryClient } from "@tanstack/react-query";
import { useDebounceCallback, useUseMutationHook } from "@/hooks";

type TProps = {
  postId: string;
  slug: string;
  isFeatured?: boolean;
};

const FeaturePost = ({ postId, slug, isFeatured = false }: TProps) => {
  const queryClient = useQueryClient();

  const featurePostMutation = useUseMutationHook<{ postId: string }>({
    url: "posts/feature",
    method: "patch",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["post", slug] });
        queryClient.invalidateQueries({ queryKey: ["featuredPost"] });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      },
    },
  });

  const handleFeature = useDebounceCallback(() => {
    featurePostMutation.mutate({ postId });
  }, 500);

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
            fill={isFeatured ? "black" : "none"}
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
