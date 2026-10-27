import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ConsultoriosContext, type ConsultoriosStatus } from "../context/consultorios-context";
import type { Consultorio } from "../types/consultorios/index";
import { getConsultorios } from "../services/consultorios-api";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

const PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 10;

export function ConsultoriosProvider({ children }: { children: ReactNode }) {
    const [consultorios, setConsultorios] = useState<Consultorio[]>([]);
    const [paginacion, setPaginacion] = useState({ pagina: 1, tamanioPagina: DEFAULT_PAGE_SIZE, totalRegistros: 0, totalPaginas: 0 });
    const [busqueda, setBusqueda] = useState("");
    const [codigoAreaMedica, setCodigoAreaMedica] = useState("");
    const [pagina, setPagina] = useState(1);
    const [tamanioPagina, setTamanioPagina] = useState(DEFAULT_PAGE_SIZE);
    const [status, setStatus] = useState<ConsultoriosStatus>("loading");
    const [error, setError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);
    const [catalogoLoading, setCatalogoLoading] = useState(false);
    const [catalogoError, setCatalogoError] = useState<string | null>(null);
    const [catalogoConsultorios, setCatalogoConsultorios] = useState<Consultorio[]>([]);
    const catalogoRef = useRef<Consultorio[] | null>(null);
    const catalogoRequestRef = useRef<Promise<Consultorio[]> | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        void getConsultorios({
            busqueda: busqueda || undefined,
            codigoAreaMedica: codigoAreaMedica || undefined,
            pagina,
            tamanioPagina,
        }, controller.signal)
            .then((result) => {
                setConsultorios(result.consultorios);
                setPaginacion(result.paginacion);
                setStatus("ready");
            })
            .catch((requestError) => {
                if (controller.signal.aborted) return;
                setError(getErrorMessage(requestError, "No se pudieron cargar los consultorios."));
                setStatus("error");
            });
        return () => controller.abort();
    }, [busqueda, codigoAreaMedica, pagina, tamanioPagina, refreshToken]);

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

    const cambiarCodigoAreaMedica = useCallback((value: string) => {
        if (value.trim() === codigoAreaMedica) return;
        beginLoading();
        setCodigoAreaMedica(value.trim());
        setPagina(1);
    }, [codigoAreaMedica, beginLoading]);

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

    const cargarCatalogo = useCallback((): Promise<Consultorio[]> => {
        if (catalogoRef.current) return Promise.resolve(catalogoRef.current);
        if (catalogoRequestRef.current) return catalogoRequestRef.current;

        setCatalogoLoading(true);
        setCatalogoError(null);
        const request = (async () => {
            const firstPage = await getConsultorios({ pagina: 1, tamanioPagina: PAGE_SIZE });
            const all = [...firstPage.consultorios];
            for (let nextPage = 2; nextPage <= firstPage.paginacion.totalPaginas; nextPage += 1) {
                const result = await getConsultorios({ pagina: nextPage, tamanioPagina: PAGE_SIZE });
                all.push(...result.consultorios);
            }
            catalogoRef.current = all;
            setCatalogoConsultorios(all);
            return all;
        })();
        catalogoRequestRef.current = request;

        return request
            .catch((requestError: unknown) => {
                setCatalogoError(getErrorMessage(requestError, "No se pudieron cargar los consultorios."));
                throw requestError;
            })
            .finally(() => {
                catalogoRequestRef.current = null;
                setCatalogoLoading(false);
            });
    }, []);

    const value = useMemo(() => ({
        consultorios,
        catalogoConsultorios,
        catalogoLoading,
        catalogoError,
        paginacion,
        busqueda,
        codigoAreaMedica,
        pagina,
        tamanioPagina,
        status,
        error,
        buscar,
        cambiarCodigoAreaMedica,
        cambiarPagina,
        cambiarTamanioPagina,
        reload,
        cargarCatalogo,
    }), [consultorios, catalogoConsultorios, catalogoLoading, catalogoError, paginacion, busqueda, codigoAreaMedica, pagina, tamanioPagina, status, error, buscar, cambiarCodigoAreaMedica, cambiarPagina, cambiarTamanioPagina, reload, cargarCatalogo]);

    return <ConsultoriosContext.Provider value={value}>{children}</ConsultoriosContext.Provider>;
}