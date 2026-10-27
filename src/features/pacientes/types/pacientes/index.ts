export interface Paciente {
    pacienteId: number;
    numeroInss: number | null;
    numeroCedula: string | null;
    nombres: string;
    apellidos: string;
    telefono: string | null;
    fechaNacimiento: Date | string | null;
    empresa: string | null;
    tipoSeguroId: number;
    codigoTipoSeguro: string;
    tipoSeguro: string;
    titularId: number | null;
    fechaCreacion: Date | string;
}

export interface PacientesPage {
    pacientes: Paciente[];
    paginacion: {
        pagina: number;
        tamanioPagina: number;
        totalRegistros: number;
        totalPaginas: number;
    };
}
