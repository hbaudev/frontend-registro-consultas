import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import FilialesTable from "../components/FilialesTable";
import { useFiliales } from "../hooks/useFiliales";

const menuOptions = ["Filiales", "Areas medicas", "Salas de espera", "Pantallas"];

export default function Configuracion() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [codigoFilial, setCodigoFilial] = useState("");
  const [nombreFilial, setNombreFilial] = useState("");
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const { filiales, status, error, reload, createFilial } = useFiliales();

  console.log(filiales)

  const handleCreateFilial = async () => {
    const input = {
      codigoFilial: codigoFilial.trim(),
      nombreFilial: nombreFilial.trim(),
    };
    if (!input.codigoFilial || !input.nombreFilial) {
      setCreateError("Ingresa el código y el nombre de la filial.");
      return;
    }

    setSaving(true);
    setCreateError(null);
    try {
      await createFilial(input);
      setCreateOpen(false);
      setCodigoFilial("");
      setNombreFilial("");
    } catch (requestError) {
      setCreateError(requestError instanceof Error
        ? requestError.message
        : "No se pudo crear la filial.");
    } finally {
      setSaving(false);
    }
  };

  const closeCreateDialog = () => {
    if (saving) return;
    setCreateOpen(false);
    setCreateError(null);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Stack spacing={2} sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" color="text.secondary">
            Configuracion de áreas
          </Typography>
          <Button disabled={selectedTab !== 0} onClick={() => setCreateOpen(true)}>
            Agregar
          </Button>
        </Box>

        <Paper sx={{ minWidth: 0 }}>
          <Tabs
            value={selectedTab}
            onChange={(_event, value: number) => setSelectedTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Opciones de configuracion"
          >
            {menuOptions.map((option, index) => (
              <Tab
                key={option}
                label={option}
                id={`config-tab-${index}`}
                aria-controls={`config-tabpanel-${index}`}
              />
            ))}
          </Tabs>

          <Box
            role="tabpanel"
            id={`config-tabpanel-${selectedTab}`}
            aria-labelledby={`config-tab-${selectedTab}`}
            sx={{ p: 2 }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">{menuOptions[selectedTab]}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTab === 0
                    ? "Administra las filiales disponibles para el sistema."
                    : "Esta seccion estara disponible mas adelante."}
                </Typography>
              </Box>

              {selectedTab === 0 && (
                <>
                  {status === "error" && (
                    <Alert
                      severity="error"
                      action={(
                        <Button color="inherit" size="small" onClick={() => void reload().catch(() => undefined)}>
                          Reintentar
                        </Button>
                      )}
                    >
                      {error}
                    </Alert>
                  )}
                  <FilialesTable filiales={filiales} loading={status === "loading"} />
                </>
              )}
            </Stack>
          </Box>
        </Paper>
      </Stack>

      <Dialog open={createOpen} onClose={closeCreateDialog} fullWidth maxWidth="xs">
        <DialogTitle>Agregar filial</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {createError && <Alert severity="error">{createError}</Alert>}
            <TextField
              autoFocus
              required
              label={"C\u00f3digo"}
              value={codigoFilial}
              slotProps={{ htmlInput: { maxLength: 20 } }}
              onChange={(event) => setCodigoFilial(event.target.value)}
            />
            <TextField
              required
              label="Nombre"
              value={nombreFilial}
              slotProps={{ htmlInput: { maxLength: 50 } }}
              onChange={(event) => setNombreFilial(event.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog} disabled={saving}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => void handleCreateFilial()}
            disabled={saving || !codigoFilial.trim() || !nombreFilial.trim()}
          >
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
