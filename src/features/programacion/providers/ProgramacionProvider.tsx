import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ProgramacionContext, type ProgramacionStatus } from "../context/programacion-context";
import { createProgramacion, getProgramaciones } from "../services/programaciones-api";
import type { CrearProgramacionInput, Programacion } from "../types/programaciones/index";
import { getErrorMessage } from "../../../shared/utils/getErrorMessage";

const DEFAULT_PAGE_SIZE = 10;

export function ProgramacionProvider({ children }: { children: ReactNode }) {
    const [programaciones, setProgramaciones] = useState<Programacion[]>([]);
    const [paginacion, setPaginacion] = useState({
        pagina: 1,
        tamanioPagina: DEFAULT_PAGE_SIZE,
        totalRegistros: 0,
        totalPaginas: 0,
    });
    const [fechaProgramacion, setFechaProgramacion] = useState<Date | null>(null);
    const [codigoMinsaMedico, setCodigoMinsaMedico] = useState("");
    const [numeroConsultorio, setNumeroConsultorio] = useState("");
    const [pagina, setPagina] = useState(1);
    const [tamanioPagina, setTamanioPagina] = useState(DEFAULT_PAGE_SIZE);
    const [status, setStatus] = useState<ProgramacionStatus>("loading");
    const [error, setError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        void getProgramaciones({
            fecha: fechaProgramacion ?? undefined,
            codigoMinsaMedico: codigoMinsaMedico || undefined,
            numeroConsultorio: numeroConsultorio || undefined,
            pagina,
            tamanioPagina,
        }, controller.signal)
            .then((result) => {
                setProgramaciones(result.programaciones);
                setPaginacion(result.paginacion);
                setStatus("ready");
            })
            .catch((requestError: unknown) => {
                if (controller.signal.aborted) return;
                setError(getErrorMessage(requestError, "No se pudieron cargar las programaciones."));
                setStatus("error");
            });
        return () => controller.abort();
    }, [fechaProgramacion, codigoMinsaMedico, numeroConsultorio, pagina, tamanioPagina, refreshToken]);

    const beginLoading = useCallback(() => {
        setStatus("loading");
        setError(null);
    }, []);
    const reload = useCallback(() => {
        beginLoading();
        setRefreshToken((value) => value + 1);
    }, [beginLoading]);

    const crear = useCallback(async (input: CrearProgramacionInput) => {
        const result = await createProgramacion(input);
        beginLoading();
        setPagina(1);
        setRefreshToken((value) => value + 1);
        return result;
    }, [beginLoading]);

    const cambiarPagina = useCallback((value: number) => {
        if (value === pagina) return;
        beginLoading();
        setPagina(value);
    }, [beginLoading, pagina]);
    const cambiarTamanioPagina = useCallback((value: number) => {
        if (value === tamanioPagina) return;
        beginLoading();
        setTamanioPagina(value);
        setPagina(1);
    }, [beginLoading, tamanioPagina]);
    const cambiarFechaProgramacion = useCallback((value: Date | null) => {
        if (value?.getTime() === fechaProgramacion?.getTime()) return;
        beginLoading();
        setFechaProgramacion(value);
        setPagina(1);
    }, [beginLoading, fechaProgramacion]);
    const cambiarCodigoMinsaMedico = useCallback((value: string) => {
        if (value === codigoMinsaMedico) return;
        beginLoading();
        setCodigoMinsaMedico(value);
        setPagina(1);
    }, [beginLoading, codigoMinsaMedico]);
    const cambiarNumeroConsultorio = useCallback((value: string) => {
        if (value === numeroConsultorio) return;
        beginLoading();
        setNumeroConsultorio(value);
        setPagina(1);
    }, [beginLoading, numeroConsultorio]);

    const value = useMemo(() => ({
        programaciones,
        fechaProgramacion,
        codigoMinsaMedico,
        numeroConsultorio,
        paginacion,
        pagina,
        tamanioPagina,
        status,
        error,
        reload,
        crearProgramacion: crear,
        cambiarPagina,
        cambiarTamanioPagina,
        cambiarFechaProgramacion,
        cambiarCodigoMinsaMedico,
        cambiarNumeroConsultorio,
    }), [
        programaciones, fechaProgramacion, codigoMinsaMedico, numeroConsultorio,
        paginacion, pagina, tamanioPagina, status, error, reload, crear,
        cambiarPagina, cambiarTamanioPagina, cambiarFechaProgramacion,
        cambiarCodigoMinsaMedico, cambiarNumeroConsultorio,
    ]);

    return <ProgramacionContext.Provider value={value}>{children}</ProgramacionContext.Provider>;
}
