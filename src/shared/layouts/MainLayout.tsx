import { Box } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import MainSidebar from "../components/MainSidebar";
import MainAppBar from "../components/MainAppbar";
import { FilialesProvider } from "../../features/filiales/providers/FilialesProvider";
import { EspecialidadesProvider } from "../../features/especialidades/providers/EspecialidadesProvider";
import { PacientesProvider } from "../../features/pacientes/providers/PacientesProvider";
import { MedicosProvider } from "../../features/medicos/providers/MedicosProvider";
import { ConsultoriosProvider } from "../../features/consultorios/providers/ConsultoriosProvider";

export default function MainLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <FilialesProvider>
      <EspecialidadesProvider>
        <PacientesProvider>
          <MedicosProvider>
            <ConsultoriosProvider>
              <Box sx={{ minHeight: "100dvh", display: "flex", width: "100%" }}>
                <MainSidebar
                  mobileOpen={mobileNavigationOpen}
                  onMobileClose={() => setMobileNavigationOpen(false)}
                />

                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <MainAppBar onOpenNavigation={() => setMobileNavigationOpen(true)} />

                  <Box
                    component="main"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      p: { xs: 1.5, sm: 2.5 },
                      bgcolor: "grey.50",
                    }}
                  >
                    <Outlet />
                  </Box>
                </Box>
              </Box>
            </ConsultoriosProvider>
          </MedicosProvider>
        </PacientesProvider>
      </EspecialidadesProvider>
    </FilialesProvider>
  );
}
