import { useContext } from "react";
import { MedicosContext } from "../context/medicos-context";

export function useMedicos() {
    const context = useContext(MedicosContext);
    if (context === undefined) {
        throw new Error("useMedicos debe ser usado dentro de MedicosProvider");
    }
    return context;
}