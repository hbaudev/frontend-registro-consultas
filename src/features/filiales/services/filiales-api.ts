import { apiFetch } from "../../../shared/lib/api";
import type { Filial, FilialInput } from "../types/filiales/index";

interface FilialesResponse {
  filiales: Filial[];
}

interface CrearFilialResponse {
  filialId: number;
  mensaje: string;
}

export async function getFiliales(): Promise<Filial[]> {
  const response = await apiFetch<FilialesResponse>("/api/filiales");
  return response.filiales;
}

export function postFilial(input: FilialInput): Promise<CrearFilialResponse> {
  return apiFetch<CrearFilialResponse>("/api/filiales", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function putFilial(filialId: number, input: FilialInput): Promise<void> {
  return apiFetch<void>(`/api/filiales/${filialId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteFilial(filialId: number): Promise<void> {
  return apiFetch<void>(`/api/filiales/${filialId}`, { method: "DELETE" });
}
