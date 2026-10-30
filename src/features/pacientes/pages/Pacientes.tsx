import { useState, useEffect, useRef } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import PacientesFilters from "../components/PacientesFilters";
import PacientesPagination from "../components/PacientesPagination";
import PacientesTable from "../components/PacientesTable";
import PacientesFormDialog from "../components/PacientesFormDialog";
import PacienteExpedienteDialog from "../components/PacienteExpedienteDialog";
import { usePacientes } from "../hooks/usePacientes";
import type { Paciente } from "../types/pacientes/index";
import type { ExpedientePaciente } from "../types/expediente/index";
import { getPerCapita } from "../../afiliados/services/ipss-api";
import { ApiError } from "../../../shared/lib/api";
import { useNavigate } from "react-router";
import { useNotification } from "../../../shared/hooks/useNotification";

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

  const { notifyError, notifyWarning, notifyInfo, notifySuccess } = useNotification();

  // Notificar errores de carga de listas (solo cuando cambian)
  const prevError = useRef<string | null>(null);
  const prevTiposError = useRef<string | null>(null);

  useEffect(() => {
    if (error && error !== prevError.current) {
      notifyError(error);
    }
    prevError.current = error;
  }, [error, notifyError]);

  useEffect(() => {
    if (tiposError && tiposError !== prevTiposError.current) {
      notifyError(tiposError);
    }
    prevTiposError.current = tiposError;
  }, [tiposError, notifyError]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [expedienteDialogOpen, setExpedienteDialogOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [expedientes, setExpedientes] = useState<ExpedientePaciente[]>([]);
  const [expedientesLoading, setExpedientesLoading] = useState(false);
  const [expedientesError, setExpedientesError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleVerExpediente = async (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setExpedienteDialogOpen(true);

    if (!paciente.numeroInss) {
      setExpedientes([]);
      const msg = "El paciente no tiene número INSS registrado para consultar sus expedientes.";
      setExpedientesError(msg);
      notifyWarning(msg);
      setExpedientesLoading(false);
      return;
    }

    setExpedientesLoading(true);
    setExpedientesError(null);
    try {
      const data = await obtenerExpedientePacientePorInss(String(paciente.numeroInss));
      setExpedientes(data);

      if (data.length === 0) {
        notifyInfo("No se encontraron expedientes para este paciente.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudieron obtener los expedientes del paciente.";
      setExpedientesError(message);
      setExpedientes([]);
      notifyError(message);
    } finally {
      setExpedientesLoading(false);
    }
  };

  const handleValidarPaciente = async (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    try {
      if (paciente.numeroInss) {
        const afiliado = await getPerCapita(paciente.numeroInss);

        if (afiliado) {
          notifySuccess("Paciente validado correctamente.");
          navigate(`/registrar-consulta/paciente/${paciente.numeroInss}`, { state: { afiliado } });
        }
      } else {
        notifyWarning("El paciente no tiene número INSS registrado.");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        notifyError(`Error al validar el afiliado: ${error.message}`);
      }
    }
  }

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
          <Button
            size="small"
            color="error"
            variant="text"
            onClick={reloadTipos}
            sx={{ alignSelf: "flex-start" }}
          >
            Error al cargar tipos de afiliado — Reintentar
          </Button>
        )}

        {error && (
          <Button
            size="small"
            color="error"
            variant="text"
            onClick={reload}
            sx={{ alignSelf: "flex-start" }}
          >
            Error al cargar pacientes — Reintentar
          </Button>
        )}

        <PacientesTable
          pacientes={pacientes}
          loading={status === "loading"}
          onViewExpediente={handleVerExpediente}
          onRegister={handleValidarPaciente}
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
