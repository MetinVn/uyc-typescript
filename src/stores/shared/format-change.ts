import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AvailableFormats = "mp3" | "mp4";
interface IMusicFormat {
  format: AvailableFormats;
  setFormat: (format: AvailableFormats) => void;
  resetFormat: () => void;
}

export const useMusicFormat = create<IMusicFormat>()(
  persist(
    (set) => ({
      format: "mp3",
      setFormat: (newFormat) => {
        set({ format: newFormat });
      },
      resetFormat: () => {
        set({ format: "mp3" });
      },
    }),
    {
      name: "music-format",
    }
  )
);
