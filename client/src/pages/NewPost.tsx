import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useUser } from "@clerk/clerk-react";

import { useUseMutationHook } from "@/hooks";
import { CategoriesColl } from "@/utils/data";
import { TMedia, TPosts } from "@/types/types";
import { ErrorCmp, Upload } from "@/components";

type TFormData = Omit<
  TPosts,
  "_id" | "user" | "slug" | "createdAt" | "isFeatured"
>;

type TInputErrors = Partial<Omit<TFormData, "category">>;

const NewPost = () => {
  const [content, setContent] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  const [contentMedia, setContentMedia] = useState<TMedia>({
    coverImg: { filePath: "", name: "" },
    img: "",
    video: "",
  });
  const [inputErrors, setInputErrors] = useState<TInputErrors>({});
  const [mediaIds, setMediaIds] = useState<string[]>([]);

  const { isLoaded, isSignedIn } = useUser();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //adding img and video to the textarea - reactquill
  useEffect(
    function addingMediaToRichText() {
      if (contentMedia.img) {
        setContent((prev) => prev + `<image src="${contentMedia.img}"/>`);
      } else if (contentMedia.video) {
        setContent(
          (prev) =>
            prev +
            `<p><iframe class="ql-video" src="${contentMedia.video}"/></p>`
        );
      }
    },
    [contentMedia.img, contentMedia.video]
  );

  //after uploading content when user reloads page
  // show a modal 
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (contentMedia.coverImg.filePath) {
        e.preventDefault();
        return (e.returnValue = "");
        // without this(returnValue) it wont trigger browser modal
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [contentMedia.coverImg.filePath]);


  const newPostMutation = useUseMutationHook<TFormData>({
    url: "posts/create",
    method: "post",
    options: {
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        queryClient.invalidateQueries({ queryKey: ["featuredPost"] });
        navigate(`/posts/${res.slug}`);
      },
    },
  });

  if (!isLoaded) return <div>Loading...</div>;

  if (isLoaded && !isSignedIn) {
    return (
      <ErrorCmp
        icon="✍️"
        title="Share Your Story on BrainFuel"
        text="Your voice matters! Sign in to write in-depth tutorials, share architecture insights, and publish your ideas."
        btnText="Sign In to Continue →"
        btnAction={() => navigate("/login")}
        secondaryBtnText="Explore Posts"
        secondaryBtnAction={() => navigate("/posts")}
      />
    );
  }

  //get uploaded media's id - imagekit
  const getMediasIdOnSuccess = (id: string) => {
    setMediaIds((prev) => [...prev, id]);
  };

  //get media - image & video
  const getMedia = (
    type: "cover" | "image" | "video",
    data: { filePath: string; name: string } | string
  ) => {
    if (type === "cover") {
      clearError("img");
    }
    setContentMedia((prev) => {
      if (type === "cover") {
        return {
          ...prev,
          coverImg: data as { filePath: string; name: string },
        };
      } else if (type === "image") {
        return {
          ...prev,
          img: data as string,
          video: "",
        };
      } else if (type === "video") {
        return {
          ...prev,
          video: data as string,
          img: "",
        };
      } else {
        return prev;
      }
    });
  };

  const clearError = (field: keyof TInputErrors) => {
    if (inputErrors[field]) {
      setInputErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  // form handling
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data: TFormData = {
      img: contentMedia.coverImg.filePath || "",
      title: formData.get("title")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      desc: formData.get("desc")?.toString() || "",
      content: content || "",
      media: mediaIds,
    };

    //error object
    const newErrors: TInputErrors = {};

    if (!data.img) {
      newErrors.img = "Cover Image is required";
    }

    const cleanTitle = data.title.trim();
    if (!cleanTitle) {
      newErrors.title = "Title is required";
    } else if (cleanTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (cleanTitle.length > 150) {
      newErrors.title = "Title cannot exceed 150 characters";
    }

    const cleanDesc = data.desc.trim();
    if (!cleanDesc) {
      newErrors.desc = "Description is required";
    } else if (cleanDesc.length < 5) {
      newErrors.desc = "Description must be at least 5 characters";
    } else if (cleanDesc.length > 500) {
      newErrors.desc = "Description cannot exceed 500 characters";
    }

    const plainContent = content.replace(/<[^>]*>/g, "").trim();
    const hasMedia =
      content.includes("<image") ||
      content.includes("<img") ||
      content.includes("<iframe");

    if (!plainContent && !hasMedia) {
      newErrors.content = "Content is required";
    } else if (plainContent.length < 10 && !hasMedia) {
      newErrors.content = "Content must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setInputErrors(newErrors);
      return;
    }

    // Clearing previous errors on successful submission
    setInputErrors({});

    newPostMutation.mutate(data);
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] md:min-h-[calc(100dvh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a new post</h1>
      <form
        className="flex flex-col gap-6 flex-1 mb-6"
        onSubmit={handleSubmit}
        noValidate
      >
        {0 < progress && progress <= 100 ? (
          <span>Uploading...</span>
        ) : contentMedia.coverImg.name ? (
          <p>{contentMedia.coverImg.name} ✅</p>
        ) : (
          <>
            <Upload
              type="image"
              setProgress={setProgress}
              to="cover"
              getMedia={getMedia}
              getMediaIds={getMediasIdOnSuccess}
            >
              <button
                type="button"
                className="bg-white text-gray-500 p-2 shadow-md rounded-xl text-sm w-max cursor-pointer"
              >
                Add Cover Image
              </button>
              {inputErrors.img && (
                <p className="mt-2 text-red-600">{inputErrors.img} *</p>
              )}
            </Upload>
          </>
        )}
        <div>
          <input
            type="text"
            name="title"
            aria-label="Post title"
            placeholder="My Awesome Story"
            onChange={(e) => {
              if (e.target.value.trim()) clearError("title");
            }}
            className="text-[28px] sm:text-4xl font-semibold bg-transparent outline-none text-gray-800 placeholder:text-gray-400 placeholder:text-[28px] placeholder:sm:text-4xl w-full"
          />
          {inputErrors.title && (
            <p className="mt-1 text-red-600">{inputErrors.title} *</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-md text-gray-700">
            Choose A Category:
          </label>
          <select
            name="category"
            id="category"
            className="bg-white text-gray-800 p-2 shadow-md rounded-xl focus:outline-none cursor-pointer"
          >
            {CategoriesColl.map((cat, index) => (
              <option value={cat} key={cat + index} className="text-gray-800 bg-white">
                {cat
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            name="desc"
            aria-label="Post description"
            placeholder="Description"
            onChange={(e) => {
              if (e.target.value.trim()) clearError("desc");
            }}
            className="w-full bg-white text-gray-800 placeholder:text-gray-400 p-4 shadow-md rounded-xl focus:outline-none"
          />
          {inputErrors.desc && (
            <p className="mt-1 text-red-600">{inputErrors.desc} *</p>
          )}
        </div>

        <div>
          <div className="flex flex-1">
            <div className="flex flex-col gap-2 mr-2">
              <Upload
                type="image"
                setProgress={setProgress}
                getMediaIds={getMediasIdOnSuccess}
                getMedia={getMedia}
              >
                🌆
              </Upload>
              <Upload
                type="video"
                setProgress={setProgress}
                getMedia={getMedia}
                getMediaIds={getMediasIdOnSuccess}
              >
                ▶️
              </Upload>
            </div>
            <ReactQuill
              theme="snow"
              className="flex-1 bg-white shadow-md rounded-xl w-0 "
              placeholder="Content"
              value={content}
              onChange={(value) => {
                setContent(value);
                if (value && value !== "<p><br></p>") clearError("content");
              }}
              readOnly={0 < progress && progress <= 100}
            />
          </div>
            {inputErrors.content && (
              <p className="mt-3 text-red-600">{inputErrors.content} *</p>
            )}
        </div>
        <button
          disabled={
            newPostMutation.isPending || (0 < progress && progress <= 100)
          }
          className=" bg-blue-800 text-white rounded-xl font-medium w-36 p-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {newPostMutation.isPending ? "Adding.." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default NewPost;
