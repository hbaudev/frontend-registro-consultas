import { apiFetch } from "../../../shared/lib/api";

export interface CrearConsultaPayload {
  codigoProgramacion: string;
  numeroInss: number;
  esCitado?: boolean;
  esTraslado?: boolean;
  sacarExpediente?: boolean;
  observaciones?: string;
}

export interface ConsultaCreadaResponse {
  codigoConsulta: string;
  mensaje: string;
}

export async function registrarConsultaApi(
  payload: CrearConsultaPayload,
  signal?: AbortSignal,
): Promise<ConsultaCreadaResponse> {
  return apiFetch<ConsultaCreadaResponse>("/api/consultas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}

