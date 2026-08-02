# PanaEXIM 2026 — Fase 8

Web bilingüe oficial de **PanaEXIM 2026 — 4 Events. Infinite Opportunities.**

Esta versión reconstruye la experiencia pública con una dirección cinematográfica y editorial, manteniendo el backend privado, el panel administrativo y la seguridad preparados en la Fase 5.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4 + CSS personalizado
- GSAP + ScrollTrigger
- Supabase Auth, Postgres, Storage y Row Level Security
- GitHub Actions
- Vercel

## Rediseño público de Fase 8

### Hero

- Composición full-screen editorial, no una tarjeta genérica.
- Cuatro franjas visuales interactivas, una por feria.
- PanaEXIM 2026 como foco principal.
- Fecha, sede y CTA con jerarquía simplificada.
- Cuenta regresiva integrada en una franja inferior.
- Versión móvil diseñada como experiencia propia, no como reducción del escritorio.

### Showcase cinematográfico

- Sustituye el carrusel 3D anterior.
- Cuatro escenas full-screen para:
  - Panama Jewellery Show
  - PanaCosmetica
  - PanaDefensa International
  - PanaEnergy
- Cada escena se reconstruye mediante siete paneles verticales reales.
- Las transiciones alternan desplazamiento vertical, máscaras, profundidad y cambios de color ambiental.
- El scroll controla la animación mediante GSAP ScrollTrigger.
- Navegación adicional mediante indicadores y flechas.
- En móvil se utiliza swipe nativo y `scroll-snap`, sin bloquear el desplazamiento durante varios viewports.
- Alternativa accesible para `prefers-reduced-motion`.

### Identidad y recursos

- Nuevas versiones transparentes de logos.
- Variante PanaEXIM dorada para fondos oscuros.
- Variante PanaEXIM oscura para fondos claros.
- PanaCosmetica clara para fondos oscuros.
- Nuevas imágenes horizontales y verticales para las cuatro ferias.
- Formatos WebP optimizados para hero, showcase y Open Graph.
- Nueva combinación tipográfica:
  - Bodoni Moda
  - Manrope
  - IBM Plex Mono

### Secciones restantes

- Nuevo manifiesto institucional de PanaEXIM.
- Cifras y logos organizados en composición editorial.
- Secciones de oportunidades, participantes, sede, contacto y footer refinadas.
- Menos bordes redondeados, píldoras y tarjetas repetitivas.
- Mayor uso de tipografía, líneas, espacios negativos e imágenes full-bleed.

## Funciones conservadas

- Rutas públicas `/es` y `/en`.
- Área privada `/es/participants` y `/en/participants`.
- Panel administrativo `/es/admin` y `/en/admin`.
- Supabase Auth y tabla adicional `admin_users`.
- Gestión de participantes, logos, filtros y estados de publicación.
- Contraseña privada validada en servidor.
- Cookie firmada, `HttpOnly`, `SameSite=Strict` y segura en producción.
- Límite de intentos y hash `scrypt`.
- RLS y bucket privado para logos.
- SEO, Schema, Open Graph, sitemap, robots y páginas legales.

## Instalación

Requiere Node.js 22 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir:

```text
http://localhost:3000/es
http://localhost:3000/en
http://localhost:3000/es/admin
http://localhost:3000/es/participants
```

## Configurar Supabase

Ejecuta en el SQL Editor:

```text
supabase/migrations/202608020001_phase5.sql
```

Opcionalmente:

```text
supabase/seed.sql
```

Crea un usuario administrativo en **Authentication → Users** y registra su UUID:

```sql
insert into public.admin_users (user_id, display_name)
values ('UUID_DEL_USUARIO', 'Administrador PanaEXIM');
```

## Variables de entorno

```env
NEXT_PUBLIC_SITE_URL=https://dominio-final.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
PARTICIPANTS_ACCESS_PASSWORD=contraseña-temporal-fuerte
PARTICIPANTS_SESSION_SECRET=secreto-aleatorio-de-32-caracteres-o-más
PARTICIPANTS_RATE_LIMIT_SECRET=otro-secreto-aleatorio
```

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` mediante una variable `NEXT_PUBLIC_*`.

## GitHub y Vercel

```bash
git init
git add .
git commit -m "feat: cinematic PanaEXIM phase 8"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

En Vercel:

1. Importa el repositorio.
2. Usa Node.js 22.
3. Configura las variables para Preview y Production.
4. Despliega.
5. Comprueba `/es`, `/en`, `/es/admin` y `/es/participants`.

## Verificación

```bash
npm run verify
```

El workflow `.github/workflows/ci.yml` ejecuta validación estática, TypeScript, ESLint y build. Consulta `VALIDACION-FASE-8.md` para el inventario detallado de pruebas y pendientes.
