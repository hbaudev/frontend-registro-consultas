import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "../features/auth/providers/AuthProvider";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import SessionRenewalPrompt from "../features/auth/components/SessionRenewalPrompt";
import MainLayout from "../shared/layouts/MainLayout";
import Login from "../features/auth/pages/Login";
import Consultas from "../features/consultas/pages/Consultas";
import Pacientes from "../features/pacientes/pages/Pacientes";
import Perfil from "../features/perfil/pages/Perfil";
import Personal from "../features/personal/pages/Personal";
import Especialidades from "../features/especialidades/pages/Especialidades";
import Configuracion from "../features/filiales/pages/Configuracion";
import Turnos from "../features/turnos/pages/Turnos";
import Medicos from "../features/medicos/pages/Medicos";
import ProgramacionConsultas from "../features/programacion/pages/Programacion";
import Consultorios from "../features/consultorios/pages/Consultorios";

const theme = createTheme({
  palette: { mode: "light", primary: { main: "#1976d2" } },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route
                  path="/"
                  element={<Navigate to="/consultas" replace />}
                />
                <Route path="/consultas" element={<Consultas />} />
                <Route path="/pacientes" element={<Pacientes />} />
                <Route path="/personal-enfermeria" element={<Personal />} />
                <Route path="/personal-medico" element={<Medicos />} />
                <Route path="/especialidades" element={<Especialidades />} />
                <Route path="/locaciones" element={<Configuracion />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/programacion-consultas" element={<ProgramacionConsultas />} />
                <Route path="/consultorios" element={<Consultorios />} />
              </Route>

              <Route path="/turnos" element={<Turnos />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <SessionRenewalPrompt />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
