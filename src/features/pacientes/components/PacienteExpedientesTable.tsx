import { useMemo } from "react";
import { Chip } from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import type { ExpedientePaciente } from "../types/expediente/index";

interface PacienteExpedientesTableProps {
  expedientes: ExpedientePaciente[];
  loading?: boolean;
}

function formatDate(dateValue?: string | Date | null): string {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-NI", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PacienteExpedientesTable({
  expedientes,
  loading = false,
}: PacienteExpedientesTableProps) {
  const columns = useMemo<MRT_ColumnDef<ExpedientePaciente>[]>(
    () => [
      {
        accessorKey: "numeroExpediente",
        header: "No. Expediente",
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>()}
            size="small"
            color="primary"
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
        ),
      },
      {
        accessorKey: "pacienteEspecial",
        header: "Paciente Especial",
        size: 150,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const isEspecial = Boolean(cell.getValue<boolean>());
          return (
            <Chip
              label={isEspecial ? "Sí" : "No"}
              size="small"
              color={isEspecial ? "warning" : "default"}
              variant={isEspecial ? "filled" : "outlined"}
            />
          );
        },
      },
      {
        accessorKey: "autorizadoGerencia",
        header: "Autorizado Gerencia",
        size: 160,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const isAutorizado = Boolean(cell.getValue<boolean>());
          return (
            <Chip
              label={isAutorizado ? "Sí" : "No"}
              size="small"
              color={isAutorizado ? "success" : "default"}
              variant={isAutorizado ? "filled" : "outlined"}
            />
          );
        },
      },
      {
        accessorKey: "fechaCreacion",
        header: "Fecha Creación",
        Cell: ({ cell }) => formatDate(cell.getValue<string | Date>()),
      },
      {
        accessorKey: "registroAnulado",
        header: "Estado",
        size: 120,
        muiTableHeadCellProps: { align: "center" },
        muiTableBodyCellProps: { align: "center" },
        Cell: ({ cell }) => {
          const isAnulado = Boolean(cell.getValue<boolean>());
          return (
            <Chip
              label={isAnulado ? "Anulado" : "Vigente"}
              size="small"
              color={isAnulado ? "error" : "success"}
              variant="outlined"
            />
          );
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: expedientes,
    localization: MRT_Localization_ES,
    getRowId: (row, index) => row.numeroExpediente || `exp-${index}`,
    state: {
      isLoading: loading,
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
  });

  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <MaterialReactTable table={table} />
    </div>
  );
}
