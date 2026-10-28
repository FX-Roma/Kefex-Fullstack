# KEFEX API — Postman y separación USER / ADMIN

## 1. Qué cambia

La API incorpora namespaces canónicos separados por rol:

- `POST /api/auth/user/register`: registro público; siempre crea `rol: "user"`.
- `POST /api/auth/user/login`: inicio de sesión de cuentas `user`.
- `POST /api/auth/admin/login`: inicio de sesión exclusivo para cuentas `admin`.
- `/api/user/*`: middleware de autenticación + rol `user`.
- `/api/admin/*`: middleware de autenticación + rol `admin`.

El token es JWT en ambos casos, pero la colección mantiene `{{userToken}}` y `{{adminToken}}` separados. No copies el token de un rol en el espacio del otro.

Los endpoints antiguos que consume el frontend (`/api/auth/registro`, `/api/auth/inicio-sesion`, `/api/usuario/admin/all`, `/api/usuarios`, `/api/publicaciones`, etc.) se mantienen como compatibilidad cuando corresponde. El perfil antiguo `/api/usuario/profile` queda restringido a `user`; el perfil administrativo debe utilizar `/api/admin/profile`.

## 2. Configuración local

1. Copia `.env.example` a `.env` dentro de `BACKEND`.
2. Configura `KEFEX` con la URI real de MongoDB Atlas, `JWT_SECRET` con al menos 32 caracteres aleatorios y `FRONTEND_ORIGIN`.
3. No subas `.env` ni compartas credenciales reales en Postman, capturas o repositorios.
4. Ejecuta `npm install` y luego `npm run dev`.
5. Comprueba `GET {{baseUrl}}/` y `GET {{baseUrl}}/api/health`. Estas rutas confirman que responde el servidor HTTP; no sustituyen una comprobación de datos en MongoDB.

Base URL predeterminada: `http://localhost:3005`.

## 3. Crear el primer administrador

El registro público **no puede** crear administradores. Para crear el primer admin de forma controlada:

1. Define temporalmente `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD` en el entorno del backend. Usa una contraseña única de al menos 12 caracteres.
2. Ejecuta `npm run admin:bootstrap` desde `BACKEND`.
3. El script solo crea el administrador inicial si todavía no existe ningún admin y el email no está ocupado.
4. Retira `ADMIN_PASSWORD` del entorno una vez completado el proceso.
5. Inicia sesión en Postman con `POST /api/auth/admin/login`.

Después de existir un admin, las cuentas nuevas y los cambios de rol se gestionan desde `/api/admin/users`, que exige un token de administrador. No existe un endpoint público de promoción a admin.

## 4. Flujo recomendado en Postman

1. `00 — Server & Health`: comprobar respuesta HTTP.
2. `01 — Authentication · USER`: registrar (si hace falta) e iniciar sesión. La colección guarda el token en `userToken` y el ID en `userId`.
3. `02 — Authentication · ADMIN`: iniciar sesión con una cuenta administrativa ya creada. La colección guarda el token en `adminToken` y el ID en `adminId`.
4. `03 — User Profile`: probar el perfil con `userToken`.
5. `04` a `08`: publicaciones, catálogo, carrito, foro, búsqueda y favoritos. Revisa el campo de autorización de cada solicitud: los recursos de usuario usan `userToken`; las operaciones administrativas usan `adminToken`.
6. `09 — Administration · Users & Moderation`: gestión administrativa. La creación de una cuenta con rol `admin` es opcional y solo debe ejecutarse con un `adminToken` válido.

Los IDs como `publicationId`, `productId`, `cartItemId`, `favoriteId`, `opinionId`, `commentId` y `siteId` deben corresponder a documentos reales. Algunas solicitudes de ejemplo requieren que primero se haya creado el recurso.

## 5. Rutas principales

| Propósito | Ruta canónica | Acceso |
|---|---|---|
| Registrar usuario | `POST /api/auth/user/register` | Público; crea `user` |
| Login de usuario | `POST /api/auth/user/login` | Público; solo `user` |
| Login admin | `POST /api/auth/admin/login` | Público; solo `admin` |
| Perfil usuario | `GET/PATCH /api/user/profile` | `user` autenticado |
| Perfil admin | `GET/PATCH /api/admin/profile` | `admin` autenticado |
| Usuarios y roles | `/api/admin/users` | `admin` autenticado |
| Publicación del usuario | `/api/user/publications` | `user` autenticado; edición/eliminación comprueba propiedad |
| Moderación de publicaciones | `DELETE /api/admin/publications/:id` | `admin` autenticado |
| Productos administrativos | `/api/admin/products` | `admin` autenticado |
| Sitios administrativos | `/api/admin/sites` | `admin` autenticado |
| Eliminación administrativa de opiniones | `DELETE /api/admin/opinions/:id` | `admin` autenticado |

## 6. Perfil preparado para evolución

`/api/user/profile` y `/api/admin/profile` son rutas distintas aunque inicialmente reutilizan los campos de perfil existentes (`name`, `avatar`, `biografia`). Esto deja espacio para desarrollar después opciones diferentes sin mezclar controladores de ruta ni permisos. No se agregan ahora campos administrativos ni reglas de negocio no definidas.

## 7. Pruebas y límites

- `npm test` valida estructura de la colección, separación de rutas, autorización a nivel de router y reglas de login/registro.
- `npm run check` realiza comprobaciones sintácticas de los archivos principales.
- Estas pruebas no sustituyen las pruebas de integración contra tu MongoDB Atlas ni certifican que tus credenciales de entorno sean correctas. La colección se entrega estructuralmente validada, pendiente de ejecución en tu servidor.
