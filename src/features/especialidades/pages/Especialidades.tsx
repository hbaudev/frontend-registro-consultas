import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import EspecialidadesFilters from "../components/EspecialidadesFilters";
import EspecialidadesPagination from "../components/EspecialidadesPagination";
import EspecialidadesTable from "../components/EspecialidadesTable";
import { useEspecialidades } from "../hooks/useEspecialidades";

export default function Especialidades() {
  const {
    especialidades,
    paginacion,
    busqueda,
    pagina,
    tamanioPagina,
    status,
    error,
    buscar,
    cambiarPagina,
    cambiarTamanioPagina,
    reload,
  } = useEspecialidades();

  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Typography variant="h5" color="text.secondary">Especialidades médicas</Typography>

        <EspecialidadesFilters
          busqueda={busqueda}
          disabled={status === "loading"}
          onSearch={buscar}
          onClear={() => buscar("")}
        />

        {status === "error" && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Reintentar</Button>}>
            {error}
          </Alert>
        )}

        <EspecialidadesTable especialidades={especialidades} loading={status === "loading"} />

        <EspecialidadesPagination
          pagina={pagina}
          tamanioPagina={tamanioPagina}
          totalRegistros={paginacion.totalRegistros}
          disabled={status !== "ready"}
          onPageChange={cambiarPagina}
          onPageSizeChange={cambiarTamanioPagina}
        />
      </Stack>
    </Container>
  );
}
