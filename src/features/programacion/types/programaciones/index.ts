export interface Programacion {
  codigoProgramacion: string;
  fecha: Date | string;
  jornada: "AM" | "PM";
  limitePacientes: number;
  codigoMinsaMedico: string;
  nombreMedico: string;
  apellidoMedico: string | null;
  numeroConsultorio: string;
  nombreConsultorio: string;
}

export interface ProgramacionesPage {
  programaciones: Programacion[];
  paginacion: {
    pagina: number;
    tamanioPagina: number;
    totalRegistros: number;
    totalPaginas: number;
  };
}

export interface ProgramacionesQuery {
  fecha?: Date | string;
  codigoMinsaMedico?: string;
  numeroConsultorio?: string;
  pagina?: number;
  tamanioPagina?: number;
}

export interface CrearProgramacionInput {
  fecha: string;
  jornada: "AM" | "PM";
  limitePacientes: number;
  codigoMinsaMedico: string;
  numeroConsultorio: string;
}

export interface ProgramacionCreada {
  codigoProgramacion: string;
  mensaje: string;
}