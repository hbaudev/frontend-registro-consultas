import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MedicosContext, type MedicosStatus } from "../context/medicos-context";
import { ApiError } from "../../../shared/lib/api";
import { getMedicos } from "../services/medicos-api";
import type { Medico } from "../types/medicos/index";

const DEFAULT_PAGE_SIZE = 10;
const CATALOG_PAGE_SIZE = 100;

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof ApiError ? error.message : fallback;
}

export function MedicosProvider({ children }: { children: ReactNode }) {
    const [medicos, setMedicos] = useState<Medico[]>([]);
    const [catalogoMedicos, setCatalogoMedicos] = useState<Medico[]>([]);
    const [catalogoLoading, setCatalogoLoading] = useState(false);
    const [catalogoError, setCatalogoError] = useState<string | null>(null);
    const [paginacion, setPaginacion] = useState({ pagina: 1, tamanioPagina: DEFAULT_PAGE_SIZE, totalRegistros: 0, totalPaginas: 0 });
    const [busqueda, setBusqueda] = useState("");
    const [codigoEspecialidad, setCodigoEspecialidad] = useState<string | null>(null);
    const [disponibilidad, setDisponibilidad] = useState<boolean | null>(null);
    const [pagina, setPagina] = useState(1);
    const [tamanioPagina, setTamanioPagina] = useState(DEFAULT_PAGE_SIZE);
    const [status, setStatus] = useState<MedicosStatus>("loading");
    const [error, setError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);
    const catalogoRef = useRef<Medico[] | null>(null);
    const catalogoRequestRef = useRef<Promise<Medico[]> | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        void getMedicos({
            busqueda: busqueda || undefined,
            codigoEspecialidad: codigoEspecialidad ?? undefined,
            disponibilidad: disponibilidad ?? undefined,
            pagina,
            tamanioPagina,
        }, controller.signal)
            .then((result) => {
                setMedicos(result.medicos);
                setPaginacion(result.paginacion);
                setStatus("ready");
            })
            .catch((requestError) => {
                if (controller.signal.aborted) return;
                setError(getErrorMessage(requestError, "No se pudieron cargar los médicos."));
                setStatus("error");
            });
        return () => controller.abort();
    }, [busqueda, codigoEspecialidad, disponibilidad, pagina, tamanioPagina, refreshToken]);

    const beginLoading = useCallback(() => {
        setStatus("loading");
        setError(null);
    }, []);

    const buscar = useCallback((value: string) => {
        if (value.trim() === busqueda) return;
        beginLoading();
        setBusqueda(value.trim());
        setPagina(1);
    }, [busqueda, beginLoading]);
    const cambiarCodigoEspecialidad = useCallback((value: string | null) => {
        if (value === codigoEspecialidad) return;
        beginLoading();
        setCodigoEspecialidad(value);
        setPagina(1);
    }, [codigoEspecialidad, beginLoading]);
    const cambiarDisponibilidad = useCallback((value: boolean | null) => {
        if (value === disponibilidad) return;
        beginLoading();
        setDisponibilidad(value);
        setPagina(1);
    }, [disponibilidad, beginLoading]);
    const cambiarPagina = useCallback((value: number) => {
        if (value === pagina) return;
        beginLoading();
        setPagina(value);
    }, [pagina, beginLoading]);
    const cambiarTamanioPagina = useCallback((value: number) => {
        if (value === tamanioPagina) return;
        beginLoading();
        setTamanioPagina(value);
        setPagina(1);
    }, [tamanioPagina, beginLoading]);
    const reload = useCallback(() => {
        beginLoading();
        setRefreshToken((value) => value + 1);
    }, [beginLoading]);

    const cargarCatalogo = useCallback((): Promise<Medico[]> => {
        if (catalogoRef.current) return Promise.resolve(catalogoRef.current);
        if (catalogoRequestRef.current) return catalogoRequestRef.current;

        setCatalogoLoading(true);
        setCatalogoError(null);
        const request = (async () => {
            const firstPage = await getMedicos({
                disponibilidad: true,
                pagina: 1,
                tamanioPagina: CATALOG_PAGE_SIZE,
            });
            const all = [...firstPage.medicos];
            for (let nextPage = 2; nextPage <= firstPage.paginacion.totalPaginas; nextPage += 1) {
                const result = await getMedicos({
                    disponibilidad: true,
                    pagina: nextPage,
                    tamanioPagina: CATALOG_PAGE_SIZE,
                });
                all.push(...result.medicos);
            }
            catalogoRef.current = all;
            setCatalogoMedicos(all);
            return all;
        })();
        catalogoRequestRef.current = request;

        return request
            .catch((requestError: unknown) => {
                setCatalogoError(getErrorMessage(requestError, "No se pudieron cargar los médicos."));
                throw requestError;
            })
            .finally(() => {
                catalogoRequestRef.current = null;
                setCatalogoLoading(false);
            });
    }, []);

    const value = useMemo(() => ({
        medicos,
        catalogoMedicos,
        catalogoLoading,
        catalogoError,
        paginacion,
        busqueda,
        codigoEspecialidad,
        disponibilidad,
        pagina,
        tamanioPagina,
        status,
        error,
        buscar,
        cambiarCodigoEspecialidad,
        cambiarDisponibilidad,
        cambiarPagina,
        cambiarTamanioPagina,
        reload,
        cargarCatalogo,
    }), [medicos, catalogoMedicos, catalogoLoading, catalogoError, paginacion, busqueda, codigoEspecialidad, disponibilidad, pagina, tamanioPagina, status, error, buscar, cambiarCodigoEspecialidad, cambiarDisponibilidad, cambiarPagina, cambiarTamanioPagina, reload, cargarCatalogo]);

    return <MedicosContext.Provider value={value}>{children}</MedicosContext.Provider>;
}