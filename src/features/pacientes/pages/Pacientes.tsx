import { useState } from "react";
import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import PacientesFilters from "../components/PacientesFilters";
import PacientesPagination from "../components/PacientesPagination";
import PacientesTable from "../components/PacientesTable";
import PacientesFormDialog from "../components/PacientesFormDialog";
import PacienteExpedienteDialog from "../components/PacienteExpedienteDialog";
import { usePacientes } from "../hooks/usePacientes";
import type { Paciente } from "../types/pacientes/index";
import type { ExpedientePaciente } from "../types/expediente/index";

export default function Pacientes() {
  const {
    pacientes,
    paginacion,
    busqueda,
    tipoSeguroId,
    tiposAfiliados,
    pagina,
    tamanioPagina,
    status,
    tiposStatus,
    error,
    tiposError,
    buscar,
    cambiarTipoSeguro,
    cambiarPagina,
    cambiarTamanioPagina,
    reload,
    reloadTipos,
    obtenerExpedientePacientePorInss,
  } = usePacientes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [expedienteDialogOpen, setExpedienteDialogOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [expedientes, setExpedientes] = useState<ExpedientePaciente[]>([]);
  const [expedientesLoading, setExpedientesLoading] = useState(false);
  const [expedientesError, setExpedientesError] = useState<string | null>(null);

  const handleVerExpediente = async (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setExpedienteDialogOpen(true);

    if (!paciente.numeroInss) {
      setExpedientes([]);
      setExpedientesError("El paciente no tiene número INSS registrado para consultar sus expedientes.");
      setExpedientesLoading(false);
      return;
    }

    setExpedientesLoading(true);
    setExpedientesError(null);
    try {
      const data = await obtenerExpedientePacientePorInss(String(paciente.numeroInss));
      setExpedientes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudieron obtener los expedientes del paciente.";
      setExpedientesError(message);
      setExpedientes([]);
    } finally {
      setExpedientesLoading(false);
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" color="text.secondary">Pacientes</Typography>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>Agregar</Button>
        </Box>

        <PacientesFilters
          busqueda={busqueda}
          tipoSeguroId={tipoSeguroId}
          tiposAfiliados={tiposAfiliados}
          loadingTipos={tiposStatus === "loading"}
          loading={status === "loading"}
          onSearch={buscar}
          onTipoSeguroChange={cambiarTipoSeguro}
          onClear={() => cambiarTipoSeguro(null)}
        />

        {tiposError && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={reloadTipos}>Reintentar</Button>}>
            {tiposError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Reintentar</Button>}>
            {error}
          </Alert>
        )}

        <PacientesTable
          pacientes={pacientes}
          loading={status === "loading"}
          onViewExpediente={handleVerExpediente}
        />

        <PacientesPagination
          pagina={pagina}
          tamanioPagina={tamanioPagina}
          totalRegistros={paginacion.totalRegistros}
          disabled={status !== "ready"}
          onPageChange={cambiarPagina}
          onPageSizeChange={cambiarTamanioPagina}
        />

        <PacientesFormDialog open={dialogOpen} closeDialog={() => setDialogOpen(false)} />

        <PacienteExpedienteDialog
          open={expedienteDialogOpen}
          closeDialog={() => setExpedienteDialogOpen(false)}
          paciente={pacienteSeleccionado}
          expedientes={expedientes}
          loading={expedientesLoading}
          error={expedientesError}
          onRetry={() => {
            if (pacienteSeleccionado) {
              void handleVerExpediente(pacienteSeleccionado);
            }
          }}
        />
      </Stack>
    </Container>
  );
}
