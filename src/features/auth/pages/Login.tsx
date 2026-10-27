import { Box, CircularProgress } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";
import "./Login.css";

type LocationState = { from?: { pathname?: string } };

export default function Login() {
  const { status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = (location.state as LocationState | null)?.from?.pathname ?? "/consultas";

  if (status === "authenticated") return <Navigate to="/consultas" replace />;

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-brand" aria-labelledby="login-brand-title">
          <div className="login-brand__logo">
            <img src="/logo-hb.png" alt="Hospital Bautista, fundado en 1930" />
          </div>
          <div className="login-brand__copy">
            <h2 id="login-brand-title">
              Registro de consultas
            </h2>
          </div>
          <p className="login-brand__footer">Hospital Bautista · Fundado en 1930</p>
        </section>

        <div className="login-divider" aria-hidden="true" />

        <section className="login-access" aria-labelledby="login-title">
          <div className="login-access__heading">
            <h2 id="login-title">Iniciar sesión</h2>
          </div>
          {status === "loading" ? (
            <Box className="login-loading" role="status" aria-label="Verificando sesión">
              <CircularProgress sx={{ color: "white" }} />
            </Box>
          ) : (
            <LoginForm onSuccess={() => navigate(from, { replace: true })} />
          )}
          
          <a href="" type="email" className="login-access__help">¿Tienes un problema? Contacta con soporte.</a>
        </section>
      </div>
      <p className="login-page__copyright">© Hospital Bautista</p>
    </main>
  );
}
