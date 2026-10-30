import { Chip, Stack, Typography } from "@mui/material";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowSelectionState,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { useMemo, useEffect, useState } from "react";
import type { Programacion } from "../../programacion/types/programaciones";
import { getProgramaciones } from "../../programacion/services/programaciones-api";
import { getTodayIso } from "../../../shared/utils/getTodayIso";

interface ProgramacionesPickerProps {
    selected: string | null;
    onSelect: (codigoProgramacion: string | null) => void;
    error?: string;
}

export default function ProgramacionesPicker({ selected, onSelect, error: fieldError }: ProgramacionesPickerProps) {
    const [programaciones, setProgramaciones] = useState<Programacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        getProgramaciones({ fecha: getTodayIso(), tamanioPagina: 100 }, controller.signal)
            .then((res) => {
                setProgramaciones(res.programaciones);
                setFetchError(null);
            })
            .catch((err: unknown) => {
                if (controller.signal.aborted) return;
                setFetchError(
                    err instanceof Error ? err.message : "No se pudieron cargar las programaciones"
                );
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    const rowSelection = useMemo<MRT_RowSelectionState>(
        () => (selected ? { [selected]: true } : {}),
        [selected]
    );

    const columns = useMemo<MRT_ColumnDef<Programacion>[]>(
        () => [
            {
                accessorFn: (row) => `${row.nombreMedico} ${row.apellidoMedico ?? ""}`.trim(),
                id: "medico",
                header: "Médico",
            },
            {
                accessorKey: "nombreConsultorio",
                header: "Consultorio",
            },
            {
                accessorKey: "jornada",
                header: "Jornada",
                size: 90,
                Cell: ({ cell }) => {
                    const jornada = cell.getValue<string>();
                    const esAM = jornada === "AM";
                    return (
                        <Chip
                            label={jornada}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: esAM ? "#1976d2" : "#ed6c02",
                                color: esAM ? "#1976d2" : "#ed6c02",
                                backgroundColor: esAM ? "rgba(25, 118, 210, 0.04)" : "rgba(237, 108, 2, 0.04)",
                                fontWeight: 500,
                            }}
                        />
                    );
                },
            },
            {
                id: "cupos",
                header: "Disponibilidad",
                Cell: ({ row }) => {
                    const ocupados = Number(row.original.cuposOcupados ?? 0);
                    const limite = Number(row.original.limitePacientes ?? 0);
                    const disponibles = row.original.cuposDisponibles !== undefined 
                        ? Number(row.original.cuposDisponibles) 
                        : Math.max(0, limite - ocupados);
                    const estaLleno = disponibles <= 0;

                    if (estaLleno) {
                        return <Chip label={`Lleno (${ocupados}/${limite})`} size="small" color="error" />;
                    }

                    return (
                        <Chip
                            label={`${disponibles} disponibles (${ocupados}/${limite})`}
                            size="small"
                            color={disponibles <= 3 ? "warning" : "success"}
                            variant="outlined"
                        />
                    );
                },
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: programaciones,
        getRowId: (row) => row.codigoProgramacion,
        enableRowSelection: (row) => {
            const ocupados = Number(row.original.cuposOcupados ?? 0);
            const limite = Number(row.original.limitePacientes ?? 0);
            const disponibles = row.original.cuposDisponibles !== undefined 
                ? Number(row.original.cuposDisponibles) 
                : Math.max(0, limite - ocupados);
            return disponibles > 0;
        },
        enableMultiRowSelection: false,
        onRowSelectionChange: (updater) => {
            const next = typeof updater === "function" ? updater(rowSelection) : updater;
            const keys = Object.keys(next).filter((k) => next[k]);
            onSelect(keys[0] ?? null);
        },
        state: {
            isLoading: loading,
            rowSelection,
        },
        localization: {
            ...MRT_Localization_ES,
            noRecordsToDisplay: fetchError ? fetchError : "No hay programaciones disponibles para hoy",
        },
        enableTopToolbar: false,
        enableColumnFilters: false,
        enableGlobalFilter: false,
        enablePagination: false,
        enableBottomToolbar: false,
        muiTablePaperProps: {
            elevation: 0,
            sx: {
                border: "1px solid",
                borderColor: fieldError ? "error.main" : "divider",
                borderRadius: 2,
                overflow: "hidden",
                transition: "border-color 0.2s",
            },
        },
        muiTableContainerProps: { sx: { maxWidth: "100%", overflowX: "auto" } },
        muiTableHeadCellProps: { sx: { bgcolor: "grey.50", fontWeight: 600 } },
        muiTableBodyRowProps: ({ row }) => {
            const ocupados = Number(row.original.cuposOcupados ?? 0);
            const limite = Number(row.original.limitePacientes ?? 0);
            const disponibles = row.original.cuposDisponibles !== undefined 
                ? Number(row.original.cuposDisponibles) 
                : Math.max(0, limite - ocupados);
            const disabled = disponibles <= 0;

            return {
                onClick: () => {
                    if (disabled) return;
                    const isSelected = rowSelection[row.id];
                    onSelect(isSelected ? null : row.id);
                },
                sx: {
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    bgcolor: disabled ? "action.disabledBackground" : "inherit",
                },
            };
        },
    });

    return (
        <Stack spacing={1}>
            {fetchError && <Typography color="error">{fetchError}</Typography>}
            <MaterialReactTable table={table} />
            {fieldError && <Typography color="error">{fieldError}</Typography>}
        </Stack>
    );
}
