import { Box, Container, Stack, Typography } from "@mui/material";
import Example from "../../consultas/components/ConsultasTable";

export default function Consultas() {
  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Box sx={{ minWidth: 0, width: "100%" }}>
          <Example />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Turnos
        </Typography>
      </Stack>
    </Container>
  );
}
