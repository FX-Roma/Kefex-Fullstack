# KEFEX Frontend

Cliente web de KEFEX desarrollado con Angular standalone. La aplicación organiza páginas, componentes reutilizables, servicios de API, modelos de datos y controles de sesión. También incluye Angular SSR y prerender.

## 1. Stack y configuración real

- Angular 22.2, TypeScript y Angular Router.
- Angular standalone components y carga lazy de páginas.
- RxJS para flujos HTTP.
- Angular SSR mediante `@angular/ssr`.
- Angular CLI con el builder `@angular/build:application`.
- Vitest como runner de pruebas configurado por Angular.

El proyecto no es una aplicación Vite independiente ni contiene una configuración `vite.config.ts`. Angular CLI utiliza su builder de aplicación y el servidor de desarrollo de Angular; Vite es parte de la infraestructura de desarrollo de Angular, no un runtime separado que el proyecto configure directamente.

## 2. Estructura

```text
src/app/
├── core/
│   ├── guards/       # Guards funcionales de sesión y admin
│   ├── models/       # Contratos y view models
│   └── services/     # Auth, API, publicaciones, favoritos y foro
├── componentes/       # Navbar, composer, cards y componentes compartidos
├── pages/             # Home, Explorer, Login, Profile, Foro, Tienda, etc.
├── app.config.ts
├── app.config.server.ts
├── app.routes.ts
└── app.routes.server.ts
```

## 3. Instalación y ejecución

Requisitos: Node.js y npm compatibles con Angular 22.2 y el lockfile del proyecto.

Desde `FRONTEND`:

```bash
npm ci
npm start
```

El servidor de desarrollo de Angular usa `http://localhost:4200` por defecto.

Compilación de producción:

```bash
npm run build
```

Compilación continua de desarrollo:

```bash
npm run watch
```

Pruebas unitarias frontend:

```bash
npm test
```

Después de generar el build SSR, el servidor Node puede iniciarse con:

```bash
npm run serve:ssr:FRONT-END
```

El script ejecuta `dist/FRONT-END/server/server.mjs`; el servidor SSR del proyecto usa el puerto `4000` por defecto, salvo que `PORT` esté definido.

## 4. API y variables

La URL base se encuentra en [`src/app/enviroments/enviroment.ts`](src/app/enviroments/enviroment.ts#L1-L4):

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3005/api'
};
```

El frontend utiliza actualmente esta URL de desarrollo. Antes de desplegar, configura una URL de API adecuada para producción mediante la estrategia de environments/configuración de build correspondiente.

## 5. Routing y páginas

[`src/app/app.routes.ts`](src/app/app.routes.ts#L1-L20) define las rutas y carga páginas mediante `loadComponent()`.

| Ruta | Página | Protección |
|---|---|---|
| `/` | Para ti / Home | Pública |
| `/explorar` y `/explorer` | Explorer | Pública |
| `/foro` | Comunidad | Pública |
| `/login` | Inicio de sesión | Pública |
| `/registro` | Registro | Pública |
| `/recuperar-contraseña` | Recuperación | Pública |
| `/perfil` y `/profile` | Perfil | `authGuard` |
| `/admin` | Administración | `adminGuard` |
| `/tienda` | Tienda | Pública |
| `/carrito` | Carrito | `authGuard` |
| `/favoritos` | Favoritos | `authGuard` |

El guard de autenticación redirige a login y conserva `returnUrl`. El guard de administrador verifica el rol y redirige a Home si el usuario no es admin.

Los guards son controles de navegación del cliente. El backend debe volver a verificar JWT y roles en cada endpoint protegido.

## 6. SSR y prerender

### Configuración de aplicación

[`src/app/app.config.ts`](src/app/app.config.ts#L1-L13) registra:

- Router.
- HttpClient con `withFetch()`.
- El interceptor funcional `authInterceptor`.
- Zone change detection con event coalescing.

[`src/app/app.config.server.ts`](src/app/app.config.server.ts#L1-L12) combina la configuración de cliente con providers de server rendering.

### Bootstrap

- [`src/main.ts`](src/main.ts#L1-L8) inicia la aplicación en el navegador.
- [`src/main.server.ts`](src/main.server.ts#L1-L7) recibe `BootstrapContext` y llama a `bootstrapApplication()` con la configuración SSR.

### Renderizado

[`src/app/app.routes.server.ts`](src/app/app.routes.server.ts#L1-L8) configura `RenderMode.Prerender` para la ruta comodín. Por tanto, la configuración actual solicita prerender para las rutas de la aplicación.

[`src/server.ts`](src/server.ts#L1-L68) crea el servidor Express de Angular SSR, sirve assets estáticos y delega las demás peticiones a `AngularNodeAppEngine`.

## 7. Sesión y comunicación con la API

### AuthService

[`src/app/core/services/auth.service.ts`](src/app/core/services/auth.service.ts#L1-L88) concentra login, registro, recuperación, cambio de contraseña, token y estado de usuario mediante signals.

El token se guarda en `localStorage`. Esto mantiene compatibilidad con el proyecto actual, pero no es la opción más resistente frente a XSS. Para producción debe evaluarse una sesión con cookies `HttpOnly`, `Secure` y `SameSite`, junto con protección CSRF apropiada.

### Interceptor

[`src/app/core/services/auth.interceptor.ts`](src/app/core/services/auth.interceptor.ts#L1-L11):

- Comprueba que se esté ejecutando en navegador.
- Lee el token.
- Adjunta `Authorization: Bearer ...` solo a solicitudes de la API KEFEX.
- No reemplaza un header Authorization que ya exista.

El interceptor evita acceder a `window` durante SSR.

### Servicios de dominio

- `PublicacionesService`: consulta feed, búsqueda, filtros y normaliza la respuesta del backend a `PublicacionViewModel`. También actualiza el signal tras crear una publicación.
- `FavoritosService`: carga y modifica favoritos mediante la API; el fallback local se protege con `isPlatformBrowser`.
- `ForoService`: adapta opiniones y comentarios a los view models utilizados por la página de comunidad.
- `ProductosService`: encapsula operaciones del catálogo.

Los modelos de `core/models/` definen los contratos usados por componentes y servicios.

## 8. Publicaciones: flujo frontend

### Composer

[`src/app/componentes/publication-composer/publication-composer.ts`](src/app/componentes/publication-composer/publication-composer.ts#L23-L60) valida JPG, PNG y WEBP y limita la imagen a 5 MiB. El navegador reduce la dimensión máxima a 1600 px y convierte la imagen a WEBP con calidad 0.82.

En las líneas 65-85 se construye `FormData` con `contenido`, `categoria` y, si existe, `imagen`; después se llama a `PublicacionesService`.

### Servicio

[`src/app/core/services/publicaciones.service.ts`](src/app/core/services/publicaciones.service.ts#L46-L67) construye parámetros de búsqueda y normaliza la respuesta. Las líneas 82-91 envían la publicación y agregan el resultado al signal local.

Las líneas 93-137 convierten el contrato API a view model, normalizan autor y media URL y generan un título de presentación cuando el backend solo entrega contenido.

### Feed y Explorer

- [`src/app/pages/home/home.ts`](src/app/pages/home/home.ts#L18-L50) carga el feed y deriva tabs de exploración y tendencias.
- [`src/app/pages/explorer/explorer.ts`](src/app/pages/explorer/explorer.ts#L15-L45) consulta por texto/categoría y ordena por fecha o likesCount.
- `PublicationCardComponent` es la tarjeta reutilizable para mostrar publicaciones.

El tab "Siguiendo" se mantiene vacío intencionalmente hasta que exista un grafo real de follow. No se simula una relación social inexistente.

## 9. Diseño y experiencia

Los estilos globales están en `src/styles.css`; los estilos de shell y componentes se distribuyen en `src/app/app.css` y archivos CSS por componente/página.

La versión del código utiliza un tema oscuro con acentos cyan y violeta, estados de carga/error/vacío y layouts responsive. Si la dirección final de producto es light mode, debe realizarse una migración de tokens y superficies como tarea de diseño; no debe describirse como terminado mientras el CSS siga usando el tema oscuro.

## 10. Notas de Exleyder - Paso a paso de ingeniería frontend

Esta sección corresponde a las **Notas de Exleyder** y explica el recorrido técnico del cliente usando los archivos actuales.

### Paso 1. Separar el bootstrap de navegador y servidor

`src/main.ts#L1-L8` inicia el cliente. `src/main.server.ts#L1-L7` utiliza `BootstrapContext` y la configuración server. Esta separación permite que Angular cree la aplicación en ambos entornos sin asumir que el navegador está disponible.

### Paso 2. Centralizar providers

`src/app/app.config.ts#L5-L12` registra router, HttpClient y el interceptor. Los providers se mantienen en un punto común para evitar que cada página configure su propio cliente HTTP o sesión.

### Paso 3. Declarar rutas lazy

`src/app/app.routes.ts#L1-L20` carga cada página con `loadComponent()`. Esto reduce el acoplamiento inicial y permite cargar el código de una vista cuando se navega a ella.

### Paso 4. Proteger navegación y roles

- `src/app/core/guards/auth-guard.ts#L1-L8` verifica la sesión y conserva la ruta solicitada en `returnUrl`.
- `src/app/core/guards/admin-guard.ts#L1-L9` exige rol admin para el panel.

La protección definitiva debe existir en el backend; los guards solo controlan la experiencia de navegación.

### Paso 5. Adjuntar JWT de forma acotada

`src/app/core/services/auth.interceptor.ts#L1-L11` adjunta el token únicamente a solicitudes de la API. La comprobación `typeof window` evita errores por acceso a `localStorage` durante SSR.

### Paso 6. Mantener el estado de sesión

`src/app/core/services/auth.service.ts#L39-L88` gestiona el token, decodifica el JWT y expone `currentUser` mediante signal. `isAuthenticated()` comprueba la expiración del token.

**Revisión pendiente:** `getInitialTokenState()` utiliza `decoded.exp * 10000`, mientras que `isAuthenticated()` utiliza `decoded.exp * 1000`. Debe corregirse la discrepancia a `1000` antes de considerar cerrada la lógica de expiración inicial.

### Paso 7. Adaptar el contrato del backend

`PublicacionesService` convierte la respuesta Mongoose a un modelo de vista. Esta capa permite que la UI no dependa directamente de los nombres de cada campo de MongoDB y concentra el tratamiento de URL de imágenes.

### Paso 8. Componer páginas con componentes reutilizables

Home y Explorer consumen el servicio de publicaciones y comparten `PublicationCardComponent`. El composer separa selección, validación, compresión y envío de multimedia del componente de página.

### Paso 9. Validar en navegador y SSR

Después de instalar dependencias, ejecuta `npm test` y `npm run build`. Completa pruebas manuales de navegación, login, rutas protegidas, carga de imagen y respuestas de API en navegador y en el servidor SSR.

## 11. Estado de verificación

La documentación describe el código incluido en el snapshot, no una garantía de despliegue. Antes de publicar:

1. Ejecuta el build Angular con una versión de Node compatible con Angular 22.2.
2. Ejecuta las pruebas frontend.
3. Valida SSR y prerender en un entorno de navegador/servidor.
4. Prueba los contratos de API con backend de staging.
5. Revisa seguridad de token, CORS, imágenes y manejo de errores.
