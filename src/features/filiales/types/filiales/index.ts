export interface Filial {
  filialId: number;
  codigoFilial: string;
  nombreFilial: string;
  fechaCreacion: string | Date;
  fechaModificacion: string | Date | null;
  registroAnulado: boolean | number;
  usuarioCreacionId: number;
  creadoPorUsuario: string;
  nombreCompletoCreador: string;
}

export interface FilialInput {
  codigoFilial: string;
  nombreFilial: string;
}
