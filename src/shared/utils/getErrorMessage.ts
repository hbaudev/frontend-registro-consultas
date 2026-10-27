import { ApiError } from "../lib/api";

export function getErrorMessage(error: unknown, defaultMessage: string): string {
    if (error instanceof ApiError) return error.message;
    return defaultMessage;
}