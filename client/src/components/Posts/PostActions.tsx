import { useUser } from "@clerk/clerk-react";

import { TPosts, TUser } from "@/types/types";

import SaveLater from "./PostActions/SaveLater";
import DeletePost from "./PostActions/DeletePost";
import FeaturePost from "./PostActions/FeaturePost";

type TProps = Pick<TPosts, "slug" | "isFeatured" | "_id"> & {
  username: TUser["username"];
};

const PostActions = ({ post }: { post: TProps }) => {
  
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin" || false;

  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Post Actions
      </h2>
      <SaveLater postId={post._id} />

      {/* feature post - admin */}
      {isAdmin && (
        <FeaturePost
          postId={post._id}
          slug={post.slug}
          isFeatured={Boolean(post.isFeatured)}
        />
      )}

      {/* delete post - admin */}
      {user && (post.username === user?.username || isAdmin) && (
        <DeletePost postId={post._id} />
      )}
    </div>
  );
};

export default PostActions;
