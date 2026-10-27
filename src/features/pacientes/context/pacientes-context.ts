import { createContext } from "react";
import type { TipoAfiliado } from "../../afiliados/services/ipss-api";
import type { Paciente, PacientesPage } from "../types/pacientes/index";
import type { ExpedientePaciente } from "../types/expediente/index";

export type PacientesStatus = "loading" | "ready" | "error";

export interface PacientesContextValue {
  pacientes: Paciente[];
  paginacion: PacientesPage["paginacion"];
  busqueda: string;
  tipoSeguroId: number | null;
  tiposAfiliados: TipoAfiliado[];
  pagina: number;
  tamanioPagina: number;
  status: PacientesStatus;
  tiposStatus: PacientesStatus;
  error: string | null;
  tiposError: string | null;
  buscar: (busqueda: string) => void;
  cambiarTipoSeguro: (tipoSeguroId: number | null) => void;
  cambiarPagina: (pagina: number) => void;
  cambiarTamanioPagina: (tamanioPagina: number) => void;
  reload: () => void;
  reloadTipos: () => void;
  buscarPacientePorInss: (numeroInss: string) => Promise<Paciente | null>;
  obtenerExpedientePacientePorInss: (numeroInss: string) => Promise<ExpedientePaciente[]>;
}

export const PacientesContext = createContext<PacientesContextValue | undefined>(undefined);
