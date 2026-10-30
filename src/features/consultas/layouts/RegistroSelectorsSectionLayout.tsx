import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}

export default function RegistroSelectorsSectionLayout({
    title,
    description,
    icon,
    children
}: Props) {
    return (
        <Stack spacing={1}>
            <Stack direction="row" sx={{ alignItems: "center" }} spacing={1}>
                {/* Renderizamos la prop en lugar de un icono quemado */}
                {icon}
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>

            {children}
        </Stack>
    );
}