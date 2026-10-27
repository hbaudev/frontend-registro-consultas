import { useContext } from "react";
import { ProgramacionContext } from "../context/programacion-context";

export function useProgramaciones() {
    const context = useContext(ProgramacionContext);
    if (!context) {
        throw new Error("useProgramaciones debe utilizarse dentro de ProgramacionProvider.");
    }
    return context;
}
