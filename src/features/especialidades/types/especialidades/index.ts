export interface Especialidad {
    especialidadId: number;
    codigoEspecialidad: string | null;
    nombreEspecialidad: string;
    fechaCreacion: Date | string;
}

export interface EspecialidadesPage {
    especialidades: Especialidad[];
    paginacion: {
        pagina: number;
        tamanioPagina: number;
        totalRegistros: number;
        totalPaginas: number;
    };
}
