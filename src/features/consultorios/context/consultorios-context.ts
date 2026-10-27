import { createContext } from "react";
import type { Consultorio, ConsultoriosPage } from "../types/consultorios/index";

export type ConsultoriosStatus = "loading" | "ready" | "error";

export interface ConsultoriosContextValue {
    consultorios: Consultorio[];
    catalogoConsultorios: Consultorio[];
    catalogoLoading: boolean;
    catalogoError: string | null;
    paginacion: ConsultoriosPage["paginacion"];
    busqueda: string;
    codigoAreaMedica: string;
    pagina: number;
    tamanioPagina: number;
    status: ConsultoriosStatus;
    error: string | null;
    buscar: (busqueda: string) => void;
    cambiarPagina: (pagina: number) => void;
    cambiarTamanioPagina: (tamanioPagina: number) => void;
    reload: () => void;
    cargarCatalogo: () => Promise<Consultorio[]>;
}

export const ConsultoriosContext = createContext<ConsultoriosContextValue | undefined>(undefined);
