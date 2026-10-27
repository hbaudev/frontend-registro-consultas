import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from "../../features/auth/hooks/useAuth";

interface AppBarPopMenuProps {
  id: string;
  labelledBy: string;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

export default function AppBarPopMenu({
  id,
  labelledBy,
  anchorEl,
  open,
  onClose,
}: AppBarPopMenuProps) {
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("No se pudo cerrar la sesión en el servidor.", error);
    } finally {
      onClose();
    }
  }

  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            minWidth: 190,
            mt: 1,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.14)",
          },
        },
        list: {
          'aria-labelledby': labelledBy,
          sx: { py: 0.75 },
        },
      }}
    >
      <MenuItem onClick={() => void handleLogout()} sx={{ gap: 1, py: 1 }}>
        <ListItemIcon sx={{ minWidth: "unset", color: "text.secondary" }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Cerrar sesión" />
      </MenuItem>
    </Menu>
  );
}
