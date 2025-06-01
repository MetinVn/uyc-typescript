import { AnimatePresence, motion } from "framer-motion";
import { Music } from "../../types/types-converted-music";
import { MusicCard } from "./reused-music-card";
import { uycmusic } from "../../stores/user/music-list";
import { notify } from "../../stores/shared/notification";

interface IMusicCardWrapper {
  musicList: Music[];
  sectionTitle: string;
  sectionLinkTitle: string;
}

export const MusicCardWrapper = ({ musicList, sectionTitle, sectionLinkTitle }: IMusicCardWrapper) => {
  const handleRemoveSong = (song: Music) => {
    uycmusic.remove(song.id);
    notify.success(`${song.title} removed`, 1500);
  };

  const handleToggleFavorite = (song: Music) => {
    const isFavorite = song.starred;
    uycmusic.favor(song.id);
    if (isFavorite) {
      notify.info(`${song.title} removed from favorites`, 2500);
    } else {
      notify.success(`${song.title} added to favorites`, 2500);
    }
  };

  const handleRate = (rating: number, music: Music) => {
    const isRatededSame = music.rating === rating;
    uycmusic.rate(rating, music.id);
    if (isRatededSame) {
      notify.info("Rating removed", 2500);
      return;
    }
    notify.success(`Rated ${music.title} with ${rating} star${rating > 1 ? "s" : ""}`, 2500);
  };

  const sliced = musicList.slice(0, 6);

  return (
    <>
      <div className="flex justify-between items-center text-xs sm:text-lg my-4 font-semibold">
        <h1>{sectionTitle}</h1>
        <h1>{sectionLinkTitle}</h1>
      </div>

      {musicList.length === 0 ? (
        <p className="text-gray-400">No music found.</p>
      ) : (
        <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20 shadow-inner rounded-md border-2 border-[#383838] overflow-y-scroll overflow-x-hidden w-full max-h-[370px] p-2 sm:p-3">
          <AnimatePresence mode="sync">
            {sliced.map((music) => (
              <MusicCard
                key={music.id}
                music={music}
                onRate={handleRate}
                onToggleFavorite={handleToggleFavorite}
                onRemove={handleRemoveSong}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </>
  );
};
