import { useMusicList } from "../stores/user/music-list";
import { useState } from "react";
import { CustomLink } from "../components/reused-ui/reused-router-link";
import { ROUTES } from "../routes/routes";
import { MusicCardWrapper } from "../components/reused-ui/reused-music-card-wrapper";

export default function MusicPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const music = useMusicList((state) => state.music);

  let filteredMusic = music.filter((song) => song.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen h-auto bg-[var(--gray-900)] text-[var(--gray-100)] p-2 pt-5 sm:px-6 sm:py-10 overflow-hidden">
      <div className="mb-3">
        <CustomLink path={ROUTES.HOME} title="Back" />
      </div>

      <div className="flex flex-col justify-center gap-4 items-center pt-3 sm:pt-0 w-full">
        <input
          type="text"
          id="searchMusic"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search music"
          className="text-xs text-[var(--gray-100)] placeholder:text-[var(--yellow-400)] sm:text-base bg-[var(--gray-700)] focus:drop-shadow-md w-full outline-none pl-5 py-3 px-2 sm:px-4 rounded-full transition"
        />
      </div>

      <MusicCardWrapper sectionTitle="Your Music" musicList={filteredMusic} />

      <div>
        Another section can be added here, for example, to display favorite music or recently played tracks and videos
        also.
      </div>
    </div>
  );
}
