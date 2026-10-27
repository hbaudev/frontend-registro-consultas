import { useEffect} from "react";
import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import { useMedicos } from "../hooks/useMedicos";
import { useEspecialidades } from "../../especialidades/hooks/useEspecialidades";
import MedicosTable from "../components/MedicosTable";
import MedicosFilters from "../components/MedicosFilters";
import MedicosPagination from "../components/MedicosPagination";

export default function Medicos() {
    const {
        medicos,
        paginacion,
        busqueda,
        codigoEspecialidad,
        disponibilidad,
        pagina,
        tamanioPagina,
        status,
        error,
        buscar,
        cambiarCodigoEspecialidad,
        cambiarDisponibilidad,
        cambiarPagina,
        cambiarTamanioPagina,
        reload,
    } = useMedicos();

    const { catalogoEspecialidades, catalogoLoading, cargarCatalogo } = useEspecialidades();

   // const [_dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        void cargarCatalogo();
    }, [cargarCatalogo]);

    return (
        <Container maxWidth={false} disableGutters>
            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" color="text.secondary">Médicos</Typography>
                    {/* <Button variant="outlined" onClick={() => setDialogOpen(true)}>Agregar</Button> */}
                </Box>

                {/** Filtros */}
                <MedicosFilters
                    busqueda={busqueda}
                    codigoEspecialidad={codigoEspecialidad}
                    disponible={disponibilidad}
                    especialidades={catalogoEspecialidades}
                    loadingEspecialidades={catalogoLoading}
                    loadingMedicos={status === "loading"}
                    onSearch={buscar}
                    onDisponibleChange={cambiarDisponibilidad}
                    onEspecialidadChange={cambiarCodigoEspecialidad}
                    onClear={() => {
                        buscar("");
                        cambiarCodigoEspecialidad(null);
                        cambiarDisponibilidad(null);
                    }}
                />

                {error && (
                    <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Reintentar</Button>}>
                        {error}
                    </Alert>
                )}

                {/** Tabla */}
                <MedicosTable
                    medicos={medicos}
                    loading={status === "loading"}
                    onView={(medico) => console.log("Ver especialidades de:", medico)}
                    onEdit={(medico) => console.log("Editar médico:", medico)}
                    onDelete={(medico) => console.log("Eliminar médico:", medico)}
                />

                {/** Paginación */}
                <MedicosPagination
                    pagina={pagina}
                    tamanioPagina={tamanioPagina}
                    totalRegistros={paginacion.totalRegistros}
                    disabled={status !== "ready"}
                    onPageChange={cambiarPagina}
                    onPageSizeChange={cambiarTamanioPagina}
                />

                {/** Dialog de agregar (pendiente) */}
            </Stack>
        </Container>
    );
}
