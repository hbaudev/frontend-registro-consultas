# Registro de consultas — frontend

Frontend web del sistema de Registro de consultas, desarrollado con React, TypeScript y Vite.

## Desarrollo local

Desde esta carpeta instala las dependencias con `pnpm install` e inicia Vite con `pnpm dev`. El servidor de desarrollo reenvía las peticiones `/api` a `http://localhost:3000`. Para validar el frontend, ejecuta `pnpm build` y `pnpm lint`.

## Estructura del código

- `src/app`: composición de la aplicación, proveedores globales y rutas.
- `src/features`: módulos de negocio. Cada módulo agrupa sus páginas, componentes, hooks, estado, servicios y tipos relacionados.
- `src/shared`: componentes, layouts, navegación, utilidades y cliente HTTP compartidos por varias funcionalidades.
- `src/assets`: recursos importados desde el código.

Por ejemplo, `src/features/pacientes` contiene la pantalla y los componentes de pacientes junto con su estado y acceso a datos. Los módulos pueden consumir recursos de `shared` y de otros dominios cuando sea necesario; las rutas existentes se conservan en `src/app/App.tsx`.
