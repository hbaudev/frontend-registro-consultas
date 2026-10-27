import { useContext } from "react";
import { ConsultoriosContext } from "../context/consultorios-context";

export function useConsultorios() {
    const context = useContext(ConsultoriosContext);
    if (!context) {
        throw new Error("useConsultorios debe utilizarse dentro de ConsultoriosProvider.");
    }
    return context;
}