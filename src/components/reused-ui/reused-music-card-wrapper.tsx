import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music } from "../../types/types-converted-music";
import { MusicCard } from "./reused-music-card";
import { uycmusic } from "../../stores/user/music-list";
import { notify } from "../../stores/shared/notification";
import { SortSelect, SortOptions } from "./reused-sort-options";

interface IMusicCardWrapper {
  musicList: Music[];
  sectionTitle: string;
}

export const MusicCardWrapper = ({ musicList, sectionTitle }: IMusicCardWrapper) => {
  const [sortOption, setSortOption] = useState<SortOptions>("");

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

  const sortedMusicList = [...musicList].sort((a, b) => {
    if (sortOption === "rating") return b.rating - a.rating;
    if (sortOption === "duration") return b.duration - a.duration;
    if (sortOption === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <>
      <div className="flex justify-between items-center text-xs sm:text-lg my-4 font-semibold">
        <h1>{sectionTitle}</h1>
      </div>

      <div className="mb-2 flex justify-start items-center text-xs sm:text-lg font-semibold gap-4">
        <h1 className="">Sort by: </h1>
        <SortSelect selected={sortOption} onChange={setSortOption} />
      </div>

      {sortedMusicList.length === 0 ? (
        <p className="text-gray-400">No music found.</p>
      ) : (
        <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20 shadow-inner rounded-md border-2 border-[#383838] overflow-y-scroll overflow-x-hidden w-full max-h-[370px] p-2 sm:p-3">
          <AnimatePresence mode="sync">
            {sortedMusicList.map((music) => (
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
