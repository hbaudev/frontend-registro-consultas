import { useContext } from "react";
import { EspecialidadesContext } from "../context/especialidades-context";

export function useEspecialidades() {
  const context = useContext(EspecialidadesContext);
  if (!context) {
    throw new Error("useEspecialidades debe utilizarse dentro de EspecialidadesProvider.");
  }
  return context;
}
