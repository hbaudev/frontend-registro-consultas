import { createContext } from "react";
import type { Especialidad, EspecialidadesPage } from "../types/especialidades/index";

export type EspecialidadesStatus = "loading" | "ready" | "error";

export interface EspecialidadesContextValue {
  especialidades: Especialidad[];
  catalogoEspecialidades: Especialidad[];
  paginacion: EspecialidadesPage["paginacion"];
  busqueda: string;
  pagina: number;
  tamanioPagina: number;
  status: EspecialidadesStatus;
  catalogoLoading: boolean;
  error: string | null;
  catalogoError: string | null;
  buscar: (busqueda: string) => void;
  cambiarPagina: (pagina: number) => void;
  cambiarTamanioPagina: (tamanioPagina: number) => void;
  reload: () => void;
  cargarCatalogo: () => Promise<Especialidad[]>;
}

export const EspecialidadesContext = createContext<EspecialidadesContextValue | undefined>(undefined);
