import { useEffect, useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ApiError } from "../../../shared/lib/api";
import { useAuth } from "../hooks/useAuth";

export default function SessionRenewalPrompt() {
  const { renewAt, renewSession, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (renewAt === null) return;
    const timer = window.setTimeout(() => setOpen(true), Math.max(0, renewAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [renewAt]);

  async function continueSession() {
    setError("");
    try { await renewSession(); setOpen(false); }
    catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "No se pudo renovar la sesión.");
    }
  }

  async function endSession() {
    try { await logout(); } finally { setOpen(false); }
  }

  return <Dialog open={open && renewAt !== null} onClose={() => undefined} aria-labelledby="session-title">
    <DialogTitle id="session-title">¿Deseas continuar?</DialogTitle>
    <DialogContent>
      Tu sesión necesita renovarse. Confirma para seguir usando el sistema.
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </DialogContent>
    <DialogActions>
      <Button color="inherit" onClick={endSession}>Cerrar sesión</Button>
      <Button variant="contained" onClick={continueSession}>Continuar</Button>
    </DialogActions>
  </Dialog>;
}
