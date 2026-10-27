import { useAuth } from "../../features/auth/hooks/useAuth";
import { Avatar, Box, ButtonBase, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBarPopMenu from "./AppBarPopMenu";
import React from "react";

interface MainAppBarProps {
  onOpenNavigation: () => void;
}

export default function MainAppBar({ onOpenNavigation }: MainAppBarProps) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const id = React.useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const fullName = `${firstName} ${lastName}`.trim();
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <Box
      component="header"
      sx={{
        boxSizing: "border-box",
        minHeight: { xs: 56, sm: 64 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        px: { xs: 1, sm: 2.5 },
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 1px 4px rgba(15, 23, 42, 0.06)",
        position: "relative",
        zIndex: (currentTheme) => currentTheme.zIndex.appBar,
      }}
    >
      {isMobile && (
        <IconButton
          aria-label="Abrir navegación"
          onClick={onOpenNavigation}
          edge="start"
          sx={{ color: "text.secondary" }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box sx={{ flex: 1 }} />
      <ButtonBase
        id={buttonId}
        aria-controls={open ? menuId : undefined}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          textAlign: "right",
          borderRadius: 2,
          py: 0.5,
          px: 0.75,
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.primary"
            noWrap
            sx={{ maxWidth: { xs: 150, sm: 240 }, fontWeight: 500 }}
          >
            {fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.role ?? ""}
          </Typography>
        </Box>
        <Avatar
          sx={{
            width: { xs: 34, sm: 38 },
            height: { xs: 34, sm: 38 },
            bgcolor: "primary.main",
            fontSize: 14,
          }}
        >
          {initials}
        </Avatar>
      </ButtonBase>
      <AppBarPopMenu
        id={menuId}
        labelledBy={buttonId}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      />
    </Box>
  );
}