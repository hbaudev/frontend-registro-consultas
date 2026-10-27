import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Container,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";
import ProgramacionFilters from "../components/ProgramacionFilters";
import ProgramacionFormDialog from "../components/ProgramacionFormDialog";
import ProgramacionesTable from "../components/ProgramacionesTable";
import { useConsultorios } from "../../consultorios/hooks/useConsultorios";
import { useMedicos } from "../../medicos/hooks/useMedicos";
import { useProgramaciones } from "../hooks/useProgramaciones";
import { ProgramacionProvider } from "../providers/ProgramacionProvider";
import type { CrearProgramacionInput } from "../types/programaciones/index";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

function ProgramacionConsultasContent() {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notification, setNotification] = useState<{ message: string; severity: "success" | "error" } | null>(null);
    const {
        programaciones,
        fechaProgramacion,
        codigoMinsaMedico,
        numeroConsultorio,
        paginacion,
        pagina,
        tamanioPagina,
        status,
        error,
        reload,
        crearProgramacion,
        cambiarPagina,
        cambiarTamanioPagina,
        cambiarFechaProgramacion,
        cambiarCodigoMinsaMedico,
        cambiarNumeroConsultorio,
    } = useProgramaciones();
    const {
        catalogoMedicos,
        catalogoLoading: medicosLoading,
        cargarCatalogo: cargarMedicos,
    } = useMedicos();
    const {
        catalogoConsultorios,
        catalogoLoading: consultoriosLoading,
        cargarCatalogo: cargarConsultorios,
    } = useConsultorios();

    useEffect(() => {
        void Promise.all([cargarMedicos(), cargarConsultorios()]).catch((requestError: unknown) => {
            setNotification({
                message: getErrorMessage(requestError, "No se pudieron cargar los catálogos."),
                severity: "error",
            });
        });
    }, [cargarMedicos, cargarConsultorios]);

    const handleCreate = async (input: CrearProgramacionInput): Promise<boolean> => {
        setSubmitting(true);
        try {
            const result = await crearProgramacion(input);
            setNotification({ message: result.mensaje, severity: "success" });
            setOpen(false);
            return true;
        } catch (requestError) {
            setNotification({
                message: getErrorMessage(requestError, "No se pudo crear la programación."),
                severity: "error",
            });
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth={false} disableGutters>
            <Stack spacing={2} sx={{ minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" color="text.secondary">Programación de consultas</Typography>
                    <Button variant="outlined" onClick={() => setOpen(true)}>Agregar</Button>
                </Box>

                <ProgramacionFilters
                    fecha={fechaProgramacion}
                    codigoMinsaMedico={codigoMinsaMedico}
                    numeroConsultorio={numeroConsultorio}
                    medicos={catalogoMedicos}
                    consultorios={catalogoConsultorios}
                    medicosLoading={medicosLoading}
                    consultoriosLoading={consultoriosLoading}
                    onChangeFecha={cambiarFechaProgramacion}
                    onChangeMedico={cambiarCodigoMinsaMedico}
                    onChangeConsultorio={cambiarNumeroConsultorio}
                    onClear={() => {
                        cambiarFechaProgramacion(null);
                        cambiarCodigoMinsaMedico("");
                        cambiarNumeroConsultorio("");
                    }}
                />

                <ProgramacionesTable
                    programaciones={programaciones}
                    loading={status === "loading"}
                    error={status === "error" ? error : null}
                    page={pagina}
                    pageSize={tamanioPagina}
                    rowCount={paginacion.totalRegistros}
                    onPageChange={cambiarPagina}
                    onPageSizeChange={cambiarTamanioPagina}
                    onRetry={reload}
                />
            </Stack>

            <ProgramacionFormDialog
                open={open}
                closeDialog={() => setOpen(false)}
                submitting={submitting}
                onSubmit={handleCreate}
            />
            <Snackbar
                open={notification !== null}
                autoHideDuration={6000}
                onClose={(_, reason) => {
                    if (reason !== "clickaway") setNotification(null);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                {notification ? (
                    <Alert
                        onClose={() => setNotification(null)}
                        severity={notification.severity}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {notification.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Container>
    );
}

export default function ProgramacionConsultas() {
    return (
        <ProgramacionProvider>
            <ProgramacionConsultasContent />
        </ProgramacionProvider>
    );
}
