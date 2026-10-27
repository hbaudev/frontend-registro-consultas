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
import type { Medico } from "../types/medicos/index";

export interface MedicosActionMenuProps {
    medico: Medico;
    onView?: (medico: Medico) => void;
    onEdit?: (medico: Medico) => void;
    onDelete?: (medico: Medico) => void;
}

export default function MedicosActionMenu({ medico, onView, onEdit, onDelete }: MedicosActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action?: (medico: Medico) => void) => {
        handleClose();
        if (action) {
            action(medico);
        }
    };

    return (
        <>
            <Tooltip title="Opciones">
                <IconButton
                    size="small"
                    aria-label={`Opciones de ${medico.nombre} ${medico.apellido}`}
                    aria-controls={open ? `menu-${medico.codigoMinsa ?? "medico"}` : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Menu
                id={`menu-${medico.codigoMinsa ?? "medico"}`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={() => handleAction(onView)}>
                    <ListItemIcon>
                        <VisibilityOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver Especialidades</ListItemText>
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