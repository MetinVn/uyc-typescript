import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Music } from "../../types/types-converted-music";
import { formatDuration } from "../../utils/format-music-duration";
import { formatSize } from "../../utils/format-music-size";
import { useHandleOutsideClicks } from "../../hooks/hook-outside-clicks";
import ImageLoader from "../../utils/img-loader";

interface IMusicCard {
  music: Music;
  onRate: (rating: number, music: Music) => void;
  onToggleFavorite: (music: Music) => void;
  onRemove: (music: Music) => void;
}

export const MusicCard = ({ music, onRate, onToggleFavorite, onRemove }: IMusicCard) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  useHandleOutsideClicks({
    isActive: isMenuOpen,
    ref: cardRef,
    stateChanger: () => setIsMenuOpen(false),
  });

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={`${
        music.starred
          ? "border-[var(--yellow-400)] bg-[var(--gray-700)] lg:bg-transparent hover:bg-[var(--yellow-400)]/10 hover:shadow-lg"
          : "border-transparent bg-[var(--gray-900)]/10 lg:bg-transparent hover:bg-[var(--gray-900)]/10 hover:shadow-inner"
      } border rounded-xl p-1 sm:p-4 flex flex-col justify-between transition`}
    >
      <div className="relative w-full h-45 sm:h-50 rounded-lg overflow-hidden">
        <ImageLoader className="w-full h-full object-cover object-center" alt={music.title} imgSrc={music.thumbnail} />
        <p className="absolute bottom-1 right-1 bg-[var(--gray-900)]/60 text-[var(--gray-100)] text-[10px] sm:text-xs px-2 py-0.5 rounded">
          {formatDuration(music.duration)}
        </p>
      </div>

      <div className="flex items-center mt-1">
        <div className="flex-1">
          <h2 className="text-[10px] sm:text-lg font-medium break-words line-clamp-2 text-[var(--gray-100)]">
            {music.title}
          </h2>
          <div className="flex items-center gap-1">
            <p className="text-[10px] sm:text-sm text-[var(--gray-400)] mt-1">Size: {formatSize(music.fileSize)}</p>
            <p className="text-[10px] sm:text-sm text-[var(--gray-400)] mt-1">
              Starred: {music.starred ? "Yes" : "No"}
            </p>
          </div>

          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => onRate(n, music)}
                className="p-1 cursor-pointer rounded hover:fill-[var(--yellow-400)] text-[10px] sm:text-xs transition"
                title={`Rate ${n} star${n > 1 ? "s" : ""}`}
              >
                {n <= music.rating ? (
                  <FaStar className="text-[var(--yellow-400)]" />
                ) : (
                  <FaRegStar className="text-[var(--gray-400)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div ref={cardRef} className="flex relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="active:bg-[var(--gray-900)]/20 hover:bg-[var(--gray-900)]/30 cursor-pointer rounded-full p-2"
          >
            <BsThreeDotsVertical size={18} />
          </button>

          <div
            className={` absolute overflow-hidden right-3 -top-[70px] w-32 min-w-[140px] z-50 bg-[var(--gray-800)] rounded-md shadow-lg flex flex-col text-xs text-left text-[var(--gray-100)] transform duration-200 ease-in-out ${
              isMenuOpen ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-80 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                onToggleFavorite(music);
                setIsMenuOpen(false);
              }}
              className="hover:bg-[var(--gray-700)] text-left cursor-pointer p-2 transition"
            >
              {music.starred ? "Remove from favorites" : "Add to favorites"}
            </button>

            <button
              type="button"
              onClick={() => {
                onRemove(music);
                setIsMenuOpen(false);
              }}
              className="hover:bg-[var(--red-500)]/30 text-left cursor-pointer p-2 text-[var(--red-200)] transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
};
