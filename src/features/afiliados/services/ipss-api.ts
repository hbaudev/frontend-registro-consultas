import { apiFetch } from "../../../shared/lib/api";
import type { AfiliadoInss } from "../types/afiliados/index";

interface AfiliadoResponse {
  afiliado: AfiliadoInss;
}

export interface TipoAfiliado {
  TipoAseguradoId: number;
  CodigoTipo: string;
  Descripcion: string;
}

interface TiposAfiliadosResponse {
  tiposAfiliados: TipoAfiliado[];
}

export async function getPerCapita(numeroInss: number): Promise<AfiliadoInss> {
  const response = await apiFetch<AfiliadoResponse>(
    `/api/ipss/${encodeURIComponent(numeroInss)}`,
  );
  return response.afiliado;
}

export async function getTiposAfiliados(signal?: AbortSignal): Promise<TipoAfiliado[]> {
  const response = await apiFetch<TiposAfiliadosResponse>("/api/ipss/tipos-afiliados", { signal });
  return response.tiposAfiliados;
}
