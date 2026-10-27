import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { EspecialidadesContext, type EspecialidadesStatus } from "../context/especialidades-context";
import { getEspecialidades } from "../services/especialidades-api";
import type { Especialidad, EspecialidadesPage } from "../types/especialidades/index";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

const PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;

interface EspecialidadesRequestState {
  key: string | null;
  status: EspecialidadesStatus;
  data: EspecialidadesPage;
  error: string | null;
}

export function EspecialidadesProvider({ children }: { children: ReactNode }) {
  const [requestState, setRequestState] = useState<EspecialidadesRequestState>({
    key: null,
    status: "loading",
    data: {
      especialidades: [],
      paginacion: {
        pagina: 1,
        tamanioPagina: DEFAULT_PAGE_SIZE,
        totalRegistros: 0,
        totalPaginas: 0,
      },
    },
    error: null,
  });
  const [catalogoEspecialidades, setCatalogoEspecialidades] = useState<Especialidad[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [tamanioPagina, setTamanioPagina] = useState(DEFAULT_PAGE_SIZE);
  const [catalogoLoading, setCatalogoLoading] = useState(false);
  const [catalogoError, setCatalogoError] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const catalogoRef = useRef<Especialidad[] | null>(null);
  const catalogoRequestRef = useRef<Promise<Especialidad[]> | null>(null);
  const requestKey = JSON.stringify([busqueda, pagina, tamanioPagina, refreshToken]);
  const isCurrentRequest = requestState.key === requestKey;

  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve()
      .then(() => getEspecialidades({
        busqueda: busqueda || undefined,
        pagina,
        tamanioPagina,
      }, controller.signal))
      .then((result) => {
        if (controller.signal.aborted) return;
        setRequestState({
          key: requestKey,
          status: "ready",
          data: result,
          error: null,
        });
      })
      .catch((requestError) => {
        if (controller.signal.aborted) return;
        setRequestState((current) => ({
          ...current,
          key: requestKey,
          status: "error",
          error: getErrorMessage(requestError, "No se pudieron cargar las especialidades."),
        }));
      });
    return () => controller.abort();
  }, [busqueda, pagina, tamanioPagina, refreshToken, requestKey]);

  const buscar = useCallback((value: string) => {
    setBusqueda(value.trim());
    setPagina(1);
  }, []);

  const cambiarPagina = useCallback((value: number) => setPagina(value), []);
  const cambiarTamanioPagina = useCallback((value: number) => {
    setTamanioPagina(value);
    setPagina(1);
  }, []);
  const reload = useCallback(() => setRefreshToken((value) => value + 1), []);

  const cargarCatalogo = useCallback((): Promise<Especialidad[]> => {
    if (catalogoRef.current) return Promise.resolve(catalogoRef.current);
    if (catalogoRequestRef.current) return catalogoRequestRef.current;

    setCatalogoLoading(true);
    setCatalogoError(null);
    const request = (async () => {
      const firstPage = await getEspecialidades({ pagina: 1, tamanioPagina: PAGE_SIZE });
      const all = [...firstPage.especialidades];
      for (let nextPage = 2; nextPage <= firstPage.paginacion.totalPaginas; nextPage += 1) {
        const result = await getEspecialidades({ pagina: nextPage, tamanioPagina: PAGE_SIZE });
        all.push(...result.especialidades);
      }
      catalogoRef.current = all;
      setCatalogoEspecialidades(all);
      return all;
    })();
    catalogoRequestRef.current = request;

    return request
      .catch((requestError: unknown) => {
        setCatalogoError(getErrorMessage(requestError, "No se pudieron cargar las especialidades."));
        throw requestError;
      })
      .finally(() => {
        catalogoRequestRef.current = null;
        setCatalogoLoading(false);
      });
  }, []);

  const value = useMemo(() => ({
    especialidades: requestState.data.especialidades,
    catalogoEspecialidades,
    paginacion: requestState.data.paginacion,
    busqueda,
    pagina,
    tamanioPagina,
    status: isCurrentRequest ? requestState.status : "loading",
    catalogoLoading,
    error: isCurrentRequest ? requestState.error : null,
    catalogoError,
    buscar,
    cambiarPagina,
    cambiarTamanioPagina,
    reload,
    cargarCatalogo,
  }), [requestState, isCurrentRequest, catalogoEspecialidades, busqueda, pagina, tamanioPagina, catalogoLoading, catalogoError, buscar, cambiarPagina, cambiarTamanioPagina, reload, cargarCatalogo]);

  return <EspecialidadesContext.Provider value={value}>{children}</EspecialidadesContext.Provider>;
}
