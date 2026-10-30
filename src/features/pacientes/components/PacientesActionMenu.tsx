import { useState, type MouseEvent } from "react";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import type { Paciente } from "../types/pacientes/index";

export interface PacientesActionMenuProps {
  paciente: Paciente;
  onRegister?: (paciente: Paciente) => void;
  onView?: (paciente: Paciente) => void;
  onEdit?: (paciente: Paciente) => void;
  onDelete?: (paciente: Paciente) => void;
}

export default function PacientesActionMenu({
  paciente,
  onRegister,
  onView,
  onEdit,
  onDelete,
}: PacientesActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action?: (paciente: Paciente) => void) => {
    handleClose();
    console.log(paciente, 'paciente')
    if (action) {
      action(paciente);
    }
  };

  return (
    <>
      <Tooltip title="Opciones">
        <IconButton
          size="small"
          aria-label={`Opciones de ${paciente.nombres} ${paciente.apellidos}`}
          aria-controls={open ? `menu-${paciente.numeroCedula ?? "paciente"}` : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        id={`menu-${paciente.numeroCedula ?? "paciente"}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleAction(onRegister)}>
          <ListItemIcon>
            <LocalHospitalIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Registrar Consulta</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(onView)}>
          <ListItemIcon>
            <VisibilityOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver Expediente</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(onEdit)}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => handleAction(onDelete)}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
