# Validación técnica — PanaEXIM 2026 Fase 5

Fecha de preparación: 2 de agosto de 2026.

## Alcance de esta fase

- Integración preparada para Supabase Auth, Postgres, Storage y RLS.
- Panel administrativo bilingüe para gestionar participantes.
- Directorio privado protegido mediante contraseña, cookie firmada y enlaces temporales para logos.
- Límites de intentos, hash scrypt y cierre de sesión.
- Filtros de participantes por evento, país, categoría y búsqueda libre.
- Encabezados de seguridad, noindex reforzado y rechazo de mutaciones de origen cruzado.
- Validación del tamaño, MIME y firma binaria de logos PNG, JPEG y WebP.
- Corrección del idioma HTML inicial para `/es` y `/en`.
- Preload de la imagen hero y tratamiento de movimiento reducido.

## Comprobaciones ejecutadas en el paquete

- 46 archivos TypeScript/TSX transpilados para validar sintaxis: **0 errores**.
- Resolución de imports locales y alias `@/`: **0 rutas rotas**.
- JSON de configuración: **válido**.
- Balance estructural del CSS: **válido**.
- Referencias a imágenes estáticas: **0 archivos faltantes**.
- 16 imágenes raster abiertas y verificadas: **0 archivos corruptos**.
- Búsqueda de secretos incrustados en componentes de cliente: **sin hallazgos**.
- `SUPABASE_SERVICE_ROLE_KEY` limitado a módulos de servidor.
- Directorios privados excluidos de sitemap y protegidos con `robots`/`X-Robots-Tag`.

## Comprobación pendiente en GitHub o Vercel

El entorno de empaquetado no pudo descargar dependencias desde su registro npm interno, por lo que no fue posible ejecutar aquí:

```bash
npm run typecheck
npm run lint
npm run build
```

El workflow `.github/workflows/ci.yml` ejecutará las tres pruebas automáticamente al subir el proyecto a GitHub. No debe aprobarse producción hasta que el workflow quede en verde.

## Prueba funcional obligatoria tras conectar Supabase

1. Ejecutar `supabase/migrations/202608020001_phase5.sql`.
2. Crear un usuario en Supabase Auth y añadir su UUID a `admin_users`.
3. Iniciar sesión en `/es/admin`.
4. Crear, editar, ocultar, publicar y eliminar un participante.
5. Subir y sustituir un logo válido.
6. Confirmar rechazo de SVG, archivo falso y archivo de más de 4 MB.
7. Cambiar la contraseña privada desde el panel.
8. Probar cinco contraseñas incorrectas y verificar el bloqueo temporal.
9. Iniciar sesión en `/es/participants` y comprobar los enlaces firmados de los logos.
10. Confirmar que un visitante sin cookie no recibe datos privados en el HTML.
11. Repetir navegación, formularios y directorio en inglés.
12. Ejecutar Lighthouse en móvil y escritorio sobre la URL de producción.

## Variables obligatorias

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PARTICIPANTS_SESSION_SECRET`
- `PARTICIPANTS_RATE_LIMIT_SECRET`

`PARTICIPANTS_ACCESS_PASSWORD` es temporal y puede retirarse después de guardar la contraseña definitiva desde el panel.
