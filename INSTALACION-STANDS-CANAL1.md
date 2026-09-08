# PanaEXIM 2026 — Selector de stands Canal 1

## Qué agrega este incremental

- Nueva sección pública `Elige tu stand / Choose your booth` en `/es` y `/en`.
- Plano interactivo de Canal 1 con 124 stands numerados.
- Verde = disponible; rojo = ocupado.
- Filtros por disponibilidad, búsqueda por código y zoom/desplazamiento.
- Vista responsive para escritorio, tablet y móvil.
- En móvil se incluye una vista rápida de todos los stands disponibles.
- Al seleccionar un stand disponible se ofrecen dos contactos de WhatsApp:
  - +507 6270-6323
  - +507 6992-0333
- El mensaje de WhatsApp incluye automáticamente el código del stand seleccionado.
- El mapa público nunca muestra nombres de expositores.
- El panel `/es/admin` y `/en/admin` incorpora gestión de disponibilidad: un clic cambia cada stand entre Disponible y Ocupado.

## Paso obligatorio en Supabase

Antes de usar la edición de stands desde el admin, ejecutar en el SQL Editor de Supabase:

`supabase/migrations/202609080001_booths.sql`

La migración:

1. Crea la tabla `public.booths`.
2. Mantiene RLS y acceso administrativo.
3. Crea los 124 códigos de stands.
4. Carga la disponibilidad inicial basada en el plano de Canal 1 recibido.
5. No guarda nombres de expositores.

La web puede renderizar el mapa aunque todavía no se haya ejecutado la migración, usando la disponibilidad inicial incluida en código. Sin la migración, el admin mostrará una advertencia y no permitirá cambiar estados.

## Comportamiento de actualización

Cuando el administrador cambia un stand:

1. Se guarda en Supabase.
2. El mapa público consulta la disponibilidad mediante `/api/booths`.
3. Los visitantes reciben el estado actualizado sin que sea necesario volver a compilar la web.
4. Mientras una persona mantiene la página abierta, el mapa vuelve a consultar la disponibilidad aproximadamente cada 60 segundos.

## Códigos

La nomenclatura queda dividida por zonas del plano: A, B, C, D, E, F, G, H, J, K y L. Se omite la letra I para evitar confusión visual con el número 1.

Total: **124 stands**.
