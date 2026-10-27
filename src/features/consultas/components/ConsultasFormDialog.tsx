import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ValidarPercapitaForm from "./ValidarPercapitaForm";

interface Props {
  open: boolean;
  closeDialog: () => void;
}

export default function ConsultasFormDialog({ open, closeDialog }: Props) {
  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
      <DialogTitle>Registro de consulta</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Valida el numero INSS del paciente antes de continuar.
        </DialogContentText>
        <ValidarPercapitaForm />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
