import { Box, Container, Stack, Typography } from "@mui/material";

export default function Consultas() {
  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Box sx={{ minWidth: 0, width: "100%" }}>
     
        </Box>
        <Typography variant="body2" color="text.secondary">
          Perfil de usuario
        </Typography>
      </Stack>
    </Container>
  );
}
