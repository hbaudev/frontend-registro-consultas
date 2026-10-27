import { apiFetch } from "../../../shared/lib/api";
import type { PacientesPage } from "../types/pacientes/index";
import type { ExpedientePaciente } from "../types/expediente/index";

export interface PacientesQuery {
  busqueda?: string;
  tipoSeguroId?: number;
  pagina?: number;
  tamanioPagina?: number;
}

export async function getPacientes(
  query: PacientesQuery = {},
  signal?: AbortSignal,
): Promise<PacientesPage> {
  const params = new URLSearchParams();
  if (query.busqueda?.trim()) params.set("busqueda", query.busqueda.trim());
  if (query.tipoSeguroId !== undefined) params.set("tipoSeguroId", String(query.tipoSeguroId));
  if (query.pagina !== undefined) params.set("pagina", String(query.pagina));
  if (query.tamanioPagina !== undefined) params.set("tamanioPagina", String(query.tamanioPagina));

  const search = params.size > 0 ? `?${params.toString()}` : "";
  return apiFetch<PacientesPage>(`/api/pacientes${search}`, { signal });
}

export interface ExpedientesResponse {
  expedientes: ExpedientePaciente[];
}

export async function getPacienteExpedienteByInss(
  numeroInss: string,
  signal?: AbortSignal,
): Promise<ExpedientePaciente[]> {
  const result = await apiFetch<ExpedientesResponse>(
    `/api/pacientes/expediente/${encodeURIComponent(numeroInss)}`,
    { signal },
  );
  return result.expedientes ?? [];
}