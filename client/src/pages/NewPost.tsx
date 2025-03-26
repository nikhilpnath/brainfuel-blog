import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import ReactQuill from "react-quill-new";
import { useUser } from "@clerk/clerk-react";

import { useUseMutationHook } from "../hooks";
import { CategoriesColl } from "../utils/data";
import { TMedia, TPosts } from "../types/types";
import { ErrorCmp, Upload } from "../components";

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
      onSuccess: (res) => navigate(`/posts/${res.slug}`),
    },
  });

  if (!isLoaded) return <div>Loading...</div>;

  if (isLoaded && !isSignedIn) {
    return (
      <ErrorCmp
        text="Your voice matters! Sign in to post."
        btnText="Sign In"
        btnAction={() => navigate("/login")}
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

  // form handling
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

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

    if (!data.img) newErrors.img = "Cover Image is required";
    if (!data.title) newErrors.title = "Title is required";
    if (!data.desc) newErrors.desc = "Description is required";
    if (!data.content) newErrors.content = "Content is required";

    if (Object.keys(newErrors).length > 0) {
      setInputErrors(newErrors);
      return;
    }

    // Clearing previous errors on successful submission
    setInputErrors({});

    newPostMutation.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-xl font-light">Create a new post</h1>
      <form className="flex flex-col gap-6 flex-1 mb-6" onSubmit={handleSubmit}>
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
              <button className="bg-white text-gray-500 p-2 shadow-md rounded-xl text-sm w-max">
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
            placeholder="My Awesome Story"
            className="text-[28px] sm:text-4xl font-semibold bg-transparent outline-none placeholder:text-[28px] placeholder:sm:text-4xl"
            autoFocus
          />
          {inputErrors.title && (
            <p className="mt-1 text-red-600">{inputErrors.title} *</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label htmlFor="category" className="text-md ">
            Choose A Category:
          </label>
          <select
            name="category"
            id="category"
            className="bg-white p-2 shadow-md rounded-xl focus:outline-none"
          >
            {CategoriesColl.map((cat, index) => (
              <option value={cat} key={cat + index}>
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
            placeholder="Description"
            className="w-full bg-white p-4 shadow-md rounded-xl focus:outline-none"
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
              onChange={setContent}
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
