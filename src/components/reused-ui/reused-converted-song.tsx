import { Star, StarIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useMusicList } from "../../stores/user/music-list";
import { notify } from "../../stores/shared/notification";
import { useConvertedSong } from "../../stores/shared/converted-song";
import { downloadFile } from "../../utils/download-converted-songs";
import { formatDuration } from "../../utils/format-music-duration";
import { formatSize } from "../../utils/format-music-size";
import { useUserState } from "../../stores/user/user-state";

export const ConvertedSongUI = () => {
  const convertedSong = useConvertedSong((state) => state.song);
  const addToConverted = useConvertedSong((state) => state.addToConverted);

  const isEmailVerified = useUserState((state) => state.isEmailVerified);

  const music = useMusicList((state) => state.music);
  const rateMusic = useMusicList((state) => state.rateMusic);
  const makeFavorite = useMusicList((state) => state.makeFavorite);

  const displayItem = convertedSong || music[music.length - 1];

  if (!displayItem) {
    return null;
  }

  const handleRate = (star: number) => {
    const alreadyRated = displayItem.rating === star;
    rateMusic(star, displayItem.id);

    notify[alreadyRated ? "info" : "success"](
      alreadyRated
        ? "Rating removed"
        : `Rated ${displayItem.title} with ${star} star${star > 1 ? "s" : ""}`,
      2500,
    );

    addToConverted({ ...displayItem, rating: alreadyRated ? 0 : star });
  };

  const handleFavorite = () => {
    const isFav = displayItem.starred;
    makeFavorite(displayItem.id);

    notify[isFav ? "info" : "success"](
      ` ${
        isFav ? "Song removed from" : `${displayItem.title}` + " added to"
      } favorites`,
      1500,
    );

    addToConverted({ ...displayItem, starred: !isFav });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(displayItem.youtubeLink);
      notify.success(`Link copied to clipboard`, 2000);
    } catch (error) {
      notify.error("Failed to copy link to clipboard", 2000);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayItem.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeIn" }}
        className="w-full max-w-[570px] p-4 mx-auto mt-4 rounded-md text-sm text-[var(--gray-100)] flex flex-col sm:flex-row gap-4 border border-[var(--gray-700)] hover:bg-[var(--gray-800)] transition-colors"
      >
        {/* Content */}
        <div className="flex-1 flex flex-col gap-3">
          <button
            onClick={() => downloadFile(displayItem.link, displayItem.title)}
            className="font-medium cursor-pointer text-base text-left underline hover:no-underline break-words text-[var(--accent-500)]"
            title="Download this song"
          >
            {displayItem.title}
          </button>

          <ul className="flex items-center gap-3 text-xs flex-wrap w-fit">
            <li>
              <strong>Duration:</strong> {formatDuration(displayItem.duration)}
            </li>
            <li>
              <strong>Size:</strong> {formatSize(displayItem.fileSize)}
            </li>
            <li>
              <button
                onClick={handleCopyLink}
                className="hover:text-[var(--accent-500)] cursor-pointer transition"
                title="Copy YouTube link"
              >
                <strong>Copy Link</strong>
              </button>
            </li>
            <li className="flex items-center">
              <strong>Rating:</strong>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleRate(n)}
                  disabled={!isEmailVerified}
                  title={
                    isEmailVerified
                      ? `Rate ${n} star${n > 1 ? "s" : ""}`
                      : "Login to rate"
                  }
                  className={`p-1 rounded ${
                    isEmailVerified
                      ? "hover:text-[var(--yellow-400)] cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {n <= displayItem.rating ? (
                    <StarIcon className="text-[var(--yellow-400)]" />
                  ) : (
                    <Star className="text-[var(--gray-400)]" />
                  )}
                </button>
              ))}
            </li>
          </ul>
        </div>

        {/* Favorite Button */}
        <div className="flex sm:items-center items-center justify-end">
          <button
            onClick={handleFavorite}
            disabled={!isEmailVerified}
            title={
              !isEmailVerified
                ? "Login to favorite"
                : displayItem.starred
                  ? "Unfavorite this song"
                  : "Favorite this song"
            }
            className={`text-[var(--yellow-400)] hover:text-[var(--yellow-400)] transition p-2 rounded-full ${
              isEmailVerified
                ? "cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {displayItem.starred ? (
              <StarIcon strokeWidth={1} size={20} />
            ) : (
              <Star strokeWidth={1} size={20} />
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
