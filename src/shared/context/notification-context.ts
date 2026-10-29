import { createContext } from "react";

export type NotificationSeverity = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  message: string;
  severity: NotificationSeverity;
  autoHideDuration?: number;
};

export type NotificationContextValue = {
  notify: (message: string, severity?: NotificationSeverity, autoHideDuration?: number) => void;
  notifySuccess: (message: string, autoHideDuration?: number) => void;
  notifyError: (message: string, autoHideDuration?: number) => void;
  notifyWarning: (message: string, autoHideDuration?: number) => void;
  notifyInfo: (message: string, autoHideDuration?: number) => void;
};

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

