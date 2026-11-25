# KEFEX

KEFEX es una plataforma web de comercio comunitario que reúne descubrimiento de productos, opiniones, reseñas, publicaciones y conversaciones. Su objetivo es ayudar a las personas a compartir experiencias de compra y tomar decisiones mejor informadas sobre tiendas y productos de comercio electrónico.

El proyecto se desarrolla como una aplicación full-stack con frontend y backend desacoplados.

## Arquitectura

- **Frontend:** Angular standalone, Angular Router, TypeScript, RxJS y Angular SSR.
- **Backend:** Node.js, Express y API REST.
- **Persistencia:** MongoDB con Mongoose.
- **Autenticación:** JWT, bcrypt y autorización por roles.
- **Pruebas backend:** Jest, Supertest y pruebas de contrato sobre la colección Postman.

La API y el cliente se ejecutan por separado. El frontend consume los endpoints del backend mediante HTTP; la seguridad real de los recursos protegidos se aplica en el servidor.

## Funcionalidades presentes en el código

- Registro e inicio de sesión de usuarios y acceso separado para administradores.
- Gestión de perfiles.
- Catálogo de productos y operaciones administrativas.
- Carrito con cantidades, subtotales y validación de stock.
- Favoritos de productos y publicaciones.
- Publicaciones comunitarias con categoría y carga de imagen.
- Opiniones, comentarios y búsqueda.
- Panel administrativo para operaciones respaldadas por la API.

La existencia de un controlador o una vista no significa que todas las interacciones sociales estén completas. Los límites y pendientes verificados se documentan en los README de cada capa.

## Estructura del repositorio

```text
KEFEX/
├── BACKEND/
│   ├── src/
│   │   ├── Controller/
│   │   ├── Models/
│   │   ├── Routes/
│   │   ├── middleware/
│   │   ├── connection.js
│   │   ├── server.js
│   │   └── index.js
│   ├── test/
│   ├── package.json
│   └── .env.example
├── FRONTEND/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   ├── componentes/
│   │   │   └── pages/
│   │   ├── main.ts
│   │   ├── main.server.ts
│   │   └── server.ts
│   ├── angular.json
│   └── package.json
├── POSTMAN/
└── README.md
```

## Documentación técnica

- [Backend: arquitectura, API, seguridad y pruebas](BACKEND/README.md)
- [Frontend: Angular, SSR, routing y servicios](FRONTEND/README.md)



## Estado y límites conocidos

- El flujo de pago y checkout real no está conectado a un proveedor de pagos.
- El feed "Siguiendo" no dispone de un grafo real de seguimiento.
- No hay una API de notificaciones montada en `server.js`, aunque existe un controlador de notificaciones.
- La carga de imágenes valida el MIME declarado y el tamaño; todavía no verifica la firma binaria del archivo ni realiza análisis antimalware.
- El token frontend se conserva en `localStorage`; se documenta el riesgo XSS en el README del frontend.
- La suite de pruebas está preparada para ejecutarse localmente. La documentación no afirma que las pruebas, el build Angular o una integración con Atlas hayan pasado en este entorno.

## Dirección visual

El código actual utiliza una interfaz oscura de estilo cyber-SaaS con acentos cyan y violeta. La intención de producto de evolucionar hacia una experiencia light y moderna debe considerarse una decisión visual pendiente de reconciliar con los estilos actuales, no una característica ya implementada.

## Convenciones de documentación

Los README enlazan a archivos y rangos de líneas de la versión de código documentada. Las rutas son relativas al repositorio y pueden abrirse directamente en GitHub cuando el proyecto se publique allí.

## Perfiles de contribución

Los perfiles individuales documentan las áreas identificadas por los prefijos históricos del código y el rol declarado en el proyecto:

- [Exleyder](README-EXLEYDER.md)
- [Andrés](README-ANDRES.md)
- [Kevin](README-KEVIN.md)

Los prefijos `A-`, `E-` y `K-` se encontraron en el archivo histórico `kefex.zip`. La versión actual normalizó los nombres de archivos, por lo que los perfiles distinguen la atribución histórica de la correspondencia con los módulos actuales. No se presenta como historial Git ni como prueba de autoría línea por línea.

# Exleyder - Perfil de contribución técnica

## Rol en KEFEX

El brief del proyecto define a Exleyder como responsable de la dirección técnica y del cierre full-stack de KEFEX, con foco en arquitectura, integración, calidad, seguridad y mantenibilidad.

Este perfil resume áreas de trabajo respaldadas por el historial del proyecto y por la evidencia de archivos. No afirma autoría exclusiva de todo el repositorio.

## Áreas atribuidas por el código histórico

En el archivo histórico `kefex.zip`, los módulos con prefijo `E-` se identifican como contribuciones de Exleyder según la convención del equipo. La versión más reciente normalizó los nombres; la correspondencia siguiente se basa en responsabilidad funcional y rutas/modelos relacionados.

| Archivo histórico | Módulo actual relacionado |
|---|---|
| `E-commentsForumController.js` | `BACKEND/src/Controller/User-comments.controller.js` |
| `E-opinionForumController.js` | `BACKEND/src/Controller/User-opinions.controller.js` |
| `E-productStoreController.js` | `BACKEND/src/Controller/Admin-products.controller.js` |
| `E-searchForumController.js` | `BACKEND/src/Controller/Search.controller.js` |
| `E-siteReviewController.js` | `BACKEND/src/Controller/Admin-sites.controller.js` |
| `E -uploadMiddleware.js` | `BACKEND/src/middleware/upload.middleware.js` |
| `E-commentsForumModule.js` | `BACKEND/src/Models/Comment.model.js` |
| `E-opinionForumModule.js` | `BACKEND/src/Models/Opinion.model.js` |
| `E-productStoreModule.js` | `BACKEND/src/Models/Product.model.js` |
| `E-searchForumModule.js` | `BACKEND/src/Models/SearchHistory.model.js` |
| `Kauth.controller.js` | `BACKEND/src/Controller/Auth.controller.js` |
| `E-siteReviewModule.js` | `BACKEND/src/Models/Site.model.js` |

No se encontró ningún archivo con prefijo `O-` en el `kefex.zip` histórico inspeccionado. Por esa razón, no se asignan módulos adicionales bajo esa inicial.

## Aporte técnico representativo

### Diseño de recursos REST y separación de responsabilidades

El trabajo histórico abarca controladores de foro, catálogo, búsqueda, reseñas de sitios y middleware de imágenes. En la versión actual, estas responsabilidades están distribuidas entre `Routes/`, `Controller/`, `Models/` y `middleware/`.

Referencias de la versión actual:

- `BACKEND/src/Routes/Admin-products.routes.js`: rutas públicas de lectura y mutaciones protegidas por rol admin.
- `BACKEND/src/Controller/Admin-products.controller.js`: operaciones del catálogo.
- `BACKEND/src/Models/Product.model.js`: schema del producto.
- `BACKEND/src/Controller/User-opinions.controller.js`: creación, lectura, actualización y eliminación de opiniones.
- `BACKEND/src/Controller/Search.controller.js`: búsqueda de opiniones y tendencias.
- `BACKEND/src/middleware/auth.middleware.js`
- `BACKEND/src/middleware/upload.middleware.js`: recepción y validación inicial de imágenes.
- `BACKEND/src/Controller/User-comments-for-you.controller.js`
- `BACKEND/src/Models/CommentForYou.model.js`
- `BACKEND/src/Controller/Auth.controller.js`
- `BACKEND/src/Routes/Auth.routes.js`

### Manejo de multimedia

El middleware actual genera nombres de archivo en el servidor, aplica una lista de MIME permitidos y limita el tamaño. La implementación se documenta en `BACKEND/README.md`, sección "Notas de Exleyder - Paso a paso de ingeniería backend", paso 8.

La validación por firma binaria y el almacenamiento en CDN permanecen como trabajo futuro; no se presentan como capacidades ya terminadas.

## Trabajo full-stack documentado en el historial

Durante las sesiones de desarrollo se abordaron integración de Angular con la API, normalización de publicaciones, estado de sesión, guards, interceptor JWT, SSR y pruebas backend. Las rutas actuales que representan estas áreas incluyen:

- `FRONTEND/src/app/core/services/publicaciones.service.ts`
- `FRONTEND/src/app/core/services/auth.service.ts`
- `FRONTEND/src/app/core/services/auth.interceptor.ts`
- `FRONTEND/src/app/app.config.server.ts`
- `FRONTEND/src/app/pages/home/home.ts`
- `FRONTEND/src/app/pages/explorer/explorer.ts`

El snapshot frontend no contiene prefijos personales en estos archivos. Por ello, se documentan como áreas trabajadas en colaboración y no como atribución individual verificable por nombre de archivo.

## Problemas técnicos y decisiones representativas

- **Compatibilidad SSR:** el bootstrap de servidor recibe `BootstrapContext` y el interceptor evita acceder a `window` fuera del navegador. Referencias: `FRONTEND/src/main.server.ts#L1-L7` y `FRONTEND/src/app/core/services/auth.interceptor.ts#L1-L11`.
- **Contrato de publicaciones:** `PublicacionesService` adapta el autor, contenido y URL multimedia de la respuesta API a un view model estable. Referencia: `FRONTEND/src/app/core/services/publicaciones.service.ts#L93-L137`.
- **Carga de imágenes:** el composer valida tipo y tamaño, redimensiona y convierte a WEBP antes de enviar `FormData`. Referencia: `FRONTEND/src/app/componentes/publication-composer/publication-composer.ts#L23-L60` y `#L65-L85`.
- **QA por capas:** la suite separa invocación directa de controladores y pruebas HTTP con Supertest, manteniendo Mongoose aislado de Atlas. El estado real de ejecución se registra en `BACKEND/README.md`.

## Enfoque de ingeniería

La contribución técnica se centra en convertir módulos heredados en una aplicación mantenible: identificar contratos reales, separar capas, conservar la compatibilidad, validar seguridad y establecer una estrategia de pruebas.

Para una entrevista técnica, los ejemplos más representativos son la composición de rutas y middleware, el flujo de autenticación JWT, la normalización del contrato de publicaciones y la preparación de pruebas unitarias e HTTP integration.



# Andrés - Perfil de contribución técnica

## Área de contribución

**Rol documentado:** contribución backend en recursos de usuarios, publicaciones, favoritos y notificaciones, identificada por los prefijos históricos `A-` del repositorio.

El código histórico de KEFEX identifica con el prefijo `A-` los módulos atribuidos a Andrés. La versión actual normalizó los nombres; la tabla relaciona los archivos históricos con los módulos vigentes por responsabilidad y contrato.

## Módulos atribuidos por el código histórico

| Archivo histórico | Módulo actual relacionado |
|---|---|
| `A-favorito.controller.js` | `BACKEND/src/Controller/User-favorites.controller.js` |
| `A-notificacion.controller.js` | `BACKEND/src/Controller/User-notifications.controller.js` |
| `A-publicacion.controller.js` | `BACKEND/src/Controller/User-publications.controller.js` |
| `A-usuario.controller.js` | `BACKEND/src/Controller/Admin-users.controller.js` |
| `A-categoria.model.js` | `BACKEND/src/Models/Category.model.js` |
| `A-favorito.model.js` | `BACKEND/src/Models/Favorite.model.js` |
| `A-notificacion.model.js` | `BACKEND/src/Models/Notification.model.js` |
| `A-publicacion.model.js` | `BACKEND/src/Models/Publication.model.js` |
| `A-usuario.model.js` | `BACKEND/src/Models/User.model.js` |
| `A-favorito.routes.js` | `BACKEND/src/Routes/User-favorites.routes.js` |
| `A-publicacion.routes.js` | `BACKEND/src/Routes/User-publications.routes.js` |
| `A-usuario.routes.js` | `BACKEND/src/Routes/Admin-users.routes.js` |

La correspondencia se realiza entre módulos históricos y actuales; no equivale a un historial Git de cambios línea por línea.

## Aporte funcional

Las áreas históricas relacionadas incluyen:

- Gestión de usuarios.
- Publicaciones comunitarias.
- Favoritos de productos y publicaciones.
- Modelos de categoría y notificaciones.

En la versión actual, los favoritos se relacionan con un usuario y con un producto o publicación. El modelo `Favorite.model.js` define índices únicos parciales para evitar duplicados por recurso.

## Referencias técnicas actuales

- `BACKEND/src/Controller/User-favorites.controller.js`
- `BACKEND/src/Models/Favorite.model.js`
- `BACKEND/src/Controller/User-publications.controller.js`
- `BACKEND/src/Models/Publication.model.js`
- `BACKEND/src/Controller/Admin-users.controller.js`
- `BACKEND/src/Models/User.model.js`
- `BACKEND/src/Controller/User-cart.controller.js`
- `BACKEND/src/Models/Cart.model.js`

## Fragmentos técnicos representativos

- **Favoritos idempotentes:** `BACKEND/src/Controller/User-favorites.controller.js#L4-L10` construye el filtro a partir del usuario autenticado y usa `findOneAndUpdate` con `upsert` y `$setOnInsert`. El modelo `BACKEND/src/Models/Favorite.model.js#L2-L9` añade índices únicos parciales para producto y publicación.
- **Publicaciones:** `BACKEND/src/Controller/User-publications.controller.js#L6-L14` valida contenido/categoría y vincula la publicación con `req.auth.id`. `#L28-L34` aplica búsqueda y paginación limitada.
- **Gestión de usuarios:** `BACKEND/src/Controller/Admin-users.controller.js#L6-L14` normaliza datos, valida longitud de contraseña y usa bcrypt. `#L16-L22` excluye el password de las respuestas de lectura.

## Estado que debe tenerse en cuenta

El controlador de notificaciones se conserva en el backend, pero el snapshot actual no tiene una ruta de notificaciones montada en `server.js`. Por tanto, el módulo se documenta como componente histórico presente, no como API accesible.

El frontend actual no utiliza prefijos personales en los archivos Angular. No se atribuyen componentes de frontend a Andrés sin una referencia adicional del equipo o historial de commits.



# Kevin - Perfil de contribución técnica

## Área de contribución

**Rol documentado:** contribución backend y frontend basadas en necesidad del team.

El código histórico de KEFEX utiliza el prefijo `K-` para identificar módulos atribuidos a Kevin. La versión actual normalizó los nombres de archivo; la correspondencia se documenta por responsabilidad funcional.

## Módulos atribuidos por el código histórico

| Archivo histórico | Módulo actual relacionado |
|---|---|
| `K-carritoController.js` | `BACKEND/src/Controller/User-cart.controller.js` |
| `K-commentsForYouController.js` | `BACKEND/src/Controller/User-comments-for-you.controller.js` |
| `K-carrito.model.js` | `BACKEND/src/Models/Cart.model.js` |
| `K-commentsForYouModule.js` | `BACKEND/src/Models/CommentForYou.model.js` |
| `K-carritoRoutes.js` | `BACKEND/src/Routes/User-cart.routes.js` |
| `K-commentsForYouRoutes.js` | `BACKEND/src/Routes/User-comments-for-you.routes.js` |

La tabla refleja la atribución histórica del archivo y la correspondencia con la estructura actual. No representa un registro de commits ni implica que todas las líneas de la versión actual fueran escritas por la misma persona.

## Aporte funcional

Las áreas históricas incluyen:

- Autenticación y sesiones de usuario.
- Gestión del carrito de compras.
- Comentarios asociados a publicaciones, opiniones o productos.


## Fragmentos técnicos representativos 

- **Autenticación:** `BACKEND/src/Controller/Auth.controller.js#L7-L11` firma el JWT con identidad y rol. `#L27-L69` muestra que el registro público crea una cuenta con rol `user` y devuelve únicamente campos públicos.
- **Carrito y stock:** `BACKEND/src/Controller/User-cart.controller.js#L8-L28` recalcula subtotales y total y rechaza cantidades superiores al stock. `#L30-L40` limita el acceso al carrito al usuario propietario o a un admin.
- **Comentarios asociados:** `BACKEND/src/Controller/User-comments-for-you.controller.js#L4-L16` valida texto y guarda el autor autenticado junto con la referencia opcional a publicación, opinión o producto.

## Evolución técnica del módulo

El flujo de autenticación actual usa bcrypt para almacenar hashes, JWT para sesiones y rutas separadas para login de usuario y administrador. El middleware comprueba el token y aplica roles. La versión actual también incluye un bypass de Postman limitado al desarrollo local; su configuración y restricciones están descritas en `BACKEND/README.md`.

El carrito mantiene cantidades, subtotales y total, y comprueba el stock antes de guardar. El controlador verifica que el usuario opere sobre su propio carrito, salvo un administrador autorizado.

El frontend no conserva prefijos personales en sus archivos. Por ello, no se asignan componentes Angular a Kevin sin evidencia adicional.

gracias por leer!