import { Box, Container, Stack, Typography, Button } from "@mui/material";
import Example from "../components/ConsultasTable";
import ConsultasFormDialog from "../components/ConsultasFormDialog";
import { useState } from "react";

export default function Consultas() {
  const [open, setOpen] = useState(false);
  const closeDialog = () => {
    setOpen(false)
  }

  const openDialog = () => {
    setOpen(true)
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={1.5} sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="text.secondary">
            Registro de consultas
          </Typography>
          <Button
            variant="outlined"
            // disabled={selectedTab !== 0}
            onClick={openDialog}
          >
            Agregar
          </Button>
        </Box>

        <Box sx={{ minWidth: 0, width: "100%" }}>
          <Example />
        </Box>
      </Stack>

      <ConsultasFormDialog open={open} closeDialog={closeDialog} />
    </Container>
  );
}
