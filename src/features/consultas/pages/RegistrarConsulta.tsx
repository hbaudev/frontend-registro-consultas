import { Box, CircularProgress, Container, Stack, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import RegistrarConsultaForm from "../components/RegistrarConsultaForm";
import type { PacienteExpediente } from "../../pacientes/types/pacientes";
import { getPacienteCompletoByInss } from "../../pacientes/services/pacientes-api";
import { useNotification } from "../../../shared/hooks/useNotification";

export default function RegistrarConsulta() {
    const { inss } = useParams<{ inss: string }>();
    const navigate = useNavigate();
    const { notifyError } = useNotification();

    const [pacientes, setPacientes] = useState<PacienteExpediente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!inss) return;
        const controller = new AbortController();

        getPacienteCompletoByInss(Number(inss), controller.signal)
            .then((data) => {
                setPacientes(data ?? []);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                notifyError(
                    err instanceof Error
                        ? err.message
                        : "No se pudo obtener la información del paciente."
                );
                navigate("/pacientes", { replace: true });
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [inss, navigate, notifyError]);

    return (
        <Container maxWidth={false} disableGutters>
            <Stack spacing={2} sx={{ minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" color="text.secondary">
                        Registrar consulta
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : pacientes.length > 0 ? (
                    <RegistrarConsultaForm pacientes={pacientes} pacienteInss={inss!} />
                ) : (
                    <Typography color="text.secondary">
                        No se encontró información del paciente.
                    </Typography>
                )}
            </Stack>
        </Container>
    );
}
