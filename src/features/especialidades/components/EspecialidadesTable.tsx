import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Especialidad } from "../types/especialidades/index";

interface EspecialidadesTableProps {
  especialidades: Especialidad[];
  loading?: boolean;
}

export default function EspecialidadesTable({ especialidades, loading = false }: EspecialidadesTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: "100%" }}>
      <Table size="small" aria-label="Especialidades médicas">
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell>Código</TableCell>
            <TableCell>Nombre de la especialidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={2} align="center" sx={{ py: 4 }}><CircularProgress size={24} aria-label="Cargando especialidades" /></TableCell></TableRow>
          ) : especialidades.length === 0 ? (
            <TableRow><TableCell colSpan={2} align="center" sx={{ py: 4, color: "text.secondary" }}>No hay especialidades que coincidan con la búsqueda.</TableCell></TableRow>
          ) : especialidades.map((especialidad) => (
            <TableRow key={especialidad.especialidadId} hover>
              <TableCell>{especialidad.codigoEspecialidad || "—"}</TableCell>
              <TableCell>{especialidad.nombreEspecialidad}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
