import { apiFetch } from "../../../shared/lib/api";
import type { ConsultoriosQuery, ConsultoriosPage } from "../types/consultorios/index";

export async function getConsultorios(
    query: ConsultoriosQuery = {},
    signal?: AbortSignal,
): Promise<ConsultoriosPage> {
    const params = new URLSearchParams();
    if (query.busqueda?.trim()) params.set("busqueda", query.busqueda.trim());
    if (query.codigoAreaMedica?.trim()) params.set("codigoAreaMedica", query.codigoAreaMedica.trim());
    if (query.pagina !== undefined) params.set("pagina", String(query.pagina));
    if (query.tamanioPagina !== undefined) params.set("tamanioPagina", String(query.tamanioPagina));

    const search = params.size > 0 ? `?${params.toString()}` : "";
    return apiFetch<ConsultoriosPage>(`/api/consultorios${search}`, { signal });
}   