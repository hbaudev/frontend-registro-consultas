import { useMemo } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import type { Medico } from "../types/medicos/index";
import MedicosActionMenu from "./MedicosActionMenu";

interface MedicosTableProps {
    medicos: Medico[];
    loading: boolean;
    onView?: (medico: Medico) => void;
    onEdit?: (medico: Medico) => void;
    onDelete?: (medico: Medico) => void;
}

export default function MedicosTable({
    medicos,
    loading,
    onView,
    onEdit,
    onDelete,
}: MedicosTableProps) {
    const columns = useMemo<MRT_ColumnDef<Medico>[]>(
        () => [
            {
                accessorKey: "codigoMinsa",
                header: "Código MINSA",
                size: 150,
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                size: 200,
            },
            {
                accessorKey: "apellido",
                header: "Apellido",
                size: 200,
            },
            {
                accessorKey: "nombreEspecialidad",
                header: "Especialidad",
                size: 180,
                Cell: ({ row }) => row.original.nombreEspecialidad || row.original.codigoEspecialidad || "Sin asignar",
            },
            {
                accessorKey: "telefono",
                header: "Teléfono",
                size: 150,
            },
            {
                accessorKey: "cedula",
                header: "Cedula",
                size: 150,
            },
            {
                accessorKey: "disponibilidad",
                header: "Disponibilidad",
                size: 150,
                Cell: ({ cell }) => {
                    const value = cell.getValue<boolean | undefined>();
                    return value !== undefined
                        ? value
                            ? "Disponible"
                            : "No disponible"
                        : "";
                },
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data: medicos,
        getRowId: (row, index) => row.codigoMinsa || `medico-${index}`,
        state: {
            isLoading: loading,
        },
        localization: MRT_Localization_ES,
        enableRowActions: true,
        positionActionsColumn: "last",
        displayColumnDefOptions: {
            "mrt-row-actions": {
                header: "Acciones",
                size: 80,
            },
        },
        renderRowActions: ({ row }) => {
            const medico = row.original;
            return (
                <MedicosActionMenu
                    medico={medico}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            );
        },
        enablePagination: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        muiTablePaperProps: {
            elevation: 0,
            variant: "outlined",
            sx: {
                minWidth: 0,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
            },
        },
        muiTableContainerProps: {
            sx: {
                maxWidth: "100%",
                overflowX: "auto",
            },
        },
        muiTableHeadCellProps: {
            sx: {
                bgcolor: "grey.50",
                fontWeight: 600,
            },
        },
    })

    return (
        <div style={{ width: "100%", minWidth: 0 }}>
            <MaterialReactTable table={table} />
        </div>
    )

}