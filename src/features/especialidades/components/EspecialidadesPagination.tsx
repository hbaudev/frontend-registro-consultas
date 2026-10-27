import TablePagination from "@mui/material/TablePagination";

interface EspecialidadesPaginationProps {
  pagina: number;
  tamanioPagina: number;
  totalRegistros: number;
  disabled?: boolean;
  onPageChange: (pagina: number) => void;
  onPageSizeChange: (tamanioPagina: number) => void;
}

export default function EspecialidadesPagination({ pagina, tamanioPagina, totalRegistros, disabled = false, onPageChange, onPageSizeChange }: EspecialidadesPaginationProps) {
  return (
    <TablePagination
      component="div"
      count={totalRegistros}
      page={pagina - 1}
      rowsPerPage={tamanioPagina}
      rowsPerPageOptions={[10, 20, 50, 100]}
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
      disabled={disabled}
      onPageChange={(_event, nextPage) => onPageChange(nextPage + 1)}
      onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
    />
  );
}
