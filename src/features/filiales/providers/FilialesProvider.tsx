import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FilialesContext } from "../context/filiales-context";
import { ApiError } from "../../../shared/lib/api";
import { deleteFilial, getFiliales, postFilial, putFilial } from "../services/filiales-api";
import type { Filial, FilialInput } from "../types/filiales/index";

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "No se pudieron cargar las filiales.";
}

export function FilialesProvider({ children }: { children: ReactNode }) {
  const [filiales, setFiliales] = useState<Filial[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const reload = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setStatus("loading");
    setError(null);
    try {
      const result = await getFiliales();
      if (requestId === requestIdRef.current) {
        setFiliales(result);
        setStatus("ready");
      }
    } catch (requestError) {
      if (requestId === requestIdRef.current) {
        setError(getErrorMessage(requestError));
        setStatus("error");
      }
      throw requestError;
    }
  }, []);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    let active = true;

    void getFiliales()
      .then((result) => {
        if (!active || requestId !== requestIdRef.current) return;
        setFiliales(result);
        setStatus("ready");
      })
      .catch((requestError: unknown) => {
        if (!active || requestId !== requestIdRef.current) return;
        setError(getErrorMessage(requestError));
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  const createFilial = useCallback(async (input: FilialInput) => {
    const result = await postFilial(input);
    await reload();
    return result.filialId;
  }, [reload]);

  const updateFilial = useCallback(async (filialId: number, input: FilialInput) => {
    await putFilial(filialId, input);
    await reload();
  }, [reload]);

  const annulFilial = useCallback(async (filialId: number) => {
    await deleteFilial(filialId);
    await reload();
  }, [reload]);

  const value = useMemo(() => ({
    filiales,
    status,
    error,
    reload,
    createFilial,
    updateFilial,
    annulFilial,
  }), [filiales, status, error, reload, createFilial, updateFilial, annulFilial]);

  return <FilialesContext.Provider value={value}>{children}</FilialesContext.Provider>;
}
