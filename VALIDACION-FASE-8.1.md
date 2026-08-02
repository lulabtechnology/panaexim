# Validación — PanaEXIM 2026 Fase 8.1

## Fuente revisada

- ZIP más reciente entregado por el usuario: `panaexim-main (1).zip`.
- Grabación responsive y de escritorio entregada por el usuario: `Grabación 2026-08-02 132918.mp4`.
- La revisión se hizo sobre el código del ZIP, no sobre una copia anterior del sitio.

## Problemas corregidos

1. **Hero cortado en escritorio**
   - Se aumentó y equilibró la columna editorial.
   - Se redujo el tamaño fluido del título en los puntos de quiebre críticos.
   - `PanaEXIM` ya no pierde la última letra en resoluciones de laptop.

2. **Hero que podía animarse detrás del preloader**
   - El preloader emite un evento de finalización.
   - El hero inicia su timeline después de ese evento.
   - Se añadió un fallback para evitar contenido invisible si el evento es interrumpido.

3. **Contador con estilos heredados**
   - Se eliminaron borde, radio, sombra y fondo de la tarjeta antigua.
   - El primer render usa guiones hasta calcular la fecha en el cliente, evitando `00 00 00 00`.
   - Se añadieron etiquetas accesibles localizadas.

4. **Pantallas negras durante el showcase**
   - Cada escena mantiene un backdrop de baja opacidad.
   - Las escenas entrantes y salientes se solapan durante la transición.
   - Los paneles se reconstruyen sin dejar un intervalo vacío.

5. **Control del showcase**
   - Scroll vertical con ScrollTrigger.
   - Navegación por indicadores y flechas.
   - Teclado izquierda/derecha.
   - Arrastre horizontal en escritorio.
   - Botones de borde deshabilitados en el primer y último evento.

6. **Carrusel móvil desbordado**
   - Títulos más pequeños y balanceados.
   - Tratamiento especial para `PanaDefensa International`.
   - El contenido de tarjetas inactivas queda oculto durante el swipe.
   - Se añadió progreso táctil y navegación por teclado.
   - Se redujo el alto y el espacio superior del showcase.

7. **Candado sobre el texto de participantes**
   - El candado se movió al flujo normal del contenido.
   - Se redujo el alto mínimo y el espacio vacío en móvil.

8. **Orden de la sede en móvil**
   - Se anuló el `order: -1` heredado.
   - La descripción y los datos aparecen antes del mapa.

9. **Formulario y contenido bilingüe**
   - Consentimiento de privacidad obligatorio.
   - Mensaje de éxito renderizado solo después del envío.
   - Dirección y datos de la sede localizados para ES/EN.
   - Contactos largos pueden partir línea sin romper la cuadrícula.

10. **SEO y navegación**
    - Título absoluto de la home para evitar duplicación.
    - Open Graph y Twitter localizados.
    - URL base segura para Vercel y dominio final.
    - `scroll-margin` para que el header no cubra las secciones.
    - Menú móvil cerrable con `Escape` y recuperación de foco.

## Verificaciones ejecutadas

- `node scripts/static-check.mjs`: aprobado.
- Transpilación sintáctica con TypeScript de todos los archivos `.ts` y `.tsx`: aprobada.
- Parseo completo de `globals.css` con `tinycss2`: 0 errores.
- Balance y referencias de recursos locales: aprobado.
- Verificación de 35 imágenes raster con Pillow: 0 archivos corruptos.
- Búsqueda de referencias internas faltantes y secretos expuestos: sin hallazgos.
- Integridad del ZIP final: aprobada.

## Limitación del entorno

No se ejecutó `npm install`, `eslint` ni `next build` porque el registro npm disponible en este entorno no contiene todas las versiones declaradas del proyecto, especialmente `@supabase/ssr@0.12.0`. El repositorio conserva el workflow de GitHub Actions para ejecutar TypeScript, ESLint y build real al hacer push.

## Revisión recomendada después del deploy

Comprobar la vista publicada en:

- 375 × 812
- 390 × 844
- 430 × 932
- 768 × 1024
- 1024 × 768
- 1366 × 768
- 1440 × 900
- 1920 × 1080

Priorizar la sensación del scroll del showcase en trackpad y la legibilidad de los títulos en Safari iOS.
