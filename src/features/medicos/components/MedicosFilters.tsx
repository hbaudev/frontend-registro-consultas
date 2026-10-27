import { useState, type FormEvent } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { Especialidad } from "../../especialidades/types/especialidades/index";

interface MedicosFiltersProps {
    busqueda: string;
    codigoEspecialidad: string | null;
    disponible: boolean | null;
    especialidades: Especialidad[];
    loadingEspecialidades: boolean;
    loadingMedicos: boolean;
    onSearch: (busqueda: string) => void;
    onDisponibleChange: (disponible: boolean | null) => void;
    onEspecialidadChange: (codigoEspecialidad: string | null) => void;
    onClear: () => void;
}

export default function MedicosFilters({
    busqueda,
    disponible,
    codigoEspecialidad,
    especialidades,
    loadingEspecialidades,
    loadingMedicos,
    onSearch,
    onDisponibleChange,
    onEspecialidadChange,
    onClear
}: MedicosFiltersProps) {
    const [draft, setDraft] = useState(busqueda);
    const [prevBusqueda, setPrevBusqueda] = useState(busqueda);
    if (busqueda !== prevBusqueda) {
        setPrevBusqueda(busqueda);
        setDraft(busqueda);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
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
                    label="Buscar Médico"
                    placeholder="Nombre, Código MINSA o Cédula"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                    fullWidth
                    size="small"
                />
                <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 220 } }}>
                    <InputLabel id="especialidad-label">Especialidad</InputLabel>
                    <Select<string>
                        labelId="especialidad-label"
                        label="Especialidad"
                        value={codigoEspecialidad ?? ""}
                        disabled={loadingEspecialidades || loadingMedicos}
                        onChange={(event) => {
                            const value = event.target.value;
                            onEspecialidadChange(value === "" ? null : value);
                        }}
                    >
                        <MenuItem value=""><em>Todas</em></MenuItem>
                        {especialidades
                            .filter((esp): esp is Especialidad & { codigoEspecialidad: string } => Boolean(esp.codigoEspecialidad))
                            .map((especialidad) => (
                                <MenuItem key={especialidad.codigoEspecialidad} value={especialidad.codigoEspecialidad}>
                                    {especialidad.nombreEspecialidad}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 170 } }}>
                    <InputLabel id="disponibilidad-label">Disponibilidad</InputLabel>
                    <Select<string>
                        labelId="disponibilidad-label"
                        label="Disponibilidad"
                        value={disponible === null ? "" : disponible ? "true" : "false"}
                        disabled={loadingMedicos}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (value === "") onDisponibleChange(null);
                            else if (value === "true") onDisponibleChange(true);
                            else onDisponibleChange(false);
                        }}
                    >
                        <MenuItem value=""><em>Todos</em></MenuItem>
                        <MenuItem value="true">Disponible</MenuItem>
                        <MenuItem value="false">No disponible</MenuItem>
                    </Select>
                </FormControl>
                <Stack direction="row" spacing={1}>
                    <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loadingMedicos}>
                        Buscar
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        disabled={loadingMedicos || (!draft && !busqueda && codigoEspecialidad === null && disponible === null)}
                        onClick={clear}
                    >
                        Limpiar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}