import { useState } from "react";
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import type { Filial } from "../types/filiales/index";

interface FilialesTableProps {
  filiales: Filial[];
  loading?: boolean;
  onEdit?: (filial: Filial) => void;
  onAnnul?: (filial: Filial) => void;
}

function formatDate(value: Filial["fechaCreacion"]): string {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "N/A"
    : new Intl.DateTimeFormat("es-NI", { dateStyle: "medium" }).format(date);
}

export default function FilialesTable({
  filiales,
  loading = false,
  onEdit,
  onAnnul,
}: FilialesTableProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedFilial, setSelectedFilial] = useState<Filial | null>(null);

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedFilial(null);
  };

  return (
    <>
      <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: "100%" }}>
        <Table size="small" aria-label="Filiales">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>{"C\u00f3digo"}</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Creada</TableCell>
              <TableCell>Creada por</TableCell>
              <TableCell align="right" sx={{ width: 56 }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} aria-label="Cargando filiales" />
                </TableCell>
              </TableRow>
            ) : filiales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No hay filiales para mostrar.
                </TableCell>
              </TableRow>
            ) : filiales.map((filial) => (
              <TableRow key={filial.filialId} hover>
                <TableCell>{filial.codigoFilial}</TableCell>
                <TableCell>{filial.nombreFilial}</TableCell>
                <TableCell>{formatDate(filial.fechaCreacion)}</TableCell>
                <TableCell>{filial.nombreCompletoCreador || filial.creadoPorUsuario || "N/A"}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Opciones">
                    <IconButton
                      aria-label={`Opciones de ${filial.nombreFilial}`}
                      aria-haspopup="menu"
                      onClick={(event) => {
                        setMenuAnchor(event.currentTarget);
                        setSelectedFilial(filial);
                      }}
                      size="small"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            if (selectedFilial) onEdit?.(selectedFilial);
            closeMenu();
          }}
        >
          <EditOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedFilial) onAnnul?.(selectedFilial);
            closeMenu();
          }}
        >
          <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
          Anular
        </MenuItem>
      </Menu>
    </>
  );
}
