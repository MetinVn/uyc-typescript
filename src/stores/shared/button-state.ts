import { create } from "zustand";
import { ButtonState } from "../../types/types-animating-button";

type ButtonStateStore = {
  states: Record<string, ButtonState>;
  setButtonState: (id: string, state: ButtonState) => void;
  getButtonState: (id: string) => ButtonState;
};

export const useButtonState = create<ButtonStateStore>((set, get) => ({
  states: {},
  setButtonState: (id, state) =>
    set((prev) => ({
      states: { ...prev.states, [id]: state },
    })),
  getButtonState: (id) => get().states[id] || "default",
}));

export const animateTo = (id: string) => ({
  success: () => useButtonState.getState().setButtonState(id, "success"),
  error: () => useButtonState.getState().setButtonState(id, "error"),
  default: (delay = 1000) => {
    setTimeout(() => {
      useButtonState.getState().setButtonState(id, "default");
    }, delay);
  },
  pending: () => useButtonState.getState().setButtonState(id, "pending"),
});
