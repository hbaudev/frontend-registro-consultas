import { useState } from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "../../../shared/lib/api";
import { getPerCapita } from "../../afiliados/services/ipss-api";
import type { AfiliadoInss } from "../../afiliados/types/afiliados/index";

const schema = z.object({
  numeroInss: z
    .string()
    .trim()
    .min(1, "Escribe el numero INSS.")
    .max(10, "El numero INSS no puede superar 10 digitos.")
    .regex(/^\d+$/, "El numero INSS solo debe contener digitos."),
});


type Values = z.infer<typeof schema>;
type SearchState =
  | { kind: "idle" }
  | { kind: "found"; afiliado: AfiliadoInss }
  | { kind: "not-found" }
  | { kind: "error"; message: string };

function nombreCompleto(afiliado: AfiliadoInss): string {
  return [
    afiliado.PrimerNombre,
    afiliado.SegundoNombre,
    afiliado.PrimerApellido,
    afiliado.SegundoApellido,
  ]
    .filter((parte): parte is string => Boolean(parte?.trim()))
    .join(" ");
}

export default function ValidarPercapitaForm() {
  const [searchState, setSearchState] = useState<SearchState>({ kind: "idle" });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { numeroInss: "" },
  });
  //const numeroInss = watch("numeroInss");
  const numeroInssRegister = register("numeroInss")

  // useEffect(() => {
  //   setSearchState({ kind: "idle" });
  // }, [numeroInss]);

  async function buscarAfiliado(values: Values) {
    setSearchState({ kind: "idle" });
    try {
      const afiliado = await getPerCapita(values.numeroInss.trim());
      setSearchState({ kind: "found", afiliado });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setSearchState({ kind: "not-found" });
        return;
      }

      const message = error instanceof ApiError
        ? error.status === 401
          ? "Tu sesion vencio. Inicia sesion nuevamente para continuar."
          : error.status === 403
            ? "Tu usuario no tiene permiso para validar afiliados."
            : error.message
        : "No se pudo conectar con el servidor. Intenta de nuevo.";
      setSearchState({ kind: "error", message });
    }
  }

  return (
    <Stack spacing={2}>
      <Box component="form" onSubmit={handleSubmit(buscarAfiliado)} noValidate>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ alignItems: "flex-start" }}>
          <TextField
            {...numeroInssRegister}
            label="Numero INSS"
            placeholder="Ingresa de 1 a 10 digitos"
            inputMode="numeric"
            fullWidth
            autoFocus
            error={Boolean(errors.numeroInss)}
            helperText={errors.numeroInss?.message ?? "Se consultara el padron de SIIPSS."}
            onChange={(event) => {
              // Cada vez que escriba, reseteamos el estado de búsqueda a idle
              setSearchState({ kind: "idle" });
              numeroInssRegister.onChange(event);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 150, minHeight: 56 }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Buscar"}
          </Button>
        </Stack>
      </Box>

      {searchState.kind === "found" && (
        <Alert severity="success">
          <Typography sx={{ fontWeight: 700 }}>Afiliado encontrado</Typography>
          <Typography>{nombreCompleto(searchState.afiliado) || "Nombre no disponible"}</Typography>
          <Typography variant="body2">
            INSS: {searchState.afiliado.NumeroINSS}
            {searchState.afiliado.NoCedula ? ` · Cedula: ${searchState.afiliado.NoCedula}` : ""}
          </Typography>
          {searchState.afiliado.Estado && (
            <Typography variant="body2">Estado: {searchState.afiliado.Estado}</Typography>
          )}
        </Alert>
      )}

      {searchState.kind === "not-found" && (
        <Alert severity="warning">
          No se encontro un afiliado con ese numero INSS. No se puede continuar con el registro.
        </Alert>
      )}

      {searchState.kind === "error" && <Alert severity="error">{searchState.message}</Alert>}
    </Stack>
  );
}
