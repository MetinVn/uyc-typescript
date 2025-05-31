import { create } from "zustand";

interface IUser {
  isEmailVerified: boolean;
  setIsEmailVerified: (state: boolean) => void;
}

export const useUserState = create<IUser>()((set) => ({
  isEmailVerified: false,
  setIsEmailVerified: (state) => {
    set({ isEmailVerified: state });
  },
}));

export const email = {
  use: () => useUserState((state) => state.isEmailVerified),
  state: () => useUserState.getState().isEmailVerified,
  set: (state: boolean) => useUserState.getState().setIsEmailVerified(state),
};
