import { apiFetch } from "../../../shared/lib/api";
import type { MedicosPage } from "../types/medicos/index";

export interface MedicosQuery {
    busqueda?: string;
    codigoEspecialidad?: string;
    disponibilidad?: boolean;
    pagina?: number;
    tamanioPagina?: number;
}

export async function getMedicos(
    query: MedicosQuery = {},
    signal?: AbortSignal,
): Promise<MedicosPage> {
    const params = new URLSearchParams();
    if (query.busqueda?.trim()) params.set("busqueda", query.busqueda.trim());
    if (query.codigoEspecialidad?.trim()) params.set("codigoEspecialidad", query.codigoEspecialidad.trim());
    if (query.disponibilidad !== undefined) params.set("disponibilidad", String(query.disponibilidad));
    if (query.pagina !== undefined) params.set("pagina", String(query.pagina));
    if (query.tamanioPagina !== undefined) params.set("tamanioPagina", String(query.tamanioPagina));

    const search = params.size > 0 ? `?${params.toString()}` : "";
    return apiFetch<MedicosPage>(`/api/medicos${search}`, { signal });
}