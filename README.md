# PanaEXIM 2026 — Fase 4

Prototipo funcional y bilingüe de la web oficial de **PanaEXIM 2026 — 4 Events. Infinite Opportunities.**

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- GSAP con ScrollTrigger, Observer y Draggable
- Rutas ES/EN
- Acceso privado de participantes validado en servidor
- Preparado para GitHub y Vercel

## Lo que ya incluye

- Preloader cinematográfico con GSAP.
- Hero construido por paneles verticales con la imagen maestra de PanaEXIM.
- Cuenta regresiva al 23 de noviembre de 2026, 10:00 a. m. hora de Panamá.
- Presentación institucional de PanaEXIM.
- Carrusel 3D de las cuatro ferias con rueda, arrastre, touch, flechas y cambio de ambiente visual.
- Panama Jewellery Show, PanaCosmetica, PanaDefensa International y PanaEnergy.
- Secciones de oportunidades, liderazgo, participantes, sede y contacto.
- Formulario que prepara una consulta y la envía mediante WhatsApp.
- Área privada con contraseña validada en una Route Handler y cookie HttpOnly firmada.
- SEO base, Open Graph, Schema.org, sitemap, robots y manifest.
- Páginas preliminares de privacidad y términos.
- Diseño responsive y alternativa para `prefers-reduced-motion`.

## Instalación

Requiere Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir:

```text
http://localhost:3000/es
http://localhost:3000/en
```

## Variables de entorno

```env
NEXT_PUBLIC_SITE_URL=https://dominio-final.com
PARTICIPANTS_ACCESS_PASSWORD=una-clave-fuerte
PARTICIPANTS_SESSION_SECRET=una-cadena-aleatoria-de-al-menos-32-caracteres
```

Para generar un secreto fuerte:

```bash
openssl rand -base64 48
```

No coloque las claves reales dentro del repositorio.

## GitHub

```bash
git init
git add .
git commit -m "feat: PanaEXIM 2026 phase 4 prototype"
git branch -M main
git remote add origin URL_DEL_REPOSITORIO
git push -u origin main
```

El flujo incluido en `.github/workflows/ci.yml` ejecuta typecheck, lint y build en cada cambio a `main` y en pull requests.

## Vercel

1. Crear un proyecto nuevo en Vercel.
2. Importar el repositorio de GitHub.
3. Vercel detectará Next.js automáticamente.
4. Crear las tres variables de entorno indicadas arriba para Production, Preview y Development.
5. Ejecutar el primer deployment.
6. El dominio definitivo se conecta en la etapa final.

## Participantes

La seguridad base ya está implementada. La página privada no entrega el contenido antes de validar la contraseña en el servidor.

En esta fase, el directorio muestra espacios de demostración claramente identificados. En la siguiente fase se conectará Supabase para:

- subir logos reales;
- editar participantes sin tocar código;
- asignar feria, país, categoría, web y stand;
- ordenar, activar o retirar registros;
- gestionar la contraseña desde un panel privado.

## Contacto utilizado

El prototipo usa los datos públicos actuales de Panama Jewellery Show:

- Panamá: +507 6270-6323 · ap@panamajewelleryshow.com
- Turquía: +90 542 382 96 22 · to@panamajewelleryshow.com
- Contabilidad: Carolina López · +507 6992-0333 · accounting@panamajewelleryshow.com
- Panama Pacifico International Business Center, Edificio 3485, Oficina 102, Free Zone, Ciudad de Panamá, Panamá.

## Pendientes para la siguiente fase

- Cargar los participantes y aliados reales.
- Conectar Supabase y construir el panel administrativo.
- Sustituir enlaces de exhibidor/visitante cuando sean entregados.
- Revisión legal final de privacidad y términos.
- Pruebas Lighthouse, accesibilidad y rendimiento en el deployment real.
- Conexión del dominio definitivo.
