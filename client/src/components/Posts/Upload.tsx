import { useRef } from "react";
import { toast } from "react-toastify";
import { IKContext, IKUpload } from "imagekitio-react";

import { MediaUploadSucess } from "../../types/types";

// imagekit - authenticator
const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/posts/upload-auth`
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (err) {
    if (err instanceof Error) {
      err.message = `Authentication request failed: ${err.message}`;
      throw err;
    }
    throw new Error("Authentication request failed: Unknown error");
  }
};

type TProps = {
  to?: string;
  type: string;
  getMediaIds: (id: string) => void;
  getMedia: (
    type: "cover" | "image" | "video",
    data: { filePath: string; name: string } | string
  ) => void;
  children: React.ReactNode;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

const Upload = ({
  children,
  type,
  to,
  setProgress,
  getMediaIds,
  getMedia,
}: TProps) => {
  const ref = useRef<HTMLInputElement>(null);

  //image/video upload
  const onError = () => {
    toast.error("Failed to Upload!");
  };

  const onSuccess = (res: MediaUploadSucess) => {
    getMediaIds(res.fileId);

    if (to === "cover") {
      const data = {
        filePath: res.filePath,
        name: res.name,
      };
      getMedia("cover", data);
    } else {
      const dataType = type === "image" ? "image" : "video";
      getMedia(dataType, res.url);
    }

    toast.success("Successfully Uploaded !");
    setProgress(0);
  };

  type TProgress = Record<string, number>;

  const onUploadProgress = (progress: TProgress) => {
    setProgress(Math.round((progress.loaded / progress.total) * 100));
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onError={onError}
        onSuccess={onSuccess}
        className=" hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          ref.current?.click();
        }}
      >
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
