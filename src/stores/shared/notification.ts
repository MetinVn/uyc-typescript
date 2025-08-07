import { create } from "zustand";
import { INotification, NotificationType } from "../../types/types-notification";

const MAX_STACK = 10;

interface INotificationStore {
  notifications: INotification[];
  addNotification: (type: NotificationType, text: string, autoCloseDelay?: number) => void;
  removeNotification: (id: string) => void;
}

export const useNotification = create<INotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (type, text, autoCloseDelay) => {
    const notifications = get().notifications;

    if (notifications.some((n) => n.text === text && n.type === type)) return;

    const id = crypto.randomUUID();

    const updated: INotification[] = [...notifications, { id, type, text, autoCloseDelay }];
    if (updated.length > MAX_STACK) updated.shift();

    set({ notifications: updated });

    if (autoCloseDelay && autoCloseDelay > 0) {
      setTimeout(() => get().removeNotification(id), autoCloseDelay);
    }
  },

  removeNotification: (id) => {
    const n = get().notifications;
    const newN = n.filter((n) => n.id !== id);
    set({ notifications: newN });
  },
}));

export const notify = {
  success: (text: string, delay?: number) => useNotification.getState().addNotification("success", text, delay),
  error: (text: string, delay?: number) => useNotification.getState().addNotification("error", text, delay),
  warning: (text: string, delay?: number) => useNotification.getState().addNotification("warning", text, delay),
  info: (text: string, delay?: number) => useNotification.getState().addNotification("info", text, delay),
};
