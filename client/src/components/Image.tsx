import { IKImage } from "imagekitio-react";

type TImageProps  = {
  src: string;
  className?: string;
  alt: string;
  w?: string;
  h?: string;
}

const Image = ({ src, className, alt, w, h }: TImageProps) => {
  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      path={src ?? "featured1.jpeg"}
      alt={alt}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      className={className}
      width={w}
      height={h}
      transformation={[{ width: w, height: h }]}
    />
  );
};

export default Image;
