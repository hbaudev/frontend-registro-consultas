/**
 * Retorna la fecha en formato dd/mm/yyyye
 * * @param value 
 * @returns string
 */

export function formatDate(value: Date | string): string {
    const date = typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}