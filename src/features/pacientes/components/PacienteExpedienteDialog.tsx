import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import type { ExpedientePaciente } from "../types/expediente/index";
import type { Paciente } from "../types/pacientes/index";
import PacienteExpedientesTable from "./PacienteExpedientesTable";

interface Props {
  open: boolean;
  closeDialog: () => void;
  paciente: Paciente | null;
  expedientes: ExpedientePaciente[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function PacienteExpedienteDialog({
  open,
  closeDialog,
  paciente,
  expedientes,
  loading,
  error,
  onRetry,
}: Props) {
  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FolderSharedOutlinedIcon color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Expedientes del Paciente
          </Typography>
        </Box>
        {paciente && (
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", gap: 0.5 }}>
            <Chip
              label={`${paciente.nombres} ${paciente.apellidos}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {paciente.numeroCedula && (
              <Chip
                label={`Cédula: ${paciente.numeroCedula}`}
                size="small"
                variant="outlined"
              />
            )}
            {paciente.numeroInss && (
              <Chip
                label={`INSS: ${paciente.numeroInss}`}
                size="small"
                variant="outlined"
              />
            )}
            {paciente.tipoSeguro && (
              <Chip
                label={paciente.tipoSeguro}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: 200, p: 2 }}>
        {error ? (
          <Alert
            severity="error"
            action={
              onRetry && (
                <Button color="inherit" size="small" onClick={onRetry}>
                  Reintentar
                </Button>
              )
            }
          >
            {error}
          </Alert>
        ) : (
          <PacienteExpedientesTable
            expedientes={expedientes}
            loading={loading}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={closeDialog} variant="outlined">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}