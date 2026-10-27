import { apiFetch } from "../../../shared/lib/api";
import type {
    CrearProgramacionInput,
    ProgramacionCreada,
    ProgramacionesPage,
    ProgramacionesQuery,
} from "../types/programaciones/index";

function formatDate(value: Date | string): string {
    if (typeof value === "string") return value.slice(0, 10);
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export async function getProgramaciones(
    query: ProgramacionesQuery = {},
    signal?: AbortSignal,
): Promise<ProgramacionesPage> {
    const params = new URLSearchParams();
    if (query.fecha) params.set("fecha", formatDate(query.fecha));
    if (query.codigoMinsaMedico?.trim()) params.set("codigoMinsa", query.codigoMinsaMedico.trim());
    if (query.numeroConsultorio?.trim()) params.set("numeroConsultorio", query.numeroConsultorio.trim());
    if (query.pagina !== undefined) params.set("pagina", String(query.pagina));
    if (query.tamanioPagina !== undefined) params.set("tamanioPagina", String(query.tamanioPagina));
    const search = params.size > 0 ? `?${params.toString()}` : "";
    return apiFetch<ProgramacionesPage>(`/api/programaciones${search}`, { signal });
}

export async function createProgramacion(
    programacion: CrearProgramacionInput,
    signal?: AbortSignal,
): Promise<ProgramacionCreada> {
    return apiFetch<ProgramacionCreada>("/api/programaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programacion),
        signal,
    });
}