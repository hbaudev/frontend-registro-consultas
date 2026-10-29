import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Alert, Snackbar, type SnackbarCloseReason } from "@mui/material";
import {
  NotificationContext,
  type Notification,
  type NotificationSeverity,
} from "../context/notification-context";

const DEFAULT_DURATION = 4000;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Notification[]>([]);

  const current = queue[0] ?? null;

  const notify = useCallback(
    (
      message: string,
      severity: NotificationSeverity = "info",
      autoHideDuration: number = DEFAULT_DURATION
    ) => {
      const id = crypto.randomUUID();
      setQueue((prev) => [...prev, { id, message, severity, autoHideDuration }]);
    },
    []
  );

  const notifySuccess = useCallback(
    (message: string, autoHideDuration?: number) =>
      notify(message, "success", autoHideDuration),
    [notify]
  );

  const notifyError = useCallback(
    (message: string, autoHideDuration?: number) =>
      notify(message, "error", autoHideDuration ?? 6000),
    [notify]
  );

  const notifyWarning = useCallback(
    (message: string, autoHideDuration?: number) =>
      notify(message, "warning", autoHideDuration),
    [notify]
  );

  const notifyInfo = useCallback(
    (message: string, autoHideDuration?: number) =>
      notify(message, "info", autoHideDuration),
    [notify]
  );

  const handleClose = useCallback(
    (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
      if (reason === "clickaway") return;
      setQueue((prev) => prev.slice(1));
    },
    []
  );

  const handleAlertClose = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  const value = useMemo(
    () => ({ notify, notifySuccess, notifyError, notifyWarning, notifyInfo }),
    [notify, notifySuccess, notifyError, notifyWarning, notifyInfo]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}

      <Snackbar
        open={current !== null}
        autoHideDuration={current?.autoHideDuration ?? DEFAULT_DURATION}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        key={current?.id}
      >
        <Alert
          onClose={handleAlertClose}
          severity={current?.severity ?? "info"}
          variant="filled"
          sx={{ width: "100%", minWidth: 300 }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

