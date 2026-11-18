import { useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { IKContext, IKUpload } from "imagekitio-react";

import { MediaUploadSucess } from "@/types/types";

type TProps = {
  to?: string;
  type: string;
  getMediaIds?: (id: string) => void;
  getMedia: (
    type: "cover" | "image" | "video",
    data: { filePath: string; name: string } | string
  ) => void;
  children: React.ReactNode;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

const MEDIA_CONFIG = {
  image: {
    accept: "image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif",
    types: ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"],
    exts: [".png", ".jpg", ".jpeg", ".webp", ".gif"],
    maxSize: 10 * 1024 * 1024,
    sizeLabel: "10MB",
    typeLabel: "PNG, JPG, WEBP, or GIF image",
  },
  video: {
    accept: "video/mp4,video/webm,video/ogg,.mp4,.webm,.ogg",
    types: ["video/mp4", "video/webm", "video/ogg"],
    exts: [".mp4", ".webm", ".ogg"],
    maxSize: 50 * 1024 * 1024,
    sizeLabel: "50MB",
    typeLabel: "MP4, WEBM, or OGG video",
  },
} as const;

const Upload = ({
  children,
  type,
  to,
  setProgress,
  getMediaIds,
  getMedia,
}: TProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();

  const config = type === "video" ? MEDIA_CONFIG.video : MEDIA_CONFIG.image;

  // File validator for ImageKit
  const validateFile = (file: File) => {
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const isValidType =
      (config.types as readonly string[]).includes(file.type) ||
      (config.exts as readonly string[]).includes(ext);

    if (!isValidType) {
      toast.error(`Invalid file format. Please upload a ${config.typeLabel}.`);
      if (ref.current) ref.current.value = "";
      return false;
    }

    if (file.size > config.maxSize) {
      toast.error(`File is too large. Maximum size is ${config.sizeLabel}.`);
      if (ref.current) ref.current.value = "";
      return false;
    }

    return true;
  };

  // imagekit authenticator
  const authenticator = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/posts/upload-auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token: ikToken } = data;
      return { signature, expire, token: ikToken };
    } catch (err) {
      if (err instanceof Error) {
        err.message = `Authentication request failed: ${err.message}`;
        throw err;
      }
      throw new Error("Authentication request failed: Unknown error");
    }
  };

  const onError = () => {
    toast.error("Failed to Upload!");
    setProgress(0);
    if (ref.current) ref.current.value = "";
  };

  const onSuccess = (res: MediaUploadSucess) => {
    if (getMediaIds) {
      getMediaIds(res.fileId);
    }

    if (to === "cover") {
      getMedia("cover", { filePath: res.filePath, name: res.name });
    } else {
      getMedia(type === "image" ? "image" : "video", res.url);
    }

    toast.success("Successfully Uploaded!");
    setProgress(0);
    if (ref.current) ref.current.value = "";
  };

  const onUploadProgress = (progress: Record<string, number>) => {
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
        validateFile={validateFile}
        onError={onError}
        onSuccess={onSuccess}
        className="hidden"
        ref={ref}
        accept={config.accept}
      />
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload media file"
        className="cursor-pointer inline-block"
        onClick={(e) => {
          e.preventDefault();
          ref.current?.click();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            ref.current?.click();
          }
        }}
      >
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
