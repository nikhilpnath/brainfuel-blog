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
      <h1 className="mb-2 text-sm font-medium underline">Actions</h1>
      <SaveLater postId={post._id} />

      {/* feature post - admin */}
      {isAdmin && (
        <FeaturePost
          postId={post._id}
          slug={post.slug}
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
