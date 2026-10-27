import { createContext } from "react";
import type { Medico, MedicosPage } from "../types/medicos/index";

export type MedicosStatus = "loading" | "ready" | "error";

export interface MedicosContextValue {
    medicos: Medico[];
    catalogoMedicos: Medico[];
    catalogoLoading: boolean;
    catalogoError: string | null;
    paginacion: MedicosPage["paginacion"];
    busqueda: string;
    codigoEspecialidad: string | null;
    disponibilidad: boolean | null;
    pagina: number;
    tamanioPagina: number;
    status: MedicosStatus;
    error: string | null;
    buscar: (busqueda: string) => void;
    cambiarCodigoEspecialidad: (codigoEspecialidad: string | null) => void;
    cambiarDisponibilidad: (disponibilidad: boolean | null) => void;
    cambiarPagina: (pagina: number) => void;
    cambiarTamanioPagina: (tamanioPagina: number) => void;
    reload: () => void;
    cargarCatalogo: () => Promise<Medico[]>;
}

export const MedicosContext = createContext<MedicosContextValue | undefined>(undefined);