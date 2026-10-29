import { useContext } from "react";
import { NotificationContext } from "../context/notification-context";

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification debe utilizarse dentro de NotificationProvider.");
  }
  return context;
}

