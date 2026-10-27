import { createContext } from "react";
import type {
    CrearProgramacionInput,
    Programacion,
    ProgramacionCreada,
    ProgramacionesPage,
} from "../types/programaciones/index";

export type ProgramacionStatus = "loading" | "ready" | "error";

export interface ProgramacionContextValue {
    programaciones: Programacion[];
    fechaProgramacion: Date | null;
    codigoMinsaMedico: string;
    numeroConsultorio: string;
    paginacion: ProgramacionesPage["paginacion"];
    pagina: number;
    tamanioPagina: number;
    status: ProgramacionStatus;
    error: string | null;
    reload: () => void;
    crearProgramacion: (input: CrearProgramacionInput) => Promise<ProgramacionCreada>;
    cambiarPagina: (pagina: number) => void;
    cambiarTamanioPagina: (tamanioPagina: number) => void;
    cambiarFechaProgramacion: (fecha: Date | null) => void;
    cambiarCodigoMinsaMedico: (codigo: string) => void;
    cambiarNumeroConsultorio: (numero: string) => void;
}

export const ProgramacionContext = createContext<ProgramacionContextValue | undefined>(undefined);