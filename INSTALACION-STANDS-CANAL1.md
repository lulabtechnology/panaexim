# V3 - correccion de visualizacion al 100%

Este incremental corrige el caso reportado donde, con el navegador al 100%, el plano terminaba antes de mostrar visualmente la franja sur con los stands 119-125.

- El plano mantiene **100%** en su control interno, pero usa una escala base responsive para que los 125 stands entren completos en el viewport de escritorio.
- Los stands **119, 120, 121, 122, 123, 124 y 125** siguen en sus posiciones reales y ahora quedan visibles sin tener que bajar el zoom del navegador a 85%.
- En movil se mantiene la experiencia tactil tipo selector de cine con paneo/zoom y accesos por zonas.
- **No hay SQL nuevo en esta V3.** No ejecutes otra migracion por este arreglo visual.

---

# PanaEXIM 2026 — Selector de stands Canal 1 · versión 2

## Qué corrige este incremental

- Sustituye la nomenclatura temporal tipo `A01`, `E12`, etc. por los números reales del plano: **1 a 125**.
- Incorpora el bloque inferior que faltaba: **stands 119, 120, 121, 122, 123, 124 y 125**.
- Mantiene el plano público sin nombres de expositores.
- Verde = disponible.
- Rojo = ocupado.
- Estado inicial según el plano numerado recibido: **82 disponibles / 43 ocupados / 125 total**.
- Mantiene los dos contactos de WhatsApp:
  - +507 6270-6323
  - +507 6992-0333
- El mensaje de WhatsApp incluye automáticamente el número del stand seleccionado.
- El administrador sigue pudiendo cambiar cualquier stand entre Disponible y Ocupado desde `/es/admin` y `/en/admin`.

## Mejora móvil tipo selector de cine

La experiencia móvil fue reconstruida para que no sea una simple reducción del plano de escritorio:

- visor grande y desplazable del plano;
- stands táctiles con números legibles;
- controles compactos de zoom;
- navegación rápida por zonas: 1–43, 44–74, 75–118 y 119–125;
- buscador numérico;
- leyenda flotante Disponible/Ocupado;
- vista separada de stands disponibles;
- al tocar un stand aparece una tarjeta inferior flotante tipo selector de asientos;
- si está disponible, los dos botones de WhatsApp quedan accesibles desde esa tarjeta;
- diseño adaptado para pantallas pequeñas y safe-area inferior de iPhone.

## SQL obligatorio

### Si ya ejecutaste la migración anterior

Ejecuta solamente esta nueva migración en el SQL Editor de Supabase:

`supabase/migrations/202609080002_booths_numbering_125.sql`

Esta migración:

1. cambia el esquema temporal al numerado oficial 1–125;
2. intenta conservar los cambios de disponibilidad hechos anteriormente, mapeándolos por la posición física del stand;
3. agrega el stand 125 y corrige la franja inferior;
4. elimina los identificadores temporales A01/L05;
5. vuelve a aplicar una validación para aceptar únicamente stands numéricos del 1 al 125.

### Si nunca ejecutaste ninguna migración de stands

Ejecuta, en este orden:

1. `supabase/migrations/202609080001_booths.sql`
2. `supabase/migrations/202609080002_booths_numbering_125.sql`

La web puede mostrar el plano usando el estado inicial incluido en código aunque la segunda migración todavía no se haya ejecutado. Sin embargo, hasta ejecutar la migración nueva, el panel administrativo mostrará una advertencia y no habilitará los cambios de disponibilidad del nuevo esquema 1–125.

## Estado inicial según el plano recibido

Ocupados al cargar esta versión:

- 1–17
- 27–34
- 55–60
- 62–63
- 85
- 87–90
- 119–123

Todo el resto se carga como disponible.

## Privacidad

Los nombres visibles en el archivo de referencia se usaron únicamente para determinar qué espacios estaban ocupados. **No se guardan ni se publican en el módulo de stands.**
