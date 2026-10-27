import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ProgramacionManageForm from "./ProgramacionManageForm";
import type { CrearProgramacionInput } from "../types/programaciones/index";

interface Props {
  open: boolean;
  closeDialog: () => void;
  submitting: boolean;
  onSubmit: (input: CrearProgramacionInput) => Promise<boolean>;
}

export default function ProgramacionFormDialog({ open, closeDialog, submitting, onSubmit }: Props) {
  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 0.5 }}>Programación de consultas</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Completa la información para organizar la jornada de consultas.
        </Typography>
        <ProgramacionManageForm submitting={submitting} onSubmit={onSubmit} />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
        <Button onClick={closeDialog} color="inherit" disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" form="programacion-form" variant="contained" disabled={submitting}>
          {submitting ? <CircularProgress size={20} color="inherit" /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
