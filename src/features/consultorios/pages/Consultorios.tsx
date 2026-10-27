import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useConsultorios } from "../hooks/useConsultorios";

export default function Consultorios() {
    const { consultorios } = useConsultorios();

    console.log(consultorios, "consultorios");

    return (
        <Container maxWidth={false} disableGutters>
            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h5" color="text.secondary">Consultorios</Typography>
                    <Button variant="outlined">Agregar</Button>
                </Box>
            </Stack>
        </Container>
    );
}
