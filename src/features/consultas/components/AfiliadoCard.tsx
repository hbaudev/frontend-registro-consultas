import { Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import type { PacienteExpediente } from "../../pacientes/types/pacientes";

interface AfiliadoProps {
    afiliado: PacienteExpediente
}

export default function AfiliadoCard({ afiliado }: AfiliadoProps) {
    if (!afiliado) return null;

    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ pb: "16px !important" }}>
                <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
                    <BadgeOutlinedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Información del Afiliado Titular
                    </Typography>
                </Stack>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography variant="caption" color="text.secondary">Nombre completo</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {afiliado.nombres} {afiliado.apellidos}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                        <Typography variant="caption" color="text.secondary">INSS</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {afiliado.numeroInss ?? "—"}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                        <Typography variant="caption" color="text.secondary">Cédula</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {afiliado.numeroCedula ?? "—"}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                        <Typography variant="caption" color="text.secondary">Tipo de seguro</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {afiliado.tipoSeguro}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography variant="caption" color="text.secondary">Empresa</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {afiliado.empresa ?? "—"}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}