import * as React from "react";
import { NavLink } from "react-router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "../navigation/sidebar/Drawer.tsx";
import DrawerHeader from "../navigation/sidebar/DrawerHeader.tsx";
import {
  configurationMenuOptions,
  primaryMenuOptions,
  type MenuOption,
} from "../navigation/sidebar/menuOptions.ts";

interface MainSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function MainSidebar({ mobileOpen, onMobileClose }: MainSidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [desktopOpen, setDesktopOpen] = React.useState(false);
  const drawerOpen = isMobile ? mobileOpen : desktopOpen;

  const handleDrawerToggle = () => {
    if (isMobile) {
      onMobileClose();
      return;
    }
    setDesktopOpen((current) => !current);
  };

  const renderOptions = (options: MenuOption[]) => options.map(({ label, path, icon: Icon }) => (
    <ListItem key={path} disablePadding sx={{ display: "block" }}>
      <Tooltip title={drawerOpen ? "" : label} placement="right">
        <ListItemButton
          component={NavLink}
          to={path}
          onClick={isMobile ? onMobileClose : undefined}
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: drawerOpen ? "initial" : "center",
            color: "text.primary",
            "&.active": {
              color: "primary.main",
              bgcolor: "action.selected",
            },
            "&.active .MuiListItemIcon-root": { color: "primary.main" },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
              mr: drawerOpen ? 3 : "auto",
              color: "inherit",
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} sx={{ opacity: drawerOpen ? 1 : 0 }} />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  ));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
      >
        <DrawerHeader>
          <IconButton
            aria-label={isMobile ? "Cerrar navegación" : desktopOpen ? "Contraer navegación" : "Expandir navegación"}
            onClick={handleDrawerToggle}
          >
            {isMobile ? (
              <CloseIcon />
            ) : theme.direction === "rtl" ? (
              desktopOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />
            ) : (
              desktopOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>{renderOptions(primaryMenuOptions)}</List>
        {configurationMenuOptions.length > 0 && (
          <>
            <Divider />
            <List>{renderOptions(configurationMenuOptions)}</List>
          </>
        )}
      </Drawer>
    </Box>
  );
}
