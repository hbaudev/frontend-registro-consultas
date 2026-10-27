import { useContext } from "react";
import { FilialesContext } from "../context/filiales-context";

export function useFiliales() {
  const context = useContext(FilialesContext);
  if (!context) {
    throw new Error("useFiliales debe utilizarse dentro de FilialesProvider.");
  }
  return context;
}
