import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Music } from "../../types/types-converted-music";

interface IConvertedSong {
  song: Music | null;
  addToConverted: (song: Music) => void;
  clearSong: () => void;
  removeFromConverted: (songId: string) => void;
}

let expirationTimeout: ReturnType<typeof setTimeout> | null = null;

export const useConvertedSong = create<IConvertedSong>()(
  persist(
    (set, get) => ({
      song: null,
      addToConverted: (song: Music) => {
        clearTimeout(expirationTimeout!);
        const expiresIn = song.expiresAt - Date.now();

        if (expiresIn > 0) {
          expirationTimeout = setTimeout(() => {
            get().clearSong();
          }, expiresIn);
        }
        set({ song });
      },
      clearSong: () => {
        clearTimeout(expirationTimeout!);
        expirationTimeout = null;
        set({ song: null });
      },
      removeFromConverted: (songId: string) => {
        if (get().song?.id === songId) {
          set({ song: null });
        }
      },
    }),
    {
      name: "converted-song",
      onRehydrateStorage: () => (state) => {
        const song = state?.song;
        if (song) {
          if (song.expiresAt <= Date.now()) {
            state.clearSong();
          } else {
            const expiresIn = song.expiresAt - Date.now();
            expirationTimeout = setTimeout(() => {
              state.clearSong();
            }, expiresIn);
          }
        }
      },
    }
  )
);

export const converted = {
  add: (song: Music) => useConvertedSong.getState().addToConverted(song),
  clear: () => useConvertedSong.getState().clearSong(),
  get: () => useConvertedSong.getState().song,
  use: () => useConvertedSong((s) => s.song),
};
