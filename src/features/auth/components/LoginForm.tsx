import { useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../../../shared/lib/api";

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Escribe tu usuario.")
    .max(50, "Máximo 50 caracteres."),
  password: z.string().min(1, "Escribe tu contraseña."),
});
type Values = z.infer<typeof schema>;

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  async function submit(values: Values) {
    setServerError("");
    try {
      await login(values.username, values.password);
      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor.",
      );
    }
  }

  return (
    <Box className="login-form" component="form" onSubmit={handleSubmit(submit)} noValidate>
      <TextField
        {...register("username")}
        className="login-form__field"
        label="Usuario"
        autoComplete="username"
        fullWidth
        margin="normal"
        autoFocus
        error={Boolean(errors.username)}
        helperText={errors.username?.message}
      />
      <TextField
        {...register("password")}
        className="login-form__field"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        fullWidth
        margin="normal"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
      />
      {serverError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {serverError}
        </Alert>
      )}
      <Button
        className="login-form__submit"
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 3 }}
      >
        {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </Box>
  );
}
