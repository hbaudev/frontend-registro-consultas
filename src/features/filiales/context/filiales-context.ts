import { createContext } from "react";
import type { Filial, FilialInput } from "../types/filiales/index";

export type FilialesStatus = "loading" | "ready" | "error";

export interface FilialesContextValue {
  filiales: Filial[];
  status: FilialesStatus;
  error: string | null;
  reload: () => Promise<void>;
  createFilial: (input: FilialInput) => Promise<number>;
  updateFilial: (filialId: number, input: FilialInput) => Promise<void>;
  annulFilial: (filialId: number) => Promise<void>;
}

export const FilialesContext = createContext<FilialesContextValue | undefined>(undefined);
