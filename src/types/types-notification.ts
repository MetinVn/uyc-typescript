export type NotificationType = "success" | "error" | "warning" | "info";

export interface INotification {
  id: string;
  text: string;
  type: NotificationType;
  autoCloseDelay?: number;
}
