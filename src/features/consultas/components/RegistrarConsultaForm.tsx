import { useMemo } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import type { PacienteExpediente } from "../../pacientes/types/pacientes";
import AfiliadoCard from "./AfiliadoCard";
import PacientesPicker from "./PacientesPicker";
import ProgramacionesPicker from "./ProgramacionesPicker";
import RegistroSelectorsSectionLayout from "../layouts/RegistroSelectorsSectionLayout";
import { getTodayIso } from "../../../shared/utils/getTodayIso";
import { formatDate } from "../../../shared/utils/formatDate";
import { useNotification } from "../../../shared/hooks/useNotification";
import { registrarConsultaApi } from "../services/consultas-api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPacienteRowId(p: PacienteExpediente, index?: number): string {
    if (p.numeroCedula) return p.numeroCedula;
    return `${p.numeroInss}-${p.numeroExpediente ?? "sin-exp"}-${p.nombres}-${p.apellidos}-${index ?? 0}`;
}

// ─── Form types ───────────────────────────────────────────────────────────────

interface ConsultaFormValues {
    pacienteKey: string;
    codigoProgramacion: string;
    esCitado: boolean;
    esTraslado: boolean;
    sacarExpediente: boolean;
    observaciones: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    pacientes: PacienteExpediente[];
    pacienteInss: string;
}

export default function RegistrarConsultaForm({ pacientes, pacienteInss }: Props) {
    const navigate = useNavigate();
    const { notifySuccess, notifyError } = useNotification();

    const afiliadoPrincipal = useMemo(
        () => pacientes.find((p) => p.numeroInss === Number(pacienteInss)) ?? pacientes[0] ?? null,
        [pacientes, pacienteInss]
    );

    const defaultPacienteKey = useMemo(() => {
        if (!afiliadoPrincipal) return "";
        return getPacienteRowId(afiliadoPrincipal, 0);
    }, [afiliadoPrincipal]);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ConsultaFormValues>({
        defaultValues: {
            pacienteKey: defaultPacienteKey,
            codigoProgramacion: "",
            esCitado: false,
            esTraslado: false,
            sacarExpediente: false,
            observaciones: "",
        },
    });

    const pacienteKey = useWatch({ control, name: "pacienteKey" });
    const codigoProgramacion = useWatch({ control, name: "codigoProgramacion" });
    const today = getTodayIso();
    const [d, m, y] = formatDate(today).split("/");

    const onSubmit = async (data: ConsultaFormValues) => {
        const pacienteSeleccionado =
            pacientes.find((p, idx) => getPacienteRowId(p, idx) === data.pacienteKey) ?? null;

        if (!pacienteSeleccionado || !pacienteSeleccionado.numeroInss) {
            notifyError("Debes seleccionar un paciente válido con número INSS.");
            return;
        }

        try {
            const response = await registrarConsultaApi({
                codigoProgramacion: data.codigoProgramacion,
                numeroInss: Number(pacienteSeleccionado.numeroInss),
                esCitado: data.esCitado,
                esTraslado: data.esTraslado,
                sacarExpediente: data.sacarExpediente,
                observaciones: data.observaciones.trim() || undefined,
            });

            notifySuccess(response.mensaje || "Consulta registrada exitosamente.");
            navigate("/consultas");
        } catch (error: unknown) {
            notifyError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar la consulta."
            );
        }
    };

    return (
        <Box
            component="form"
            id="registrar-consulta-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
        >
            <Stack spacing={3}>
                {/* ── 1. Información del afiliado titular ───────────── */}
                <AfiliadoCard afiliado={afiliadoPrincipal} />

                <Divider />

                {/* ── 2. Selección de paciente ──────────────────────── */}
                <RegistroSelectorsSectionLayout
                    title="Seleccione el paciente"
                    description="Selecciona el paciente (titular o beneficiario) para quien se registrará la consulta."
                    icon={<GroupOutlinedIcon color="primary" fontSize="small" />}
                >
                    <Controller
                        name="pacienteKey"
                        control={control}
                        rules={{ required: "Debes seleccionar un paciente." }}
                        render={() => (
                            <PacientesPicker
                                pacientes={pacientes}
                                selected={pacienteKey || null}
                                onSelect={(key) => setValue("pacienteKey", key ?? "", {
                                    shouldValidate: true
                                })}
                                pacienteInss={pacienteInss}
                                error={errors.pacienteKey?.message}
                            />
                        )}
                    />
                </RegistroSelectorsSectionLayout>

                <Divider />

                {/* ── 3. Selección de programación ──────────────────── */}
                <RegistroSelectorsSectionLayout
                    title={`Programación del día — ${d}/${m}/${y}`}
                    description="Selecciona la programación a la que se asignará la consulta."
                    icon={<AssignmentOutlinedIcon color="primary" fontSize="small" />}
                >
                    <Controller
                        name="codigoProgramacion"
                        control={control}
                        rules={{ required: "Debes seleccionar una programación." }}
                        render={() => (
                            <ProgramacionesPicker
                                selected={codigoProgramacion || null}
                                onSelect={(codigo) => setValue("codigoProgramacion", codigo ?? "", { shouldValidate: true })}
                                error={errors.codigoProgramacion?.message}
                            />
                        )}
                    />
                </RegistroSelectorsSectionLayout>

                <Divider />

                {/* ── 4. Opciones ───────────────────────────────────── */}
                <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Opciones
                    </Typography>

                    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                        <Controller
                            name="esCitado"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} disabled={isSubmitting} />}
                                    label="¿Es citado?"
                                />
                            )}
                        />

                        <Controller
                            name="esTraslado"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} disabled={isSubmitting} />}
                                    label="Traslado"
                                />
                            )}
                        />

                        <Controller
                            name="sacarExpediente"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Checkbox {...field} checked={field.value} disabled={isSubmitting} />}
                                    label="Sacar expediente"
                                />
                            )}
                        />
                    </Stack>
                </Stack>

                {/* ── 5. Observaciones ─────────────────────────────── */}
                <Controller
                    name="observaciones"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Observaciones"
                            multiline
                            minRows={3}
                            maxRows={6}
                            fullWidth
                            disabled={isSubmitting}
                            placeholder="Escribe aquí cualquier observación relevante..."
                            slotProps={{ htmlInput: { maxLength: 500 } }}
                            helperText={`${field.value.length}/500`}
                        />
                    )}
                />

                {/* ── 6. Acciones ───────────────────────────────────── */}
                <Stack direction="row" sx={{ justifyContent: "flex-end" }} spacing={2}>
                    <Button
                        variant="outlined"
                        href="/pacientes"
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ minWidth: 150 }}
                    >
                        {isSubmitting ? "Guardando…" : "Registrar consulta"}
                    </Button>
                </Stack>

            </Stack>
        </Box>
    );
}
