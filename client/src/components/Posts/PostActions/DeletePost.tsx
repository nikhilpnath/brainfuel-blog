import { useRef } from "react";
import { useNavigate } from "react-router";
import { useUseMutationHook } from "@/hooks";

const DeletePost = ({ postId }: { postId: string }) => {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const deletePostMutation = useUseMutationHook<void>({
    url: `posts/delete/${postId}`,
    method: "delete",
    options: {
      onSuccess: () => navigate(-1),
    },
  });

  const openConfirmation = () => {
    dialogRef.current?.showModal();
  };

  const closeConfirmation = () => {
    dialogRef.current?.close();
  };

  const handleConfirmDelete = () => {
    closeConfirmation();
    deletePostMutation.mutate();
  };

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2 py-2 text-sm cursor-pointer"
        onClick={openConfirmation}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 50 50"
          fill="red"
          width="20px"
          height="20px"
          aria-hidden="true"
        >
          <path d="M 21 2 C 19.354545 2 18 3.3545455 18 5 L 18 7 L 10.154297 7 A 1.0001 1.0001 0 0 0 9.984375 6.9863281 A 1.0001 1.0001 0 0 0 9.8398438 7 L 8 7 A 1.0001 1.0001 0 1 0 8 9 L 9 9 L 9 45 C 9 46.645455 10.354545 48 12 48 L 38 48 C 39.645455 48 41 46.645455 41 45 L 41 9 L 42 9 A 1.0001 1.0001 0 1 0 42 7 L 40.167969 7 A 1.0001 1.0001 0 0 0 39.841797 7 L 32 7 L 32 5 C 32 3.3545455 30.645455 2 29 2 L 21 2 z M 21 4 L 29 4 C 29.554545 4 30 4.4454545 30 5 L 30 7 L 20 7 L 20 5 C 20 4.4454545 20.445455 4 21 4 z M 11 9 L 18.832031 9 A 1.0001 1.0001 0 0 0 19.158203 9 L 30.832031 9 A 1.0001 1.0001 0 0 0 31.158203 9 L 39 9 L 39 45 C 39 45.554545 38.554545 46 38 46 L 12 46 C 11.445455 46 11 45.554545 11 45 L 11 9 z M 18.984375 13.986328 A 1.0001 1.0001 0 0 0 18 15 L 18 40 A 1.0001 1.0001 0 1 0 20 40 L 20 15 A 1.0001 1.0001 0 0 0 18.984375 13.986328 z M 24.984375 13.986328 A 1.0001 1.0001 0 0 0 24 15 L 24 40 A 1.0001 1.0001 0 1 0 26 40 L 26 15 A 1.0001 1.0001 0 0 0 24.984375 13.986328 z M 30.984375 13.986328 A 1.0001 1.0001 0 0 0 30 15 L 30 40 A 1.0001 1.0001 0 1 0 32 40 L 32 15 A 1.0001 1.0001 0 0 0 30.984375 13.986328 z" />
        </svg>
        <span className="text-red-600">Delete Post</span>
        {deletePostMutation.isPending && (
          <span className="text-xs">(in progress..)</span>
        )}
      </button>

      {/* Native Modal Dialog */}
      <dialog
        ref={dialogRef}
        aria-labelledby="delete-dialog-title"
        className="rounded-2xl p-6 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-xs max-w-sm w-full mx-auto my-auto"
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            closeConfirmation();
          }
        }}
      >
        <h2 id="delete-dialog-title" className="text-lg font-bold text-gray-900 mb-2">
          Delete Post?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeConfirmation}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
          >
            Delete
          </button>
        </div>
      </dialog>
    </>
  );
};

export default DeletePost;
