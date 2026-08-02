# PanaEXIM 2026 — Fase 5

Web bilingüe oficial de **PanaEXIM 2026 — 4 Events. Infinite Opportunities.**

Esta entrega convierte el prototipo visual de la Fase 4 en una base operativa con directorio privado dinámico, panel administrativo y seguridad mediante Supabase.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4 + CSS personalizado
- GSAP, ScrollTrigger, Observer y Draggable
- Supabase Auth, Postgres, Storage y Row Level Security
- GitHub Actions
- Vercel

## Incluido

### Experiencia pública

- Sitio completo en `/es` y `/en`.
- Preloader y hero cinematográficos.
- Cuenta regresiva al 23 de noviembre de 2026 a las 10:00 a. m. de Panamá.
- Carrusel 3D de Panama Jewellery Show, PanaCosmetica, PanaDefensa International y PanaEnergy.
- Secciones institucionales, oportunidades, sede, contactos, legales, SEO y responsive.
- Alternativa para `prefers-reduced-motion`.

### Directorio privado

- Acceso mediante contraseña validada exclusivamente en el servidor.
- Cookie firmada, `HttpOnly`, `Secure` en producción y `SameSite=Strict`.
- Máximo de cinco intentos fallidos por ventana de 15 minutos.
- Contraseña almacenada como hash `scrypt` cuando se configura desde el panel.
- Fallback temporal mediante `PARTICIPANTS_ACCESS_PASSWORD`.
- Carga de participantes publicados desde Supabase.
- Buscador y filtros por evento, país y categoría.
- Logos privados servidos mediante enlaces firmados de una hora.
- La información del directorio no tiene una política pública de lectura.

### Panel administrativo

Ruta:

```text
/es/admin
/en/admin
```

Funciones:

- Inicio de sesión mediante Supabase Auth.
- Autorización adicional mediante la tabla `admin_users`.
- Crear, editar, publicar, ocultar, destacar, ordenar y eliminar participantes.
- Cargar logos PNG, JPG o WebP de hasta 4 MB.
- Guardar país, categoría, sitio web, stand y descripción ES/EN.
- Cambiar la contraseña del directorio sin modificar código ni volver a desplegar.
- Métricas de registros, publicados, destacados y países.

## Instalación local

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
```

## Configurar Supabase

### 1. Crear el proyecto

Crea un proyecto en Supabase y copia:

- Project URL
- Publishable key
- Service role key

Nunca expongas la service role key en variables `NEXT_PUBLIC_*`.

### 2. Ejecutar la migración

Abre el SQL Editor de Supabase y ejecuta:

```text
supabase/migrations/202608020001_phase5.sql
```

La migración crea:

- `admin_users`
- `participants`
- `site_settings`
- `participant_login_attempts`
- bucket privado `participant-logos`
- índices, triggers y políticas RLS

Opcionalmente puedes ejecutar:

```text
supabase/seed.sql
```

Eso agrega cuatro registros de demostración sin logos.

### 3. Crear el primer administrador

En Supabase:

1. Abre **Authentication → Users**.
2. Crea el usuario administrativo con correo y contraseña.
3. Copia su UUID.
4. Ejecuta en SQL Editor:

```sql
insert into public.admin_users (user_id, display_name)
values ('UUID_DEL_USUARIO', 'Administrador PanaEXIM');
```

Solo los usuarios presentes en `admin_users` pueden abrir el panel, aunque conozcan una contraseña válida de Supabase Auth.

### 4. Variables de entorno

```env
NEXT_PUBLIC_SITE_URL=https://dominio-final.com
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
PARTICIPANTS_ACCESS_PASSWORD=contraseña-temporal-fuerte
PARTICIPANTS_SESSION_SECRET=secreto-aleatorio-de-32-caracteres-o-más
PARTICIPANTS_RATE_LIMIT_SECRET=otro-secreto-aleatorio
```

Genera los secretos con:

```bash
openssl rand -base64 48
```

### 5. Configurar la contraseña definitiva

1. Entra a `/es/admin`.
2. Abre la sección **Contraseña del directorio privado**.
3. Guarda la contraseña definitiva.
4. Después puedes eliminar `PARTICIPANTS_ACCESS_PASSWORD` de Vercel, porque el sistema priorizará el hash almacenado en Supabase.

## GitHub

```bash
git init
git add .
git commit -m "feat: PanaEXIM 2026 phase 5"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

El workflow `.github/workflows/ci.yml` ejecuta:

```text
npm install
npm run check:static
npm run typecheck
npm run lint
npm run build
```

## Vercel

1. Importa el repositorio desde GitHub.
2. Selecciona Node.js 22.
3. Añade todas las variables de `.env.example` para Production y Preview.
4. Ejecuta el primer deployment.
5. Comprueba `/es`, `/en`, `/es/admin` y `/es/participants`.
6. El dominio final se conecta en la fase de lanzamiento.

## Seguridad aplicada

- RLS activado en todas las tablas operativas.
- El rol anónimo no puede consultar participantes, ajustes ni intentos de acceso.
- La service role key solo se utiliza en módulos marcados como server-only.
- Los logos están en un bucket privado.
- El panel valida identidad Supabase y pertenencia a `admin_users`.
- Las cargas restringen MIME, tamaño y firma binaria real; no se permiten SVG cargados por usuarios.
- Las mutaciones administrativas y de sesión rechazan solicitudes de origen cruzado.
- El directorio y el panel incluyen `noindex`, `X-Robots-Tag` y `Cache-Control: no-store`.
- Las respuestas de autenticación usan `Cache-Control: no-store`.
- Se aplican encabezados de seguridad globales, HSTS en producción y protección contra iframes.
- Cada idioma se renderiza desde el servidor con su atributo `lang` correcto.

## Verificación antes de producción

```bash
npm run verify
```

La entrega incluye `VALIDACION-FASE-5.md` con el inventario de comprobaciones realizadas y las pruebas que deben repetirse sobre la URL real de Vercel. Después del primer `npm install` exitoso, conviene versionar el `package-lock.json` generado y cambiar CI a `npm ci` para instalaciones completamente reproducibles.

Además, en el deployment de Vercel revisa:

- escritorio, tableta y móvil;
- wheel, drag y touch del carrusel;
- `prefers-reduced-motion`;
- login y logout de administración;
- creación, edición, ocultación y eliminación de un participante;
- carga y sustitución de un logo;
- cambio de contraseña del directorio;
- bloqueo tras cinco intentos incorrectos;
- filtros del directorio;
- Lighthouse y accesibilidad.

## Pendientes de las siguientes fases

- Cargar los participantes, aliados y patrocinadores reales.
- Sustituir enlaces definitivos de registro de exhibidores y visitantes.
- Revisión legal final de privacidad, términos y cookies.
- Pruebas Lighthouse sobre la URL real de Vercel.
- Conectar dominio, analítica y monitoreo de errores.
