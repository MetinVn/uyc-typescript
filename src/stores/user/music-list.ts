import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Music } from "../../types/types-converted-music";

interface IMusicList {
  music: Music[];
  getListLength: () => number;
  addToMusicList: (song: Music) => void;
  removeFromMusicList: (id: Music["id"]) => void;
  rateMusic: (rating: Music["rating"], id: Music["id"]) => void;
  makeFavorite: (id: Music["id"]) => void;
  clearMusicList: () => void;
}

export const useMusicList = create<IMusicList>()(
  persist(
    (set, get) => ({
      music: [],

      getListLength: () => {
        return get().music.length;
      },

      addToMusicList: (song) => {
        const prev = get().music;
        const index = prev.findIndex((item) => item.id === song.id);
        if (index !== -1) return;
        const newList = [...prev, song];
        set({ music: newList });
      },
      removeFromMusicList: (id) => {
        const prev = get().music;
        const newList = prev.filter((song) => song.id !== id);
        set({ music: newList });
      },
      rateMusic: (rating, id) => {
        const list = get().music;
        const index = list.findIndex((song) => song.id === id);

        if (index === -1) return;

        const updatedList = [...list];
        const song = updatedList[index];
        const newRating = song.rating === rating ? 0 : rating;

        updatedList[index] = { ...song, rating: newRating };

        set({ music: updatedList });
      },

      makeFavorite: (id) => {
        const list = get().music;
        const index = list.findIndex((song) => song.id === id);
        if (index === -1) return;

        const listCopy = [...list];
        const song = listCopy[index];

        listCopy[index] = { ...song, starred: !song.starred };

        set({ music: listCopy });
      },
      clearMusicList: () => set({ music: [] }),
    }),
    {
      name: "music-list",
    }
  )
);

export const uycmusic = {
  save: (song: Music) => useMusicList.getState().addToMusicList(song),
  remove: (id: Music["id"]) => useMusicList.getState().removeFromMusicList(id),
  rate: (rating: Music["rating"], id: Music["id"]) => useMusicList.getState().rateMusic(rating, id),
  favor: (id: Music["id"]) => useMusicList.getState().makeFavorite(id),
  destroy: () => useMusicList.getState().clearMusicList(),
};
