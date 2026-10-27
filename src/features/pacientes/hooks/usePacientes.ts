import { useContext } from "react";
import { PacientesContext } from "../context/pacientes-context";

export function usePacientes() {
  const context = useContext(PacientesContext);
  if (!context) {
    throw new Error("usePacientes debe utilizarse dentro de PacientesProvider.");
  }
  return context;
}
