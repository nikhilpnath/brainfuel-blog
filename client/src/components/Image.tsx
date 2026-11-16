import { IKImage } from "imagekitio-react";

type TImageProps = {
  src: string;
  className?: string;
  alt: string;
  w?: string;
  h?: string;
  priority?: "high" | "low";
};

const Image = ({ src, className, alt, w, h, priority }: TImageProps) => {
  const isHighPriority = priority === "high";

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      path={src ?? "featured1.jpeg"}
      alt={alt}
      {...(isHighPriority
        ? ({ loading: "eager", fetchPriority: "high" } as Record<string, unknown>)
        : { loading: "lazy" })}
      lqip={{ active: true, quality: 20 }}
      className={className}
      width={w}
      height={h}
      transformation={[{ width: w, height: h }]}
    />
  );
};

export default Image;
