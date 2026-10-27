export interface ExpedientePaciente {
  expedienteId?: number;
  pacienteExpedienteId?: number;
  numeroInss?: number | null;
  numeroCedula?: string | null;
  nombreCompletoPaciente?: string;
  numeroExpediente: string;
  pacienteEspecial: boolean;
  autorizadoGerencia: boolean;
  fechaNacimiento?: string | Date | null;
  fechaCreacion: string | Date;
  fechaModificacion?: string | Date | null;
  registroAnulado: boolean;
}