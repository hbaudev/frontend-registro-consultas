export interface ConsultoriosQuery {
    busqueda?: string;
    codigoAreaMedica?: string;
    pagina?: number;
    tamanioPagina?: number;
}

export interface ConsultoriosPage {
    consultorios: Consultorio[];
    paginacion: {
        pagina: number;
        tamanioPagina: number;
        totalRegistros: number;
        totalPaginas: number;
    };
}

export interface Consultorio {
    consultorioId: number;
    numeroConsultorio: string;
    nombreConsultorio: string;
    disponibilidad: string;
    fechaCreacion: string;
    codigoAreaMedica: string;
    nombreAreaMedica: string;
}