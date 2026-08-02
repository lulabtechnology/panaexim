# Validación técnica — PanaEXIM 2026 Fase 8

Fecha de preparación: 2 de agosto de 2026.

## Alcance

- Reconstrucción del preloader, header, hero y home responsive.
- Nuevo showcase cinematográfico controlado por scroll.
- Experiencia móvil mediante swipe y `scroll-snap`.
- Nuevo manifiesto institucional.
- Integración de imágenes y logos producidos para la Fase 7.
- Conservación de Supabase, panel administrativo, área privada, SEO y seguridad.
- Corrección del layout anidado para que solo el layout raíz renderice `<html>` y `<body>`.
- Actualización de Open Graph a los nuevos recursos visuales.

## Comprobaciones ejecutadas

- Validación semántica de referencias a archivos públicos: sin archivos faltantes.
- Transpilación sintáctica de todos los archivos TypeScript y TSX: sin errores de sintaxis.
- Comprobación tipada de los componentes modificados mediante declaraciones temporales de validación: sin incompatibilidades locales.
- Análisis del CSS mediante `tinycss2`: sin errores de parseo.
- Apertura y verificación de todos los PNG y WebP nuevos: sin archivos corruptos.
- Validación del JSON de `package.json`: correcta.
- Revisión de imports locales y alias `@/`: sin rutas rotas.
- Confirmación de que el área privada, el panel y los módulos Supabase permanecen en el proyecto.
- Búsqueda de claves privadas incrustadas en componentes públicos: sin hallazgos.

## Limitación del entorno

El registro npm interno disponible durante el empaquetado no contiene `@supabase/ssr`, `@supabase/supabase-js` ni algunos paquetes de tipos. Por esa razón no fue posible ejecutar aquí una instalación completa ni los comandos reales de Next.js:

```bash
npm run typecheck
npm run lint
npm run build
```

La sintaxis, imports, CSS, JSON y recursos estáticos sí fueron verificados. El workflow de GitHub debe quedar en verde antes de aprobar producción.

## Pruebas obligatorias en el preview de Vercel

### Experiencia pública

1. Abrir `/es` y `/en` en 1920×1080, 1440×900 y 1366×768.
2. Confirmar que el preloader termina y libera el scroll.
3. Revisar interacción hover de las cuatro franjas del hero.
4. Desplazarse por el showcase completo y confirmar las cuatro transiciones.
5. Probar indicadores, flechas y navegación inversa.
6. Confirmar que el showcase no deja escenas invisibles superpuestas al salir.
7. Probar `prefers-reduced-motion`.
8. Comprobar enlaces externos de las cuatro ferias.

### Responsive

1. Probar 375×812, 390×844, 430×932, 768×1024 y 1024×1366.
2. Confirmar que el hero ocupa `100svh` sin cortes.
3. Verificar que la cuenta regresiva permanece legible.
4. Deslizar las cuatro escenas móviles mediante touch.
5. Confirmar que el scroll vertical no queda bloqueado.
6. Revisar menú móvil, formulario, mapa y footer.

### Backend y seguridad

1. Ejecutar la migración de Supabase.
2. Crear un administrador y comprobar `/es/admin`.
3. Crear, editar, publicar, ocultar y eliminar un participante.
4. Subir y sustituir un logo.
5. Cambiar la contraseña del directorio.
6. Probar el bloqueo tras cinco intentos incorrectos.
7. Confirmar que un usuario sin cookie no recibe datos privados.
8. Repetir las pruebas en inglés.

### Rendimiento

- Ejecutar Lighthouse en móvil y escritorio.
- Revisar LCP del hero.
- Confirmar que las imágenes WebP se entregan correctamente.
- Revisar CLS durante el preloader y la carga de logos.
- Probar Safari iOS, Chrome Android y navegadores de escritorio.

## Objetivos

- Performance móvil: 85 o superior.
- Accesibilidad: 95 o superior.
- SEO: 95 o superior.
- Sin errores de consola.
- Sin rutas rotas.
- Sin datos privados presentes en HTML público.
