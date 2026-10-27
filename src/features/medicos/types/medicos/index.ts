export interface Medico {
    codigoMinsa: string;
    cedula: string;
    telefono: string | null;
    disponibilidad: boolean;
    nombre: string;
    apellido: string;
    codigoEspecialidad: string | null;
    nombreEspecialidad: string | null;
}

export interface MedicosPage {
    medicos: Medico[];
    paginacion: {
        pagina: number;
        tamanioPagina: number;
        totalRegistros: number;
        totalPaginas: number;
    };
}