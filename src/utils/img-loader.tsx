import { FC, useState, useEffect, SyntheticEvent } from "react";
import fallbackImg from "../images/profilePic.avif";

type Props = {
  imgSrc: string | null | undefined;
  alt?: string;
  loading?: "lazy" | "eager";
  className?: string;
  onClick?: () => void;
};

const ImageLoader: FC<Props> = ({ imgSrc, alt = "", loading = "lazy", className = "", onClick }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(imgSrc || fallbackImg);

  useEffect(() => {
    setCurrentSrc(imgSrc || fallbackImg);
  }, [imgSrc]);

  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== fallbackImg) {
      setCurrentSrc(fallbackImg);
    }
  };

  const combinedClassName = `
    ${className}
    ${onClick ? "cursor-pointer" : ""}
  `.trim();

  return (
    <img
      src={currentSrc}
      onError={handleError}
      alt={alt}
      loading={loading}
      className={combinedClassName}
      onClick={onClick}
      draggable="false"
    />
  );
};

export default ImageLoader;
