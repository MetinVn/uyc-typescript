import { useMusicList, uycmusic } from "../stores/user/music-list";
import { notify } from "../stores/shared/notification";
import { Music } from "../types/types-converted-music";
import { useState } from "react";
import { CustomLink } from "../components/reused-ui/reused-router-link";
import { ROUTES } from "../routes/routes";
import { motion, AnimatePresence } from "framer-motion";
import { MusicCard } from "../components/reused-ui/reused-music-card";

export default function MusicPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "duration" | "size" | "favorites" | "recent" | null>(null);
  const music = useMusicList((state) => state.music);

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

  const handleSort = (criteria: typeof sortBy) => setSortBy(criteria);

  let filteredMusic = music.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortBy) {
    filteredMusic = [...filteredMusic].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "duration":
          return b.duration - a.duration;
        case "size":
          return b.fileSize - a.fileSize;
        case "favorites":
          return Number(b.starred) - Number(a.starred);
        case "recent":
          return b.addedAt - a.addedAt;
        default:
          return 0;
      }
    });
  }

  return (
    <div className="min-h-screen h-auto bg-[var(--account-page-bg)] text-white p-2 sm:p-6 sm:pb-20 overflow-hidden">
      <div className="mb-3">
        <CustomLink path={ROUTES.HOME} title="Back" />
      </div>

      {/* Search + Sort Controls: always visible */}
      <div className="flex flex-col justify-center gap-4 items-center pt-3 sm:pt-0 w-full">
        <input
          type="text"
          id="searchMusic"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search music"
          className="text-xs text-shadow-2xs text-white placeholder:text-amber-100 sm:text-base bg-[#494949] focus:drop-shadow-md w-full outline-none pl-5 py-3 px-2 sm:px-4 rounded-full transition"
        />
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => handleSort("rating")}
            className={`text-sm bg-[#494949] px-3 py-1 rounded-md cursor-pointer ${
              sortBy === "rating" ? "ring-2 ring-amber-300" : ""
            }`}
          >
            Highest Rated First
          </button>
          <button
            onClick={() => handleSort("duration")}
            className={`text-sm bg-[#494949] px-3 py-1 rounded-md cursor-pointer ${
              sortBy === "duration" ? "ring-2 ring-amber-300" : ""
            }`}
          >
            Longest Duration First
          </button>
          <button
            onClick={() => handleSort("size")}
            className={`text-sm bg-[#494949] px-3 py-1 rounded-md cursor-pointer ${
              sortBy === "size" ? "ring-2 ring-amber-300" : ""
            }`}
          >
            Largest Files First
          </button>
          <button
            onClick={() => handleSort("favorites")}
            className={`text-sm bg-[#494949] px-3 py-1 rounded-md cursor-pointer ${
              sortBy === "favorites" ? "ring-2 ring-amber-300" : ""
            }`}
          >
            Show Favorites First
          </button>
          <button
            onClick={() => handleSort("recent")}
            className={`text-sm bg-[#494949] px-3 py-1 rounded-md cursor-pointer ${
              sortBy === "recent" ? "ring-2 ring-amber-300" : ""
            }`}
          >
            Newest Songs First
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-xs sm:text-2xl font-semibold my-4">Your Music</h1>
        <h1 className="text-xs sm:text-2xl font-semibold my-4">View All</h1>
      </div>

      {filteredMusic.length === 0 ? (
        <p className="text-gray-400">No music found.</p>
      ) : (
        // <div className="mt-5 p-3 overflow-x-scroll overflow-y-hidden">
        //   {filteredMusic.map(()=>(
        //     <div>

        //     </div>
        //   ))}
        // </div>
        <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-black/20 rounded-md overflow-y-scroll w-full max-h-[300px] p-2 sm:p-5">
          <AnimatePresence mode="sync">
            {filteredMusic.map((music) => (
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
    </div>
  );
}
