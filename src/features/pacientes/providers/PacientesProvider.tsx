import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { PacientesContext, type PacientesStatus } from "../context/pacientes-context";
import { ApiError } from "../../../shared/lib/api";
import { getTiposAfiliados, type TipoAfiliado } from "../../afiliados/services/ipss-api";
import { getPacientes, getPacienteExpedienteByInss } from "../services/pacientes-api";
import type { Paciente, PacientesPage } from "../types/pacientes/index";
import type { ExpedientePaciente } from "../types/expediente/index";

const DEFAULT_PAGE_SIZE = 10;

interface PacientesRequestState {
  key: string | null;
  status: PacientesStatus;
  data: PacientesPage;
  error: string | null;
}

interface TiposAfiliadosRequestState {
  key: number | null;
  status: PacientesStatus;
  data: TipoAfiliado[];
  error: string | null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function PacientesProvider({ children }: { children: ReactNode }) {
  const [pacientesRequest, setPacientesRequest] = useState<PacientesRequestState>({
    key: null,
    status: "loading",
    data: {
      pacientes: [],
      paginacion: {
        pagina: 1,
        tamanioPagina: DEFAULT_PAGE_SIZE,
        totalRegistros: 0,
        totalPaginas: 0,
      },
    },
    error: null,
  });
  const [tiposRequest, setTiposRequest] = useState<TiposAfiliadosRequestState>({
    key: null,
    status: "loading",
    data: [],
    error: null,
  });
  const [busqueda, setBusqueda] = useState("");
  const [tipoSeguroId, setTipoSeguroId] = useState<number | null>(null);
  const [pagina, setPagina] = useState(1);
  const [tamanioPagina, setTamanioPagina] = useState(DEFAULT_PAGE_SIZE);
  const [refreshToken, setRefreshToken] = useState(0);
  const [tiposRefreshToken, setTiposRefreshToken] = useState(0);
  const pacientesRequestKey = JSON.stringify([busqueda, tipoSeguroId, pagina, tamanioPagina, refreshToken]);
  const tiposRequestKey = tiposRefreshToken;
  const isCurrentPacientesRequest = pacientesRequest.key === pacientesRequestKey;
  const isCurrentTiposRequest = tiposRequest.key === tiposRequestKey;

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => getPacientes({
        busqueda: busqueda || undefined,
        tipoSeguroId: tipoSeguroId ?? undefined,
        pagina,
        tamanioPagina,
      }, controller.signal))
      .then((result) => {
        if (controller.signal.aborted) return;
        setPacientesRequest({
          key: pacientesRequestKey,
          status: "ready",
          data: result,
          error: null,
        });
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setPacientesRequest((current) => ({
          ...current,
          key: pacientesRequestKey,
          status: "error",
          error: getErrorMessage(requestError, "No se pudieron cargar los pacientes."),
        }));
      });
    return () => controller.abort();
  }, [busqueda, tipoSeguroId, pagina, tamanioPagina, refreshToken, pacientesRequestKey]);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => getTiposAfiliados(controller.signal))
      .then((result) => {
        if (controller.signal.aborted) return;
        setTiposRequest({
          key: tiposRequestKey,
          status: "ready",
          data: result,
          error: null,
        });
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setTiposRequest((current) => ({
          ...current,
          key: tiposRequestKey,
          status: "error",
          error: getErrorMessage(requestError, "No se pudieron cargar los tipos de afiliado."),
        }));
      });
    return () => controller.abort();
  }, [tiposRequestKey]);

  const buscar = useCallback((value: string) => {
    setBusqueda(value.trim());
    setPagina(1);
  }, []);
  const cambiarTipoSeguro = useCallback((value: number | null) => {
    setTipoSeguroId(value);
    setPagina(1);
  }, []);
  const cambiarPagina = useCallback((value: number) => setPagina(value), []);
  const cambiarTamanioPagina = useCallback((value: number) => {
    setTamanioPagina(value);
    setPagina(1);
  }, []);
  const reload = useCallback(() => setRefreshToken((value) => value + 1), []);
  const reloadTipos = useCallback(() => setTiposRefreshToken((value) => value + 1), []);

  const buscarPacientePorInss = useCallback(async (numeroInss: string): Promise<Paciente | null> => {
    const result = await getPacientes({ busqueda: numeroInss, pagina: 1, tamanioPagina: 100 });
    const numero = Number(numeroInss);
    return result.pacientes.find((paciente) => paciente.numeroInss === numero) ?? null;
  }, []);

  const obtenerExpedientePacientePorInss = useCallback(async (numeroInss: string): Promise<ExpedientePaciente[]> => {
    try {
      const result = await getPacienteExpedienteByInss(numeroInss);
      return result;
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 404) {
        return [];
      }
      throw requestError;
    }
  }, []);

  const value = useMemo(() => ({
    pacientes: pacientesRequest.data.pacientes,
    paginacion: pacientesRequest.data.paginacion,
    busqueda,
    tipoSeguroId,
    tiposAfiliados: tiposRequest.data,
    pagina,
    tamanioPagina,
    status: isCurrentPacientesRequest ? pacientesRequest.status : "loading",
    tiposStatus: isCurrentTiposRequest ? tiposRequest.status : "loading",
    error: isCurrentPacientesRequest ? pacientesRequest.error : null,
    tiposError: isCurrentTiposRequest ? tiposRequest.error : null,
    buscar,
    cambiarTipoSeguro,
    cambiarPagina,
    cambiarTamanioPagina,
    reload,
    reloadTipos,
    buscarPacientePorInss,
    obtenerExpedientePacientePorInss,
  }), [pacientesRequest, tiposRequest, isCurrentPacientesRequest, isCurrentTiposRequest, busqueda, tipoSeguroId, pagina, tamanioPagina, buscar, cambiarTipoSeguro, cambiarPagina, cambiarTamanioPagina, reload, reloadTipos, buscarPacientePorInss, obtenerExpedientePacientePorInss]);

  return <PacientesContext.Provider value={value}>{children}</PacientesContext.Provider>;
}
