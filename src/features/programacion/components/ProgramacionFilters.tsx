import {
    Autocomplete,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
} from "@mui/material";
import type { Consultorio } from "../../consultorios/types/consultorios/index";
import type { Medico } from "../../medicos/types/medicos/index";

interface ProgramacionFiltersProps {
    fecha: Date | null;
    codigoMinsaMedico: string;
    numeroConsultorio: string;
    medicos: Medico[];
    consultorios: Consultorio[];
    medicosLoading: boolean;
    consultoriosLoading: boolean;
    onChangeFecha: (fecha: Date | null) => void;
    onChangeMedico: (codigo: string) => void;
    onChangeConsultorio: (numero: string) => void;
    onClear: () => void;
}

function formatInputDate(value: Date | null): string {
    if (!value) return "";
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function ProgramacionFilters({
    fecha,
    codigoMinsaMedico,
    numeroConsultorio,
    medicos,
    consultorios,
    medicosLoading,
    consultoriosLoading,
    onChangeFecha,
    onChangeMedico,
    onChangeConsultorio,
    onClear,
}: ProgramacionFiltersProps) {
    const today = new Date();
    const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const selectedMedico = medicos.find((medico) => medico.codigoMinsa === codigoMinsaMedico) ?? null;

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <TextField
                        label="Fecha"
                        type="date"
                        value={formatInputDate(fecha)}
                        onChange={(event) => onChangeFecha(
                            event.target.value ? new Date(`${event.target.value}T00:00:00`) : null,
                        )}
                        fullWidth
                        size="small"
                        slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayValue } }}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 4 }}>
                    <Autocomplete
                        options={medicos}
                        loading={medicosLoading}
                        value={selectedMedico}
                        onChange={(_, medico) => onChangeMedico(medico?.codigoMinsa ?? "")}
                        getOptionLabel={(medico) => `${medico.nombre} ${medico.apellido}`}
                        isOptionEqualToValue={(option, value) => option.codigoMinsa === value.codigoMinsa}
                        loadingText="Cargando médicos..."
                        noOptionsText="No hay médicos disponibles"
                        renderInput={(params) => (
                            <TextField {...params} label="Médico" size="small" />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4, md: 3 }}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="filtro-consultorio-label">Consultorio</InputLabel>
                        <Select
                            labelId="filtro-consultorio-label"
                            label="Consultorio"
                            value={numeroConsultorio}
                            onChange={(event) => onChangeConsultorio(event.target.value)}
                            disabled={consultoriosLoading}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {consultorios.map((consultorio) => (
                                <MenuItem key={consultorio.numeroConsultorio} value={consultorio.numeroConsultorio}>
                                    {consultorio.nombreConsultorio}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Button fullWidth onClick={onClear}>Limpiar filtros</Button>
                </Grid>
            </Grid>
        </Paper>
    );
}
