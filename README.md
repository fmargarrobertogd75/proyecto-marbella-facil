# Marbella Facil - TFG

<p align="center">
  <strong>Plataforma web para mejorar la experiencia turistica y de servicios en Marbella</strong>
</p>

<p align="center">
  Trabajo Fin de Grado desarrollado por <strong>Roberto Garcia Delgado</strong> y <strong>Fernando Maximo Martinez Garcia</strong>
</p>

---

## Indice

1. [Descripcion del proyecto](#descripcion-del-proyecto)
2. [Objetivos](#objetivos)
3. [Funcionalidades principales](#funcionalidades-principales)
4. [Arquitectura y stack tecnologico](#arquitectura-y-stack-tecnologico)
5. [Estructura del repositorio](#estructura-del-repositorio)
6. [Puesta en marcha rapida (Docker)](#puesta-en-marcha-rapida-docker)
7. [Ejecucion en local (sin Docker)](#ejecucion-en-local-sin-docker)
8. [Variables de entorno](#variables-de-entorno)
9. [API REST (resumen de endpoints)](#api-rest-resumen-de-endpoints)
10. [Base de datos y seeders](#base-de-datos-y-seeders)
11. [Scripts utiles](#scripts-utiles)
12. [Testing y calidad](#testing-y-calidad)
13. [Despliegue](#despliegue)
14. [Roadmap y mejoras futuras](#roadmap-y-mejoras-futuras)
15. [Autores](#autores)

---

## Descripcion del proyecto

**Marbella Facil** es una aplicacion web full stack orientada a centralizar informacion y servicios de interes para residentes y visitantes de Marbella.

El sistema integra:

- Consulta de negocios, playas, eventos y noticias.
- Sistema de autenticacion y gestion de perfiles.
- Reservas de servicios con control de disponibilidad por slots.
- Favoritos, resenas y notificaciones.
- Sistema de puntos, niveles y recompensas.
- Modulos de administracion y panel de negocio.
- Chat de asistencia basado en IA (Groq API).

El objetivo es ofrecer una experiencia unificada, escalable y mantenible, con una arquitectura separada entre backend y frontend.

---

## Objetivos

- Digitalizar servicios clave relacionados con turismo, ocio y negocios locales.
- Facilitar la reserva de servicios desde una unica plataforma.
- Mejorar la participacion de usuarios mediante gamificacion (puntos y recompensas).
- Aportar herramientas de gestion para empresas y administradores.
- Sentar una base tecnica preparada para evolucionar en produccion.

---

## Funcionalidades principales

### Para usuarios

- Registro, login y gestion de sesion con tokens.
- Consulta de negocios, categorias, caracteristicas y planes.
- Consulta de playas y transporte publico.
- Consulta de eventos y noticias.
- Gestion de reservas (crear, modificar, cancelar, historial).
- Gestion de favoritos y resenas.
- Centro de notificaciones.
- Sistema de puntos (historial, niveles, canje de recompensas).

### Para negocios

- Gestion de reservas del negocio.
- Confirmacion y rechazo de reservas.
- Estadisticas y ocupacion.
- Gestion de tipos de reserva y slots de disponibilidad.

### Para administracion

- Gestion de usuarios.
- Control de negocios y estados.
- Auditoria y reportes.
- Acciones administrativas sobre puntos y canjes.

---

## Arquitectura y stack tecnologico

### Stack principal

- **Backend**: Laravel 12, PHP 8.2+ (entorno Docker con PHP 8.4-fpm), Sanctum.
- **Frontend**: React 19 + Vite 7 + React Router.
- **Servidor frontend**: Nginx.
- **Base de datos**: MySQL remota (servidor del instituto) alcanzada via Tailscale.
- **Contenedorizacion**: Docker + Docker Compose.
- **IA**: Integracion con API de Groq para chat.

### Esquema de arquitectura

```text
[ Navegador ]
      |
      v
[ Frontend React + Nginx ]  (host:100.65.1.78 puerto 3100)
      |
      v
[ Backend Laravel ] (host:100.65.1.78 puerto 8000, contenedor en host network)
      |
      v
[ MySQL ] (host:100.66.172.29 puerto 3306)
```

---

## Estructura del repositorio

```text
proyecto-marbella-facil/
|- docker-compose.yml
|- base_datos/
|  |- marbella_facil.sql
|- backend/                 # API Laravel
|  |- app/
|  |- routes/
|  |- database/
|  |- Dockerfile
|  |- docker-entrypoint.sh
|  |- composer.json
|- frontend/                # Cliente React + Vite
|  |- src/
|  |- public/
|  |- Dockerfile
|  |- nginx.conf
|  |- package.json
```

---

## Puesta en marcha rapida (Docker)

> Recomendado para una primera ejecucion integral del proyecto.

### 1) Requisitos

- Docker Desktop actualizado.
- Docker Compose habilitado.
- Una base de datos MySQL accesible con las credenciales que se definan en entorno.

### 2) Crear archivo de entorno en raiz

Crear un archivo `.env` en la raiz del repositorio (junto a `docker-compose.yml`) con:

```env
APP_KEY=base64:TU_APP_KEY_AQUI
GROQ_API_KEY=tu_groq_api_key
APP_URL=http://100.65.1.78:8000
DB_HOST=100.66.172.29
DB_PORT=3306
DB_DATABASE=marbella_facil
DB_USERNAME=desarrollador
DB_PASSWORD=clave_mysql
VITE_API_URL=http://100.65.1.78:8000/api
```

### 3) Construir y levantar servicios

```bash
docker compose up --build -d
```

### 4) Acceso

- Frontend: `http://100.65.1.78:3100`
- API backend: `http://100.65.1.78:8000/api`
- Health backend: `http://100.65.1.78:8000/up`

### 5) Ver logs

```bash
docker compose logs -f
```

### 6) Parar servicios

```bash
docker compose down
```

---

## Ejecucion en local (sin Docker)

> Opcion recomendada para desarrollo activo y depuracion detallada.

### Backend (Laravel)

1. Entrar en carpeta backend.
2. Instalar dependencias PHP.
3. Copiar entorno y generar clave.
4. Configurar BD en `.env`.
5. Ejecutar migraciones y seeders.
6. Levantar servidor.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend disponible en `http://127.0.0.1:8000`.

### Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend disponible por defecto en `http://localhost:5173`.

---

## Variables de entorno

### Backend (`backend/.env`)

Variables relevantes:

- `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL`
- `GROQ_API_KEY`
- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION`

### Frontend (`frontend/.env`)

Variables relevantes:

- `VITE_API_URL` (produccion: `http://100.65.1.78:8000/api`, local: `http://127.0.0.1:8000/api`)
- `VITE_APP_NAME`

En produccion, el frontend debe usar la URL completa del backend (`VITE_API_URL`) y no `localhost`.

---

## API REST (resumen de endpoints)

Prefijo general: `/api`

### Publicos

- `POST /chat`
- `POST /auth/login`
- `POST /auth/register`
- `GET /negocios`
- `GET /negocios/{id}`
- `GET /categorias`
- `GET /caracteristicas`
- `GET /planes`
- `GET /playas`
- `GET /playas/{id}`
- `GET /transporte/lineas`
- `GET /transporte/paradas/{linea_id}`
- `GET /eventos`
- `GET /noticias`
- `GET /resenas/{negocio_id}`
- `POST /mensajes`
- `GET /banners/{slug}`
- `POST /banners/{id}/click`
- `GET /recompensas`
- `GET /niveles`
- `GET /negocios/{id}/tipos-reserva`
- `GET /negocios/{id}/slots-disponibilidad`

### Protegidos (auth:sanctum)

- `POST /auth/logout`
- `GET /auth/me`
- CRUD y acciones sobre reservas, favoritos, resenas y notificaciones.
- Endpoints de puntos/recompensas para usuario autenticado.
- Endpoints de panel de negocio (estadisticas, ocupacion y gestion de slots/tipos).
- Endpoints administrativos bajo prefijo `admin/`.

---

## Base de datos y seeders

La carpeta `backend/database/seeders` incluye seeders para poblar datos iniciales del dominio.

Seeder principal: `DatabaseSeeder`.

Orden de carga destacado:

1. Reglas de puntos, niveles y recompensas.
2. Planes, categorias y caracteristicas.
3. Usuarios y negocios.
4. Playas, transporte, publicidad y eventos.

Comandos utiles:

```bash
php artisan migrate
php artisan db:seed
php artisan migrate:fresh --seed
```

Ademas, se incluye un volcado SQL en `base_datos/marbella_facil.sql`.

---

## Scripts utiles

### Backend

```bash
cd backend
composer setup      # Instala dependencias, prepara entorno, migra y build assets
composer dev        # Arranque de desarrollo con servicios concurrentes
composer test       # Limpia config y ejecuta tests
npm run dev         # Vite (assets backend)
npm run build       # Build de assets backend
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

---

## Testing y calidad

### Backend

- Framework de pruebas: PHPUnit 11.
- Ejecutar:

```bash
cd backend
composer test
# o
php artisan test
```

### Frontend

- Lint con ESLint:

```bash
cd frontend
npm run lint
```

Sugerencia para CI: ejecutar lint + tests en cada pull request.

---

## Despliegue

Configuracion actual orientada a contenedores:

- `backend/Dockerfile`: imagen PHP-FPM con extensiones necesarias, composer install y entrypoint para migraciones.
- `frontend/Dockerfile`: build de React y servido estatico con Nginx.
- `frontend/nginx.conf`: proxy de `/api` y `/up` hacia `backend:8000`.

Flujo sugerido:

1. Construir imagenes.
2. Inyectar variables seguras (secrets/env).
3. Ejecutar migraciones en arranque.
4. Publicar frontend y API tras reverse proxy/SSL.

---

## Roadmap y mejoras futuras

- Cobertura de tests automatizados mas amplia (feature + integracion).
- Pipeline CI/CD completo con validacion de calidad.
- Observabilidad (metricas, tracing y alertas).
- Mejoras de accesibilidad (WCAG) y UX en flujos criticos.
- Sistema de roles/permisos mas granular.
- Internacionalizacion completa y soporte multiidioma.

---

## Autores

- **Roberto Garcia Delgado**
- **Fernando Maximo Martinez Garcia**

Proyecto academico de Trabajo Fin de Grado.
