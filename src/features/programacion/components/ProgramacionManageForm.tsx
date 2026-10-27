import { useState, type FormEvent } from "react";
import {
    Autocomplete,
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import type { CrearProgramacionInput } from "../types/programaciones/index";
import { useConsultorios } from "../../consultorios/hooks/useConsultorios";
import { useMedicos } from "../../medicos/hooks/useMedicos";

interface Props {
    submitting: boolean;
    onSubmit: (input: CrearProgramacionInput) => Promise<boolean>;
}

export default function ProgramacionManageForm({ submitting, onSubmit }: Props) {
    const today = new Date();
    const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const { catalogoMedicos, catalogoLoading: medicosLoading } = useMedicos();
    const { catalogoConsultorios, catalogoLoading: consultoriosLoading } = useConsultorios();
    const [codigoMinsaMedico, setCodigoMinsaMedico] = useState("");
    const [numeroConsultorio, setNumeroConsultorio] = useState("");
    const [jornada, setJornada] = useState<"AM" | "PM" | "">("");
    const [limitePacientes, setLimitePacientes] = useState("");
    const [fecha, setFecha] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!codigoMinsaMedico || !numeroConsultorio || !jornada || !limitePacientes || !fecha) return;
        const saved = await onSubmit({
            fecha,
            jornada,
            limitePacientes: Number(limitePacientes),
            codigoMinsaMedico,
            numeroConsultorio,
        });
        if (saved) {
            setCodigoMinsaMedico("");
            setNumeroConsultorio("");
            setJornada("");
            setLimitePacientes("");
            setFecha("");
        }
    };

    return (
        <Box id="programacion-form" component="form" onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ pt: 1 }}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Autocomplete
                            options={catalogoMedicos}
                            loading={medicosLoading}
                            value={catalogoMedicos.find((medico) => medico.codigoMinsa === codigoMinsaMedico) ?? null}
                            onChange={(_, medico) => setCodigoMinsaMedico(medico?.codigoMinsa ?? "")}
                            getOptionLabel={(medico) => `${medico.nombre} ${medico.apellido}`}
                            isOptionEqualToValue={(option, value) => option.codigoMinsa === value.codigoMinsa}
                            loadingText="Cargando médicos..."
                            noOptionsText="No hay médicos disponibles"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Médico"
                                    placeholder="Busca y selecciona un médico"
                                    required
                                    disabled={submitting || medicosLoading}
                                />
                            )}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="consultorio-label">Consultorio</InputLabel>
                            <Select
                                labelId="consultorio-label"
                                id="consultorio"
                                label="Consultorio"
                                value={numeroConsultorio}
                                onChange={(event) => setNumeroConsultorio(event.target.value)}
                                size="small"
                                disabled={submitting || consultoriosLoading}
                            >
                                {catalogoConsultorios.map((consultorio) => (
                                    <MenuItem
                                        key={consultorio.numeroConsultorio}
                                        value={consultorio.numeroConsultorio}
                                    >
                                        {consultorio.nombreConsultorio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="turno-label">Jornada</InputLabel>
                            <Select
                                labelId="turno-label"
                                id="turno"
                                label="Jornada"
                                value={jornada}
                                onChange={(event) => setJornada(event.target.value as "AM" | "PM" | "")}
                                size="small"
                                disabled={submitting}
                            >
                                <MenuItem value="AM">Matutino (AM)</MenuItem>
                                <MenuItem value="PM">Vespertino (PM)</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel id="max-pacientes-label">Máximo de pacientes</InputLabel>
                            <Select
                                labelId="max-pacientes-label"
                                id="max-pacientes"
                                label="Máximo de pacientes"
                                value={limitePacientes}
                                onChange={(event) => setLimitePacientes(event.target.value)}
                                size="small"
                                disabled={submitting}
                            >
                                {[10, 20, 30, 40, 50, 60].map((cantidad) => (
                                    <MenuItem key={cantidad} value={cantidad}>
                                        {cantidad} pacientes
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            id="fecha-programacion"
                            label="Fecha de programación"
                            type="date"
                            value={fecha}
                            onChange={(event) => setFecha(event.target.value)}
                            fullWidth
                            size="small"
                            required
                            disabled={submitting}
                            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayValue } }}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
}
