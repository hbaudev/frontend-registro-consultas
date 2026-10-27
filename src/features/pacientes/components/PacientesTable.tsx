import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import type { Paciente } from "../types/pacientes/index";
import PacientesActionMenu from "./PacientesActionMenu";

interface PacientesTableProps {
  pacientes: Paciente[];
  loading: boolean;
  onView?: (paciente: Paciente) => void;
  onViewExpediente?: (paciente: Paciente) => void;
  onEdit?: (paciente: Paciente) => void;
  onDelete?: (paciente: Paciente) => void;
}

export default function PacientesTable({
  pacientes,
  loading,
  onView,
  onViewExpediente,
  onEdit,
  onDelete,
}: PacientesTableProps) {
  const columns = useMemo<MRT_ColumnDef<Paciente>[]>(
    () => [
      {
        id: "nombreCompleto",
        header: "Paciente",
        accessorFn: (row) => `${row.nombres} ${row.apellidos}`.trim(),
      },
      {
        accessorKey: "numeroInss",
        header: "INSS",
        Cell: ({ cell }) => cell.getValue<number | null>() ?? "—",
      },
      {
        accessorKey: "numeroCedula",
        header: "Cédula",
        Cell: ({ cell }) => cell.getValue<string | null>() || "—",
      },
      {
        accessorKey: "telefono",
        header: "Teléfono",
        Cell: ({ cell }) => cell.getValue<string | null>() || "—",
      },
      {
        accessorKey: "empresa",
        header: "Empresa",
        Cell: ({ cell }) => cell.getValue<string | null>() || "—",
      },
      {
        accessorKey: "tipoSeguro",
        header: "Tipo de seguro",
        Cell: ({ cell }) => cell.getValue<string | null>() || "—",
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: pacientes,
    localization: MRT_Localization_ES,
    getRowId: (row, index) => row.numeroCedula || `paciente-${index}`,
    state: {
      isLoading: loading,
    },
    enableRowActions: true,
    positionActionsColumn: "last",
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Acciones",
        size: 80,
      },
    },
    renderRowActions: ({ row }) => (
      <PacientesActionMenu
        paciente={row.original}
        onView={onViewExpediente ?? onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
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
  });

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <MaterialReactTable table={table} />
    </div>
  );
}
