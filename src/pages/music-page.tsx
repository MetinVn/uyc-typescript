import { useMusicList } from "../stores/user/music-list";
import { useState } from "react";
import { CustomLink } from "../components/reused-ui/reused-router-link";
import { ROUTES } from "../routes/routes";
import { MusicCardWrapper } from "../components/reused-ui/reused-music-card-wrapper";

export default function MusicPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "duration" | "size" | "favorites" | "recent" | null>(null);
  const music = useMusicList((state) => state.music);

  const handleSort = (criteria: typeof sortBy) => setSortBy(criteria);

  let filteredMusic = music.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortBy) {
    filteredMusic.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
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
    <div className="min-h-screen h-auto bg-[var(--account-page-bg)] text-white p-2 pt-5 sm:px-6 sm:py-10 overflow-hidden">
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
      <MusicCardWrapper sectionTitle="Your Music" sectionLinkTitle="View All" musicList={filteredMusic} />
    </div>
  );
}
