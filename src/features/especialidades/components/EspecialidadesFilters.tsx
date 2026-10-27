import { useState, type SubmitEvent } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface EspecialidadesFiltersProps {
  busqueda: string;
  disabled?: boolean;
  onSearch: (busqueda: string) => void;
  onClear: () => void;
}

export default function EspecialidadesFilters({ busqueda, disabled = false, onSearch, onClear }: EspecialidadesFiltersProps) {
  const [draft, setDraft] = useState(busqueda);

  // Sincronización segura de estado derivado sin useEffect
  const [prevBusqueda, setPrevBusqueda] = useState(busqueda);
  if (busqueda !== prevBusqueda) {
    setPrevBusqueda(busqueda);
    setDraft(busqueda);
  }

  // Usamos SubmitEvent correctamente importado desde "react"
  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(draft.trim());
  }

  function clear() {
    setDraft("");
    onClear();
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          label="Buscar especialidad"
          placeholder="Nombre de la especialidad"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          size="small"
          fullWidth
          disabled={disabled}
        />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={disabled}>
            Buscar
          </Button>
          <Button type="button" variant="outlined" startIcon={<ClearIcon />} disabled={disabled || !busqueda} onClick={clear}>
            Limpiar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}