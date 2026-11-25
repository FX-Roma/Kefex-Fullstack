# KEFEX Backend

API REST de KEFEX. El backend centraliza autenticación, autorización, reglas de negocio, acceso a MongoDB, gestión de productos y recursos comunitarios.

## 1. Stack y arquitectura

- Node.js con ES Modules (`"type": "module"`).
- Express 5 para el servidor HTTP y el montaje de rutas.
- MongoDB Atlas y Mongoose para persistencia.
- JWT para autenticación y `bcryptjs` para hashing de contraseñas.
- Multer para recibir imágenes multipart.
- Nodemailer para el flujo de recuperación de contraseña.
- Morgan y CORS para logging de solicitudes y control de origen.

El flujo habitual de una petición protegida es:

`Express server -> Route -> Authentication/Role middleware -> Controller -> Mongoose Model -> MongoDB`

La ruta decide qué middleware se ejecuta y en qué orden. El controlador aplica las reglas del recurso y el modelo define la estructura persistida.

## 2. Estructura del servidor

```text
src/
├── Controller/       # Casos de uso y respuestas HTTP
├── Models/           # Schemas y modelos Mongoose
├── Routes/           # Endpoints y composición de middleware
├── middleware/        # JWT/RBAC y carga de archivos
├── connection.js     # Conexión a MongoDB
├── server.js         # Configuración de Express y rutas
└── index.js          # Bootstrap, configuración y cierre
```

Referencias principales:

- [`src/index.js`](src/index.js#L1-L22): carga de variables, validación de JWT, conexión antes de escuchar y cierre ordenado.
- [`src/connection.js`](src/connection.js#L1-L7): conexión Mongoose mediante `KEFEX`.
- [`src/server.js`](src/server.js#L1-L60): CORS, parsers, static uploads, rutas, health check y respuestas 404/error.
- [`src/middleware/auth.middleware.js`](src/middleware/auth.middleware.js#L1-L76): JWT, bypass local explícito de Postman y autorización por roles.
- [`src/middleware/upload.middleware.js`](src/middleware/upload.middleware.js#L1-L34): almacenamiento local y límites de carga.

## 3. Configuración

Crea `BACKEND/.env` a partir de `.env.example`. No publiques ni compartas el archivo `.env`.

| Variable | Uso |
|---|---|
| `PORT` | Puerto HTTP; el ejemplo usa `3005`. |
| `NODE_ENV` | Entorno de ejecución. |
| `KEFEX` | URI de conexión MongoDB. Es el nombre que lee `connection.js`. |
| `JWT_SECRET` | Secreto para firmar tokens; `index.js` exige al menos 32 caracteres. |
| `JWT_EXPIRES_IN` | Duración del JWT; el ejemplo define `7d`. El controlador usa `8h` como fallback si no se define. |
| `FRONTEND_ORIGIN` | Orígenes permitidos por CORS; admite una lista separada por comas. |
| `POSTMAN_AUTH_BYPASS` | Debe permanecer `false` salvo pruebas locales controladas. |
| `POSTMAN_DEV_USER_EMAIL` | Cuenta activa con rol `user` para el bypass local. |
| `POSTMAN_DEV_ADMIN_EMAIL` | Cuenta activa con rol `admin` para el bypass local. |
| `EMAIL_NODE` | Cuenta remitente usada por Nodemailer en recuperación de contraseña. |
| `PASS_NODE` | Credencial de correo usada por Nodemailer. No está incluida en `.env.example`; debe configurarse localmente si se habilita el envío. |

### Configuración de MongoDB Atlas

1. Crea una base de datos y un usuario de aplicación con permisos mínimos.
2. Configura la lista de IP permitidas de Atlas para tu entorno de desarrollo.
3. Copia la URI en `KEFEX`.
4. Usa un `JWT_SECRET` aleatorio y distinto del secreto de cualquier otro entorno.
5. Mantén `POSTMAN_AUTH_BYPASS=false` en staging y producción.

## 4. Instalación y ejecución

Desde la carpeta `BACKEND`:

```bash
npm install
npm run dev
```

Para iniciar en modo normal:

```bash
npm start
```

Comprobación de sintaxis e imports relativos:

```bash
npm run check
```

El script `check-project.mjs` recorre los archivos JavaScript de `src`, ejecuta `node --check` y comprueba que los imports relativos existan.

**Nota sobre dependencias:** la suite Jest/Supertest se incorporó después del lockfile original. Ejecuta `npm install` para sincronizar `package-lock.json`; cuando el lock actualizado esté guardado en el repositorio, podrás usar `npm ci` en instalaciones reproducibles.

## 5. API disponible

Las rutas siguientes se obtienen de `src/server.js` y los archivos de `src/Routes/`. Los permisos indicados describen el middleware montado actualmente.

| Prefijo | Endpoints | Acceso |
|---|---|---|
| `/api/auth` | `POST /user/register`, `POST /user/login`, `POST /admin/login`, aliases `POST /registro`, `/inicio-sesion`, `/register`, `/login`, `POST /forgot-password`, `PUT /change-password` | Registro y login públicos; cambio de contraseña requiere JWT. |
| `/api/usuario` | `GET /profile`, `PUT /profile`, `GET /admin/all` | Perfil requiere JWT; listado requiere admin. |
| `/api/usuarios` | `POST /`, `POST /admin`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id` | Admin. |
| `/api/publicaciones` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Lectura pública; creación y edición requieren JWT; DELETE exige admin en la ruta. |
| `/api/favoritos` | `POST /`, `GET /`, `GET /usuario/:usuarioId`, `DELETE /:id` | JWT; el controlador limita el acceso al usuario propietario o admin. |
| `/api/productos` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Lectura pública; mutaciones admin. POST/PUT reciben imagen multipart. |
| `/api/carrito` | `GET /:usuarioId`, `POST /items`, `PUT /:usuarioId/items/:itemId`, `DELETE /:usuarioId/items/:itemId`, `DELETE /:usuarioId` | JWT; el controlador verifica propiedad o admin. |
| `/api/comments` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Lectura pública; escritura requiere JWT. |
| `/api/comments-for-you` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Lectura pública; escritura requiere JWT. |
| `/api/opinions` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Lectura pública; escritura requiere JWT; DELETE admin. |
| `/api/sites` | `GET /`, `GET /featured`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` | Lectura pública; mutaciones admin. |
| `/api/search` | `GET /`, `GET /trending`, `GET /category/:categoryName` | Público. |
| `/api/health` | `GET /` | Público; devuelve estado y timestamp. |

La raíz `GET /` devuelve el estado básico de la API.

### Contratos que requieren revisión

- `User-notifications.controller.js` existe, pero no hay un router de notificaciones importado ni montado en `src/server.js`. No debe documentarse como endpoint disponible.
- `User-publications.routes.js` exige rol admin para DELETE, mientras que el controlador permite propietario o admin. La regla efectiva es la de la ruta: actualmente solo admin puede alcanzar el controlador por HTTP.
- El frontend y backend han tenido diferencias históricas de nombres de campos en foro y comentarios. Valida cada contrato de extremo a extremo antes de ampliar esas funcionalidades.
- El modelo `Opinion` contiene `score` y `votes`, pero no hay una ruta dedicada para votos positivos/negativos en el router actual.

## 6. Autenticación y seguridad

### JWT y RBAC

`Auth.controller.js` genera un JWT con `id`, `name`, `email` y `rol`. El middleware verifica el Bearer token, consulta el usuario y establece `req.usuario` y `req.auth`. `autorizarRoles()` compara el rol autenticado con los roles permitidos.

La autorización de backend es la frontera de seguridad. Los guards del frontend mejoran la navegación, pero no sustituyen el middleware del servidor.

### Bypass local de Postman

El bypass solo se activa cuando se cumplen todas estas condiciones:

- `POSTMAN_AUTH_BYPASS=true`.
- La petición envía explícitamente `X-Dev-Role: user` o `X-Dev-Role: admin`.
- `NODE_ENV` no es `production`.
- La variable de email correspondiente apunta a una cuenta existente, activa y con el rol esperado.

El bypass nunca debe activarse en producción. Las peticiones normales sin `X-Dev-Role` continúan usando JWT.

### Carga de imágenes

`upload.middleware.js`:

- Guarda archivos en `BACKEND/uploads`.
- Genera nombres con timestamp y UUID.
- Acepta MIME declarados `image/jpeg`, `image/png` y `image/webp`.
- Limita a un archivo y 5 MiB.
- Usa el campo multipart `imagen`.

`server.js` expone la carpeta como `/uploads`. MongoDB guarda la ruta/URL, no el binario.

La validación actual no inspecciona magic bytes, no escanea malware y no genera derivados. Para producción se recomienda almacenamiento de objetos/CDN, validación de firma real, política EXIF, limpieza de archivos huérfanos y controles de retención.

### Riesgos pendientes antes de producción

- El frontend guarda el JWT en `localStorage`; una vulnerabilidad XSS podría permitir el robo del token.
- La recuperación de contraseña genera una contraseña temporal y la envía por correo. Un flujo con token de un solo uso, expiración y página de reset sería más seguro.
- No se observa middleware de rate limiting ni Helmet en el montaje actual de `server.js`.
- La política CORS debe configurarse con los dominios reales y no con comodines.
- Mantén las credenciales fuera del repositorio y rota cualquier secreto que haya sido compartido accidentalmente.

## 7. Pruebas y cobertura

La suite backend utiliza Jest 30 con ES Modules y Supertest. Los tests HTTP importan el Express real y ejercitan rutas y middleware; los modelos Mongoose se simulan para no conectar con Atlas.

### Alcance

Suites activas de controlador:

- `Auth.controller.unit.test.js`
- `Auth.controller.integration.test.js`
- `User-publications.controller.unit.test.js`
- `User-publications.controller.integration.test.js`

También existen pruebas de `auth.middleware` y `upload.middleware`.

Los otros 11 controladores tienen archivos unitarios e integration con `test.todo`. Son plantillas, no cobertura funcional.

### Comandos

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
npm run test:contract
```

`test:contract` ejecuta el test nativo de Node que inspecciona la colección Postman y sus requests. No envía solicitudes a un servidor remoto.

Para borrar el reporte anterior en PowerShell:

```powershell
Remove-Item -Recurse -Force .\coverage -ErrorAction SilentlyContinue
npm run test:coverage
```

Reportes:

- `coverage/lcov-report/index.html`
- `coverage/lcov.info`
- `coverage/coverage-summary.json`

La cobertura de Jest se centra en `src/Controller/**/*.js` y `src/middleware/**/*.js`. Los umbrales iniciales configurados son:

| Archivo o alcance | Branches | Functions | Lines | Statements |
|---|---:|---:|---:|---:|
| Global | 8% | 15% | 15% | 15% |
| `Auth.controller.js` | 35% | 55% | 50% | 50% |
| `User-publications.controller.js` | 50% | 75% | 65% | 65% |
| `auth.middleware.js` | 30% | 50% | 50% | 50% |
| `upload.middleware.js` | 35% | 50% | 50% | 50% |

Los umbrales iniciales son graduales porque la mayoría de controladores todavía están en `todo`. No son una métrica de cobertura ya alcanzada.

**Estado de verificación:** los archivos de prueba se revisaron estáticamente y se empaquetaron, pero deben ejecutarse en tu entorno después de instalar dependencias. No se afirma que Jest, Angular SSR ni una integración con MongoDB Atlas hayan pasado.

## 8. Notas de Exleyder - Paso a paso de ingeniería backend

Esta sección reúne las **Notas de Exleyder**: un recorrido de ingeniería basado en el código actual, desde el arranque hasta la validación. Los rangos de líneas permiten localizar cada bloque en el repositorio.

### Paso 1. Configurar la conexión a MongoDB

En [`src/connection.js`](src/connection.js#L1-L7), `connectDatabase()` lee `process.env.KEFEX` y llama a `mongoose.connect()` con un timeout de selección de servidor de 10 segundos.

La variable se llama `KEFEX`, no `MONGODB_URI`. El nombre debe mantenerse consistente con `.env.example`.

### Paso 2. Validar configuración antes de abrir el puerto

En [`src/index.js`](src/index.js#L1-L22):

- La línea 1 carga `dotenv/config`.
- Las líneas 7-8 validan que `JWT_SECRET` exista y tenga al menos 32 caracteres.
- La línea 9 espera la conexión a MongoDB.
- La línea 10 inicia Express solo después de conectar.
- Las líneas 11-15 registran el cierre ordenado ante `SIGINT` y `SIGTERM`.
- El bloque `catch` termina el proceso si la configuración o la conexión fallan.

Este orden evita que la API anuncie disponibilidad cuando la base de datos no está lista.

### Paso 3. Construir la capa HTTP

En [`src/server.js`](src/server.js#L1-L60):

- Las líneas 1-13 importan Express, CORS, Morgan y los routers.
- Las líneas 20-21 sirven archivos de `uploads`.
- Las líneas 23-28 configuran CORS y los parsers JSON/URL-encoded.
- Las líneas 31-42 montan los routers bajo prefijos `/api`.
- Las líneas 44-45 exponen un health check.
- Las líneas 47-50 centralizan errores de middleware.
- Las líneas 52-54 responden 404 a rutas desconocidas.

### Paso 4. Implementar autenticación y roles

En [`src/Controller/Auth.controller.js`](src/Controller/Auth.controller.js#L7-L11), `createToken()` firma un JWT con identidad y rol. En las líneas 27-87, el registro normaliza nombre/email, valida la contraseña, comprueba duplicados y fuerza el rol `user`.

En [`src/middleware/auth.middleware.js`](src/middleware/auth.middleware.js#L1-L76):

- Las líneas 10-34 validan el bypass local de Postman.
- Las líneas 37-45 exigen un Bearer token en el flujo normal.
- Las líneas 47-57 verifican el JWT y cargan el usuario.
- Las líneas 61-68 convierten errores de token en respuestas 401.
- Las líneas 71-76 aplican RBAC mediante `autorizarRoles()`.

### Paso 5. Definir reglas de publicación

En [`src/Controller/User-publications.controller.js`](src/Controller/User-publications.controller.js#L3-L22), `crearPublicacion()` valida tipos, limpia contenido y categoría y asocia el registro al usuario autenticado.

En las líneas 25-42, el feed admite categoría, búsqueda escapada y paginación limitada a 50 elementos. Las líneas 70-99 actualizan solo los campos permitidos y ejecutan validadores de Mongoose. Las líneas 102-126 implementan eliminación con comprobación de propiedad/rol en el controlador.

La ruta real también impone autorización: [`src/Routes/User-publications.routes.js`](src/Routes/User-publications.routes.js#L8-L12).

### Paso 6. Modelar el dominio de comercio

- [`src/Models/Product.model.js`](src/Models/Product.model.js#L3-L11) define nombre, descripción, precio, categoría, imagen, stock y valoración.
- [`src/Models/Cart.model.js`](src/Models/Cart.model.js#L3-L45) separa el schema del item y el carrito, relaciona productos y usuario y mantiene subtotales y total.
- [`src/Controller/User-cart.controller.js`](src/Controller/User-cart.controller.js) valida cantidades y stock, recalcula subtotales y comprueba que el usuario solo modifique su carrito, salvo admin.

### Paso 7. Modelar opiniones y favoritos

- [`src/Models/Opinion.model.js`](src/Models/Opinion.model.js#L11-L67) almacena título, contenido, categoría, score, contador de votos, comentarios y autor.
- [`src/Models/Favorite.model.js`](src/Models/Favorite.model.js#L2-L10) permite guardar un producto o una publicación y añade índices únicos parciales para evitar favoritos duplicados por usuario.
- Los controladores de comentarios mantienen la referencia a la opinión y actualizan `commentsCount` en los flujos implementados.

### Paso 8. Recibir y servir multimedia

En [`src/middleware/upload.middleware.js`](src/middleware/upload.middleware.js#L7-L34), el directorio se crea si no existe, el nombre de archivo se genera en el servidor y Multer aplica MIME, tamaño y cantidad de archivos.

La ruta de publicaciones conecta el middleware antes del controlador; el servidor sirve el directorio bajo `/uploads`. En producción, esta etapa debe migrarse a almacenamiento de objetos y validación de contenido real.

### Paso 9. Validar con pruebas

La suite separa:

- Unit tests para funciones de controlador y dependencias simuladas.
- HTTP integration tests con Supertest para Express, rutas, JWT, roles y upload.
- Pruebas de middleware para límites y autorización.
- Test de contrato que verifica estructura y requests de Postman.

Antes de considerar el backend listo para producción, ejecuta las suites localmente, revisa `coverage/` y valida los contratos contra una base de datos de staging, nunca contra datos de producción.
