import { useState, type SubmitEvent } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { TipoAfiliado } from "../../afiliados/services/ipss-api";

interface PacientesFiltersProps {
  busqueda: string;
  tipoSeguroId: number | null;
  tiposAfiliados: TipoAfiliado[];
  loadingTipos: boolean;
  loading: boolean;
  onSearch: (busqueda: string) => void;
  onTipoSeguroChange: (tipoSeguroId: number | null) => void;
  onClear: () => void;
}

export default function PacientesFilters({
  busqueda,
  tipoSeguroId,
  tiposAfiliados,
  loadingTipos,
  loading,
  onSearch,
  onTipoSeguroChange,
  onClear,
}: PacientesFiltersProps) {
  const [draft, setDraft] = useState(busqueda);
  // Sincronización segura de estado derivado sin useEffect
  const [prevBusqueda, setPrevBusqueda] = useState(busqueda);
  if (busqueda !== prevBusqueda) {
    setPrevBusqueda(busqueda);
    setDraft(busqueda);
  }


  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(draft.trim());
  }

  function clear() {
    setDraft("");
    onSearch("");
    onClear();
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
        <TextField
          label="Buscar pacientes"
          placeholder="Nombre, INSS, cédula o teléfono"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          slotProps={{ htmlInput: { maxLength: 100 } }}
          fullWidth
          size="small"
        />
        <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 220 } }}>
          <InputLabel id="tipo-seguro-label">Tipo de afiliado</InputLabel>
          <Select<number | "">
            labelId="tipo-seguro-label"
            label="Tipo de afiliado"
            value={tipoSeguroId ?? ""}
            disabled={loadingTipos || loading}
            onChange={(event) => {
              const value = event.target.value;
              onTipoSeguroChange(value === "" ? null : Number(value));
            }}
          >
            <MenuItem value=""><em>Todos</em></MenuItem>
            {tiposAfiliados.map((tipo) => (
              <MenuItem key={tipo.TipoAseguradoId} value={tipo.TipoAseguradoId}>
                {tipo.Descripcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loading}>
            Buscar
          </Button>
          <Button
            type="button"
            variant="outlined"
            startIcon={<ClearIcon />}
            disabled={loading || (!draft && !busqueda && tipoSeguroId === null)}
            onClick={clear}
          >
            Limpiar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
