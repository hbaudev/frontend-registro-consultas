import { Chip, Stack } from "@mui/material";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowSelectionState,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import type { PacienteExpediente } from "../../pacientes/types/pacientes";
import { useMemo } from "react";

interface PacientesPickerProps {
    pacientes: PacienteExpediente[];
    selected: string | null;
    onSelect: (key: string | null) => void;
    pacienteInss: string;
    error?: string;
}

export default function PacientesPicker({ pacientes, selected, onSelect, pacienteInss, error: fieldError }: PacientesPickerProps) {
    const rowSelection = useMemo<MRT_RowSelectionState>(
        () => (selected ? { [selected]: true } : {}),
        [selected]
    )

    console.log({ selected })

    const columns = useMemo<MRT_ColumnDef<PacienteExpediente>[]>(
        () => [
            {
                accessorFn: (row) => `${row.nombres} ${row.apellidos}`.trim(),
                id: "nombreCompleto",
                header: "Paciente",
                Cell: ({ row, cell }) => {
                    const esTitular = row.original.numeroInss === Number(pacienteInss);
                    return (
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <span style={{ fontWeight: esTitular ? "600" : "400", color: esTitular ? "#0460acff" : "#333333" }}>{cell.getValue<string>()}</span>
                        </Stack>
                    )
                },
            },
            {
                accessorKey: "numeroInss",
                header: "Numero Inss",
                Cell: ({ cell }) => cell.getValue<string | null>() ?? "-"
            },
            {
                accessorKey: "tipoSeguro",
                header: "Tipo de seguro"
            },
            {
                accessorKey: "numeroExpediente",
                header: "Expediente",
                Cell: ({ cell }) => cell.getValue<number | null>() ?? "Sin expediente"
            },
            {
                accessorKey: "pacienteEspecial",
                header: "Condicion Especial",
                Cell: ({ cell }) => {
                    const esEspecial = cell.getValue<boolean | null>() ?? false;
                    return (
                        <Chip
                            label={esEspecial ? "Sí" : "No"}
                            color={esEspecial ? "success" : "default"}
                            size="small"
                            variant={esEspecial ? "filled" : "outlined"}
                        />
                    );
                }
            },
            {
                accessorKey: "autorizadoGerencia",
                header: "Autorizado p. Gerencia",
                Cell: ({ cell }) => {
                    const autorizado = cell.getValue<boolean | null>() ?? false;
                    return (
                        <Chip
                            label={autorizado ? "Sí" : "No"}
                            color={autorizado ? "success" : "default"}
                            size="small"
                            variant={autorizado ? "filled" : "outlined"}
                        />
                    );
                }
            }
        ],
        [pacienteInss]
    )

    function getPacienteRowId(p: PacienteExpediente, index?: number): string {
        if (p.numeroCedula) return p.numeroCedula;
        return `${p.numeroInss}-${p.numeroExpediente ?? "sin-exp"}-${p.nombres}-${p.apellidos}-${index ?? 0}`;
    }

    const table = useMaterialReactTable({
        columns,
        data: pacientes,
        getRowId: (row, index) => getPacienteRowId(row, index),
        enableRowSelection: true,
        enableMultiRowSelection: false,
        onRowSelectionChange: (updater) => {
            const next = typeof updater === "function" ? updater(rowSelection) : updater;
            const keys = Object.keys(next).filter((k) => next[k]);
            onSelect(keys[0] ?? null);
        },
        state: {
            rowSelection,
        },
        localization: {
            ...MRT_Localization_ES,
            noRecordsToDisplay: "No hay pacientes disponibles para este afiliado"
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
                transition: "border-color 0.2s"
            }
        },
        muiTableContainerProps: { sx: { maxWidth: "100%", overflowX: "auto" } },
        muiTableHeadCellProps: { sx: { bgcolor: "grey.50", fontWeight: 600 } },
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                const isSelected = rowSelection[row.id];
                onSelect(isSelected ? null : row.id);
            },
            sx: { cursor: "pointer" }
        })
    })

    console.log({ pacientes })

    return (
        <Stack spacing={1}>
            <MaterialReactTable table={table} />
        </Stack>
    )
}