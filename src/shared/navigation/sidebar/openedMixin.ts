import type { CSSObject, Theme } from "@mui/material/styles";

export const drawerWidth = 240;

export default function openedMixin(theme: Theme): CSSObject {
  return {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  };
}
