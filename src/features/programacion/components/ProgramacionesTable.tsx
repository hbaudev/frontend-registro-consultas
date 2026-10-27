import { useMemo } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_PaginationState,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Alert, Box, Button } from "@mui/material";
import type { Programacion } from "../types/programaciones/index";

interface ProgramacionesTableProps {
    programaciones: Programacion[];
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    rowCount: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    onRetry: () => void;
}

function formatDate(value: Date | string): string {
    const date = typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

export default function ProgramacionesTable({
    programaciones,
    loading,
    error,
    page,
    pageSize,
    rowCount,
    onPageChange,
    onPageSizeChange,
    onRetry,
}: ProgramacionesTableProps) {
    const columns = useMemo<MRT_ColumnDef<Programacion>[]>(
        () => [
            {
                accessorKey: "fecha",
                header: "Fecha",
                Cell: ({ cell }) => formatDate(cell.getValue<Date | string>()),
            },
            {
                accessorFn: (row) => `${row.nombreMedico} ${row.apellidoMedico ?? ""}`.trim(),
                id: "nombreMedico",
                header: "Médico",
            },
            {
                accessorKey: "nombreConsultorio",
                header: "Consultorio",
            },
            {
                accessorKey: "jornada",
                header: "Jornada",
            },
            {
                accessorKey: "limitePacientes",
                header: "Límite de pacientes",
                muiTableBodyCellProps: { align: "right" },
                muiTableHeadCellProps: { align: "right" },
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: programaciones,
        getRowId: (row) => row.codigoProgramacion,
        rowCount,
        manualPagination: true,
        onPaginationChange: (updater) => {
            const current: MRT_PaginationState = { pageIndex: page - 1, pageSize };
            const next = typeof updater === "function" ? updater(current) : updater;
            if (next.pageSize !== current.pageSize) onPageSizeChange(next.pageSize);
            else if (next.pageIndex !== current.pageIndex) onPageChange(next.pageIndex + 1);
        },
        state: {
            isLoading: loading,
            pagination: { pageIndex: page - 1, pageSize },
        },
        localization: {
            ...MRT_Localization_ES,
            noRecordsToDisplay: error ? "Error al cargar programaciones" : "No hay programaciones que coincidan con los filtros",
        },
        enableTopToolbar: false,
        enableColumnFilters: false,
        enableGlobalFilter: false,
        muiTablePaperProps: {
            elevation: 0,
            variant: "outlined",
            sx: {
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: "none",
            },
        },
        muiTableContainerProps: {
            sx: { maxWidth: "100%", overflowX: "auto" },
        },
        muiTableHeadCellProps: {
            sx: { bgcolor: "grey.50", fontWeight: 600 },
        },
    });

    return (
        <Box sx={{ minWidth: 0 }}>
            {error && (
                <Alert
                    severity="error"
                    action={<Button color="inherit" size="small" onClick={onRetry}>Reintentar</Button>}
                    sx={{ mb: 1 }}
                >
                    {error}
                </Alert>
            )}
            <MaterialReactTable table={table} />
        </Box>
    );
}
