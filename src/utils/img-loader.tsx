import { FC, useEffect, useState } from "react";
import fallbackImg from "../images/profilePic.avif";

type ImageLoaderProps = {
  imgSrc: string | null | undefined;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy" | undefined;
};

export const ImageLoader: FC<ImageLoaderProps> = ({
  imgSrc,
  alt = "Profile picture",
  className = "",
  loading = "lazy",
}) => {
  // We use state to track if there was an error, which simplifies the rendering logic.
  const [hasError, setHasError] = useState(false);

  // We can determine the source URL directly.
  const imageUrl = hasError || !imgSrc ? fallbackImg : imgSrc;

  // The onError handler resets the image to the fallback image.
  const handleError = () => setHasError(true);

  // When the imgSrc prop changes, we need to reset the error state.
  // This is crucial, as a new imgSrc might be valid.
  // We use useEffect to handle this side effect.
  useEffect(() => {
    setHasError(false);
  }, [imgSrc]);

  return (
    <img src={imageUrl} onError={handleError} alt={alt} loading={loading} className={className} draggable="false" />
  );
};
