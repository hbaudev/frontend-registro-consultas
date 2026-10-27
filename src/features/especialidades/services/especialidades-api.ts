import { apiFetch } from "../../../shared/lib/api";
import type { EspecialidadesPage } from "../types/especialidades/index";

export interface EspecialidadesQuery {
    busqueda?: string;
    pagina?: number;
    tamanioPagina?: number;
}

export async function getEspecialidades(
    query: EspecialidadesQuery = {},
    signal?: AbortSignal,
): Promise<EspecialidadesPage> {
    const params = new URLSearchParams();
    if (query.busqueda?.trim()) params.set("busqueda", query.busqueda.trim());
    if (query.pagina !== undefined) params.set("pagina", String(query.pagina));
    if (query.tamanioPagina !== undefined) params.set("tamanioPagina", String(query.tamanioPagina));

    const search = params.size > 0 ? `?${params.toString()}` : "";
    return apiFetch<EspecialidadesPage>(`/api/especialidades${search}`, { signal });
}