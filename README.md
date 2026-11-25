# KEFEX — Historia completa del proyecto

> Esta es la bitácora de cómo KEFEX fue tomando forma: desde los primeros archivos HTML, CSS y JavaScript hasta la aplicación Angular + Node.js/Express + MongoDB que tenemos en la versión de trabajo más reciente. La escribimos como memoria de equipo, no como manual de instalación, finalmente desarrollada por el scrum master.

## Antes de empezar: de qué versión estamos hablando

Para reconstruir esta historia cruzamos los materiales que quedaron del proyecto:

- El archivo **`fundamentos kefex.zip`**, que conserva el prototipo visual y varias ramas de trabajo de las primeras páginas.
- El archivo **`kefex.zip`**, que conserva una etapa intermedia con `Front/` y `Back/`, además de los archivos identificados con prefijos de cada colaborador.
- La versión normalizada más reciente que tenemos en el espacio de trabajo, con `FRONTEND/` y `BACKEND/`, junto con la colección de Postman y el paquete de pruebas.
- El repositorio público: [FX-Roma/Kefex-Fullstack](https://github.com/FX-Roma/Kefex-Fullstack/).

La página pública del repositorio muestra **48 commits** en `main`. Sin embargo, en esta revisión GitHub permitió consultar la página principal, pero no entregó el detalle completo de los mensajes y diffs de esos commits. Por eso, el orden que sigue es una **cronología reconstruida a partir de los archivos y sus distintas etapas**, no una atribución inventada commit por commit. Cuando algo corresponde a una decisión documentada en el código actual, lo contamos como tal; cuando una característica aparece en una versión antigua y ya no está igual en la actual, la dejamos como parte de la evolución.

También dejamos una diferencia importante: preparar el proyecto para publicarlo, configurar servicios y corregir errores de despliegue no significa que en esta revisión hayamos vuelto a ejecutar una publicación en producción. La versión actual contiene preparación y trabajo de integración; el despliegue en vivo debe comprobarse en el entorno correspondiente.

---

## 1. La idea inicial y los primeros cimientos

1. **KEFEX empezó como una idea de comunidad alrededor de productos.** La intención no era hacer solamente una tienda, ni solamente una red social. Desde el principio se fue formando la mezcla de descubrir productos, compartir experiencias, conversar, revisar lugares y tener una parte comercial.

2. **Primero se trabajó con páginas web directas.** En `fundamentos kefex.zip` encontramos archivos como `Home.html`, `default.html`, `foro.html`, `app.js` y `style.css`. Esa etapa estaba construida con HTML, CSS y JavaScript del navegador, sin separar todavía una aplicación Angular y una API de manera formal.

3. **Se empezó por una página principal que pudiera explicar la identidad de KEFEX.** `Home.html` concentraba buena parte de la experiencia visual inicial: presentación, secciones de contenido, productos y elementos que invitaban a explorar.

4. **Se construyó una hoja de estilos general.** `style.css` fue creciendo hasta convertirse en una pieza grande del prototipo. Allí quedaron colores, fondos, distribución, tarjetas, navegación, tipografía, efectos y varios detalles visuales que ayudaron a que KEFEX dejara de parecer una página vacía.

5. **Se añadió una página de entrada o estructura general.** `default.html` funcionó como otra pieza del prototipo para reunir la navegación y la experiencia de entrada.

6. **Se comenzó a trabajar el foro como una experiencia propia.** `foro.html` y `forum-enhanced.css` muestran que el foro no se pensó solamente como una lista de comentarios: se trabajó una interfaz con categorías, filtros y diferentes formas de presentar las conversaciones.

7. **La lógica del foro empezó a separarse del HTML.** `forumEngine.js` reunió el comportamiento de la experiencia comunitaria en una clase llamada `KefexForumEngine`. Allí se fueron conectando navegación, filtros, acciones sobre publicaciones, paneles de detalle y actualización de la vista.

8. **Los datos de ejemplo del foro se separaron.** `forumData.js` quedó como fuente de datos de prueba del prototipo. Esto permitió que la interfaz tuviera contenido para explorar antes de conectar cada interacción con una base de datos real.

9. **Se incorporó una lógica de marcadores o guardados.** `BookmarkManager.js` guardaba y recuperaba elementos mediante `localStorage`. Fue una primera forma de conservar preferencias en el navegador mientras todavía no existía el flujo completo de favoritos conectado al backend.

10. **Se trabajaron las primeras interacciones de navegación.** En `app.js` quedaron funciones para abrir y cerrar el menú lateral, manejar su overlay y responder a clics. La navegación empezó a sentirse como una aplicación y no como un conjunto de documentos aislados.

11. **Se añadieron búsquedas dentro de la experiencia inicial.** El formulario de búsqueda y el evento de escritura permitían reaccionar al texto ingresado y filtrar contenido de muestra. En esa etapa la búsqueda era principalmente de interfaz y datos locales.

12. **Se construyeron carruseles y navegación de contenido.** El JavaScript inicial incorporó avance, retroceso, desplazamiento, puntos de posición y observación de elementos visibles. Esos recursos se usaron para que las secciones de productos y contenido tuvieran movimiento y jerarquía visual.

13. **Se agregaron animaciones de entrada y revelado.** `IntersectionObserver` permitió activar elementos cuando entraban en pantalla. También quedaron contadores, transiciones y funciones de revelado que luego se fueron revisando o sustituyendo en la versión Angular.

14. **Se experimentó con acciones de carrito desde el prototipo.** Los botones de producto y sus eventos dieron forma a la primera interacción comercial: seleccionar un artículo y mostrar una respuesta visual al añadirlo.

15. **Se trabajó un preloader.** En `app.js` quedó una rutina de carga que renderizaba una animación y luego la retiraba. Fue parte del esfuerzo inicial por darle a KEFEX una entrada más cuidada.

16. **Se probaron diferentes bloques de interacción del foro.** En el mismo prototipo hay código de pestañas, filtros por categoría, votos, diálogos para crear publicaciones y formularios. Algunas partes quedaron comentadas como experimentos; no las contamos como funciones activas de la versión final.

17. **Se añadieron accesos de teclado y control del menú.** El código de navegación incluyó escucha de eventos de teclado y cierre del menú, una primera aproximación a una experiencia más cómoda y menos dependiente del mouse.

18. **Se empezaron a incorporar recursos visuales propios.** Las imágenes de KEFEX, los perfiles y los videos de categorías dieron personalidad a la exploración. En el archivo de fundamentos aparecen recursos para moda, hogar, gaming, tecnología y contenido “para ti”.

19. **La exploración se convirtió en una pantalla diferenciada.** La carpeta `KEFEX Rama Andrés -explorar` reunió `Explorar.html`, `app.js`, `Styles.css`, imágenes y videos. La idea de descubrir contenido por intereses ya tenía una pantalla propia.

20. **El contenido “Para ti” empezó a tener identidad.** Los videos de `video-parati.mp4` y los demás recursos por categoría reflejan el intento de presentar contenido de forma más personalizada y visual.

21. **Se creó una página de perfil.** `KEFEX Rama Andrés - profile/` tenía su propio HTML, JavaScript, CSS e imagen. La cuenta dejó de ser solamente un nombre en la navegación y pasó a tener un espacio de usuario.

22. **Se creó la página de favoritos.** `KEFEX Rama Andrés - favoritos/` tenía una vista y estilos propios. La función de guardar contenido que antes vivía en `BookmarkManager.js` fue tomando forma de sección de producto.

23. **Se creó la página de diseñadores.** `KEFEX Rama Andrés - designers/` añadió un espacio para mostrar perfiles creativos, una extensión natural de la parte social y visual de KEFEX.

24. **Se trabajó el carrito en una rama de Kevin.** En `KEFEX Rama Kevin/` aparecen `carrito.html`, `carrito.js` y `carrito.css`. Aunque el CSS de esa versión estaba vacío, la estructura HTML y el JavaScript ya estaban dedicados al flujo del carrito.

25. **Se exploraron páginas y recursos comerciales adicionales.** `tiienda.html`, `apt.html`, `100h.html` y `iconos.html` forman parte de los experimentos y materiales de esa etapa. No todos se trasladaron como páginas independientes a la aplicación actual, pero muestran el trabajo de diseño y exploración que precedió a la estructura final.

26. **Se empezó a reconocer que el prototipo necesitaba una arquitectura compartida.** Cada página tenía su propio HTML, CSS y JavaScript; eso servía para probar ideas rápido, pero duplicaba navegación, estilos y comportamiento. El siguiente paso natural fue pasar a una estructura donde las piezas se pudieran reutilizar y conectar a una API.

---

## 2. El paso a una aplicación con frontend y backend separados

27. **Se organizó el proyecto en dos grandes partes.** En la etapa intermedia aparecen `Front/` y `Back/`. Esa separación fue el primer corte claro entre la interfaz que ve la persona y el servidor que guarda y entrega los datos.

28. **El frontend empezó a apoyarse en Angular.** La carpeta `Front/` ya contiene `angular.json`, `package.json`, `tsconfig` y la estructura `src/`. Con Angular, KEFEX dejó de depender de que cada página se cargara como un documento HTML separado.

29. **Se configuró la aplicación Angular y su punto de entrada.** `src/main.ts`, `src/app/app.ts`, `app.html`, `app.css` y la configuración de la aplicación se encargaron de montar la interfaz y dar un lugar común a las páginas.

30. **Se definieron rutas para cambiar de pantalla sin reconstruir toda la página.** `app.routes.ts` empezó a reunir las vistas principales. Más adelante, las rutas se fueron cargando de forma diferida para que cada sección tuviera su propio punto de entrada.

31. **Se introdujo TypeScript en las piezas principales.** Los modelos y servicios empezaron a describir los datos de usuarios, productos, publicaciones y foro. Eso ayudó a que los componentes compartieran contratos más claros.

32. **El backend se construyó sobre Node.js y Express.** `Back/src/index.js` y `Back/src/server.js` fueron el punto de partida para iniciar el servidor, configurar middleware y conectar las rutas.

33. **Se incorporó MongoDB mediante Mongoose.** `connection.js` concentró la conexión a la base de datos. Los datos dejaron de depender solamente del navegador y comenzaron a guardarse como documentos persistentes.

34. **Se separaron rutas, controladores y modelos.** Las rutas recibían la petición, los controladores resolvían la operación y los modelos describían la forma de los datos. Esta separación fue una base importante para que el backend creciera sin colocar toda la lógica en `server.js`.

35. **Se preparó una colección de Postman.** La colección inicial permitió probar las rutas de la API sin depender de que la interfaz Angular estuviera lista para cada operación. Con el tiempo, esa colección se reorganizó para cubrir recursos y roles.

36. **Se agregó autenticación con JWT.** La sesión pasó a representarse mediante un token firmado. El frontend podía enviar ese token cuando una operación necesitaba identificar al usuario.

37. **Se comenzó a separar el acceso de usuario y administrador.** La autenticación fue evolucionando hacia rutas de inicio de sesión distintas y verificaciones de rol, en lugar de tratar todas las cuentas como si tuvieran los mismos permisos.

38. **Se añadieron modelos de dominio.** Usuarios, publicaciones, productos, comentarios, opiniones, favoritos y carrito fueron adquiriendo sus propios esquemas de Mongoose. KEFEX empezó a representar sus entidades de negocio de manera más ordenada.

39. **Se reorganizaron los archivos con nombres más consistentes.** Los prefijos de las primeras ramas ayudaban a reconocer quién había trabajado en cada archivo, pero no eran una estructura cómoda para mantener la aplicación. En la versión normalizada se quitaron esos prefijos y se conservaron nombres por recurso y responsabilidad.

40. **Se consolidó el backend en carpetas `Controller/`, `Models/`, `Routes/` y `middleware/`.** La estructura actual mantiene esas áreas separadas y hace más fácil ubicar cada función.

---

## 3. La navegación y el diseño visual del frontend

41. **Se convirtió la navegación en un componente compartido.** `componentes/navbar/` reúne `navbar.ts`, `navbar.html` y `navbar.css`. La barra dejó de repetirse en cada página y pasó a ser una pieza común de la aplicación.

42. **Se trabajó la navegación de escritorio y móvil.** `NavbarComponent` tiene funciones para abrir y cerrar el menú móvil, responder al desplazamiento de la ventana y cerrar sesión. La navegación se adaptó para que las secciones principales fueran accesibles desde diferentes tamaños de pantalla.

43. **Se añadió comportamiento al desplazamiento.** `onWindowScroll` permite que la barra responda al movimiento de la página. En los estilos se trabajaron posiciones, fondos, estados y transiciones para que la navegación mantuviera su presencia sin ocupar innecesariamente el contenido.

44. **Se definió una identidad visual propia.** La versión actual mantiene el lenguaje cyber-SaaS de KEFEX: fondos oscuros, acentos cian y violeta, tipografía de carácter tecnológico, líneas de cuadrícula y brillos moderados. La identidad se fue aplicando a las pantallas en lugar de dejar cada una con una apariencia independiente.

45. **Se trabajaron los estilos globales.** `FRONTEND/src/styles.css` contiene reglas compartidas que sirven como base de color, tipografía y presentación. Las páginas conservan estilos específicos cuando necesitan una composición propia.

46. **Se mejoraron los estados de interacción.** En las vistas se fueron incorporando estados para formularios, botones, carga, errores, contenido vacío y navegación activa. Estos estados son importantes porque una interfaz no está terminada solamente cuando se ve bien con datos de ejemplo.

47. **Se revisó la adaptación a pantallas pequeñas.** Las páginas y componentes cuentan con estilos propios que ajustan columnas, tarjetas, navegación y formularios para que la experiencia no dependa de una pantalla de escritorio.

48. **Se reutilizaron los recursos gráficos del prototipo.** Los archivos `Kefex-ph.png`, `F-Kefex.png`, `X-Kefex.png`, `K-Kefex.png` y `KEFEX-LOGO.png` pasaron a `FRONTEND/public/assets/`. Así se mantuvo la continuidad visual entre el prototipo y la aplicación Angular.

49. **Se diseñó la página Home como el feed “Para ti”.** `pages/home/` reúne el HTML, TypeScript y CSS de la pantalla principal. La vista presenta contenido y publicaciones en un lugar central, en vez de funcionar solamente como una landing estática.

50. **Se organizó la carga del feed.** `HomeComponent` coordina la carga de publicaciones y el cambio de pestaña. La pantalla consulta el servicio y presenta la información en la estructura de tarjetas compartidas.

51. **Se diseñó la pantalla Explorar.** `pages/explorer/` tiene su propia vista y lógica. Su función es permitir que la persona descubra publicaciones por búsqueda, categoría y orden, sin mezclar esa experiencia con el feed personal.

52. **Se añadió búsqueda en Explorar.** `ExplorerComponent.search` recoge el texto y actualiza el conjunto de publicaciones. La búsqueda se conecta con el servicio de publicaciones y no se limita a filtrar elementos escritos directamente en el HTML.

53. **Se añadieron filtros de categoría.** `setCategory` cambia el grupo de contenido que se está mostrando. Esto permite navegar entre tipos de publicación y mantener la misma tarjeta visual.

54. **Se añadió ordenamiento.** `setSort` permite cambiar la forma de presentar los resultados. La pantalla separa la selección de criterios de la representación de cada publicación.

55. **Se preparó una vista de foro.** `pages/foro/` tiene una estructura amplia para presentar hilos, categorías, comentarios y formularios de creación. La interfaz conserva la idea de comunidad que ya estaba en el prototipo inicial.

56. **Se conectó la carga de hilos.** `ForoComponent.cargarHilos` consulta el servicio de foro y organiza los hilos recibidos para mostrarlos.

57. **Se añadió apertura y cierre de comentarios por hilo.** `toggleComments` cambia el estado de cada conversación. `threadKey` ayuda a identificar el hilo al que pertenece cada grupo de comentarios.

58. **Se conectó el envío de comentarios.** `submitComment` recoge el texto y lo envía al servicio correspondiente. La interfaz vuelve a cargar o actualizar la conversación después de la operación.

59. **Se añadió creación de hilos.** `crearNuevoHilo` recoge los datos del formulario y solicita al backend que guarde la nueva conversación. `abrirModal` y `cerrarModal` controlan el formulario de creación.

60. **Se diseñó la página de tienda.** `pages/tienda/` presenta productos recibidos desde la API. `loadProducts` recupera el catálogo y la vista muestra nombre, descripción, precio e imagen.

61. **Se conectó la selección de productos al carrito.** `addToCart` toma el producto seleccionado y delega la operación al servicio del carrito. La tienda y el carrito se mantienen como experiencias separadas.

62. **Se creó la página del carrito.** `pages/carrito/` muestra los artículos seleccionados y permite cambiar cantidades, retirar elementos y vaciar el carrito. La lógica de la página está en `CarritoComponent`.

63. **Se incorporó la actualización de cantidades.** `updateQuantity` transmite la nueva cantidad al servicio y actualiza la vista del carrito.

64. **Se incorporó la eliminación de artículos.** `removeItem` retira un producto concreto, mientras que `clear` permite vaciar el carrito completo.

65. **Se dejó el checkout como simulación.** `simulateCheckout` representa el cierre visual del flujo, pero no procesa pagos reales. No se conectó una pasarela de pago, por lo que KEFEX no debe presentar el checkout como una compra financiera completada.

66. **Se creó la página de favoritos.** `pages/favoritos/` recupera los elementos guardados por el usuario y los presenta en una vista propia.

67. **Se añadió una forma de retirar favoritos.** `FavoritosComponent.remove` permite quitar un elemento de la lista. `title` ayuda a presentar un título legible a partir de los datos disponibles.

68. **Se creó la página de perfil.** `pages/profile/` concentra la información personal y las opciones de cuenta. El perfil está protegido por la navegación autenticada.

69. **Se añadió navegación entre pestañas del perfil.** `cambiarPestana` permite pasar entre los apartados de la vista sin convertirlos en páginas independientes.

70. **Se conectó la actualización del perfil.** `saveProfile` recoge los campos editados y los envía a la API. El perfil pasó de ser una pantalla visual a tener una operación de actualización.

71. **Se añadió cambio de contraseña desde el perfil.** `cambiarPassword` recoge la contraseña actual y la nueva, y delega la verificación al backend.

72. **Se incorporó cierre de sesión desde el perfil.** `logout` limpia la sesión y devuelve al usuario a una zona pública.

73. **Se creó la página de diseñadores.** `pages/designers/` conserva una vista dedicada a mostrar perfiles creativos y recursos visuales. Su lógica actual es principalmente de presentación.

74. **Se creó la pantalla de inicio de sesión.** `pages/login/` contiene el formulario y su lógica. `LoginComponent.handleSubmit` valida la información ingresada y solicita la autenticación al servicio.

75. **Se añadió navegación después del login.** La pantalla lee el resultado de la autenticación y puede considerar la ruta de retorno para que el usuario vuelva al lugar desde el que intentó entrar.

76. **Se creó la pantalla de registro.** `pages/registro/` recoge los datos de una cuenta nueva y los envía al servicio de autenticación.

77. **Se añadió recuperación de contraseña.** El componente `recover/` recoge el correo y solicita al backend el proceso de recuperación. La respuesta de la interfaz se mantiene separada de los detalles de correo y persistencia.

78. **Se creó la página de administración.** `pages/admin/` reúne la vista de gestión de usuarios, publicaciones y comentarios, además de indicadores que dependen de la API disponible.

79. **Se añadió carga de usuarios al panel.** `loadUsers` consulta los usuarios que el administrador puede revisar. `isCurrentUser` ayuda a distinguir la cuenta que está usando el panel.

80. **Se añadió gestión de usuarios.** `createUser`, `toggleUserStatus` y `deleteUser` conectan las acciones de creación, activación/desactivación y eliminación con las rutas administrativas.

81. **Se añadió moderación de publicaciones y comentarios.** `loadModeration`, `deletePublication` y `deleteComment` permiten revisar y retirar contenido desde el panel.

82. **Se añadió una comprobación del servidor.** `checkServer` muestra si la API responde, para que el panel no dependa únicamente de la apariencia de la página.

83. **Se creó el componente CRUD de productos.** `componentes/admin/crud-productos/` separa la administración del catálogo del resto de la pantalla de administración.

84. **Se preparó un producto vacío para el formulario.** `productoVacio` devuelve la estructura inicial del formulario y evita que la creación dependa de campos que todavía no existen.

85. **Se conectó la carga del catálogo administrativo.** `obtenerProductos` recupera los productos que se pueden gestionar.

86. **Se añadió el modo de creación y edición.** `prepararCrear` y `prepararEditar` abren el formulario con valores nuevos o con los datos del producto seleccionado.

87. **Se añadió selección de imagen.** `seleccionarImagen` recibe el archivo elegido y lo incorpora al formulario de producto.

88. **Se conectó el guardado del producto.** `guardarProducto` distingue entre creación y actualización y envía los datos correspondientes al servicio.

89. **Se añadió cancelación del formulario.** `cancelarFormulario` cierra la edición sin guardar cambios.

90. **Se añadió eliminación de productos.** `eliminarProducto` solicita borrar el producto seleccionado y actualiza el catálogo.

---

## 4. Componentes reutilizables de publicaciones

91. **Se creó `publication-composer`.** Este componente reúne el formulario con el que una persona escribe una publicación y adjunta una imagen. Se diseñó para reutilizarse en las pantallas que muestran el feed.

92. **Se conectó la selección de imágenes.** `onImageSelected` recibe el archivo del input, valida que exista y prepara la vista previa.

93. **Se añadió optimización de imágenes en el navegador.** `prepareImage` trabaja con la imagen seleccionada, calcula sus dimensiones y la reduce si supera el máximo previsto. La idea fue evitar que una fotografía enorme viajara sin necesidad al servidor.

94. **Se convirtió la imagen a WEBP.** El flujo usa canvas y `toBlob` para generar una versión más ligera. En el código actual se busca mantener el lado mayor alrededor de 1600 píxeles y una calidad aproximada de 0,82.

95. **Se añadió la opción de retirar la imagen.** `removeImage` limpia el archivo y su vista previa, para que el usuario pueda cambiar de idea antes de publicar.

96. **Se conectó el botón de publicar.** `publish` toma el contenido y el archivo preparado y llama al servicio de publicaciones. El componente también limpia su estado después de completar el flujo correspondiente.

97. **Se creó `publication-card`.** La tarjeta comparte la presentación de una publicación entre Home, Explorar y las vistas donde se muestran elementos del feed. Esto evitó mantener diseños distintos para el mismo tipo de contenido.

98. **Se separó el HTML de la tarjeta.** `publication-card.html` describe la composición visual y permite que el componente reciba los datos de una publicación sin tener que conocer cómo se cargó desde la API.

99. **Se creó `posted-publications`.** Este componente agrupa la carga y presentación de publicaciones en secciones. `cargarSecciones` organiza la información que necesita la vista y `trackById` ayuda a Angular a reconocer cada elemento cuando cambia la lista.

100. **Se añadió apertura de una publicación.** `abrirPublicacion` gestiona la selección de un elemento desde la lista. `normalizeCategory` normaliza categorías para que el mismo contenido no se clasifique de forma distinta por diferencias de escritura.

101. **Se conectó el feed con el servicio de publicaciones.** La pantalla ya no depende de tarjetas escritas manualmente: recibe los datos del backend y los transforma al formato que entiende el componente.

102. **Se normalizaron los datos que llegan de la API.** El frontend adapta campos como autor, contenido, categoría e imagen a un modelo de vista consistente. Esto ayudó a evitar que cada página tuviera que interpretar por su cuenta las diferencias de la respuesta del servidor.

103. **Se resolvieron rutas de imágenes.** `resolveMediaUrl` convierte rutas relativas o referencias de multimedia en una URL que el frontend puede mostrar. Esta parte fue importante porque los archivos se guardan en el backend y se sirven desde una dirección distinta a la de Angular.

104. **Se mantuvo un título legible cuando faltaban datos.** `createTitle` genera una presentación de texto a partir del contenido disponible, evitando que las tarjetas queden visualmente vacías cuando no existe un título independiente.

105. **Se incorporaron categorías y búsqueda al servicio.** `obtenerPorCategoria` y `buscar` permiten que Explorar reutilice la misma lógica de consulta sin duplicarla en el componente.

106. **Se añadió paginación al contrato de publicaciones.** El backend puede recibir página y límite, y el frontend mantiene una estructura preparada para consultar cantidades controladas en lugar de pedir todo el contenido sin límite.

107. **Se conectó la creación de publicaciones a la identidad autenticada.** La interfaz envía el contenido, pero el backend toma el autor desde la sesión verificada. Así la cuenta no depende de un autor que el navegador pueda inventar en el cuerpo de la petición.

108. **Se dejó clara la diferencia entre feed y seguimiento.** La pantalla principal puede mostrar publicaciones disponibles, pero un feed real de “personas seguidas” necesita una relación de seguimiento persistida. Esa relación no se debe dar por implementada solo porque existe la pestaña o el nombre de la sección.

---

## 5. Servicios, modelos y sesión del frontend

109. **Se creó `AuthService`.** `auth.service.ts` concentra la comunicación de login, recuperación y cambio de contraseña, además del manejo del token de sesión.

110. **Se conectó el login con la API.** `login` envía las credenciales y conserva el token que devuelve el backend.

111. **Se conectó la recuperación de contraseña.** `forgotPassword` envía el correo y devuelve la respuesta del servidor al componente de recuperación.

112. **Se conectó el cambio de contraseña.** `changePassword` transmite la contraseña actual y la nueva, dejando la comprobación de seguridad en el backend.

113. **Se centralizó la escritura y lectura del token.** `setToken` y `getToken` evitan que cada página acceda directamente al almacenamiento de sesión.

114. **Se añadió cierre de sesión.** `logout` elimina el token local y reinicia el estado de autenticación.

115. **Se añadió lectura de datos del JWT.** `decodeToken` permite leer las claims que necesita el frontend, como el rol y la expiración, sin sustituir la validación real que hace el servidor.

116. **Se añadió comprobación de sesión.** `isAuthenticated` revisa si existe un token válido según su expiración. Durante las revisiones se detectó una diferencia entre el multiplicador usado para inicializar el estado del token y el usado al comprobarlo; quedó documentada como corrección pendiente de consistencia.

117. **Se añadió lectura del rol.** `getUserRole` permite que la interfaz muestre o habilite navegación de usuario o administrador. El rol que decide el acceso real sigue siendo el que valida el backend.

118. **Se creó `auth.interceptor`.** El interceptor toma el token y lo agrega a las peticiones dirigidas a la API de KEFEX. No debe enviar el token a cualquier dominio externo.

119. **Se adaptó el interceptor al renderizado del servidor.** El código evita depender de objetos exclusivos del navegador cuando se ejecuta durante SSR.

120. **Se creó `authGuard`.** Este guard protege las rutas que requieren sesión, como perfil, favoritos y carrito. Su función es ordenar la navegación del frontend, no reemplazar la seguridad de los endpoints.

121. **Se creó `adminGuard`.** Este guard verifica el rol que conoce el servicio de autenticación antes de permitir entrar al panel. El backend vuelve a comprobar el rol en cada operación administrativa.

122. **Se añadieron pruebas de los guards.** `auth-guard.spec.ts` y `admin-guard.spec.ts` cubren el comportamiento de navegación de ambos guardianes.

123. **Se definieron modelos de credenciales.** `credential.ts` representa la información que se envía al iniciar sesión, separándola de los datos de perfil.

124. **Se definió el modelo de usuario.** `usuario.model.ts` describe los datos de cuenta que usa el frontend para mostrar y editar el perfil.

125. **Se definió el modelo de producto.** `producto.model.ts` establece los campos que necesita la tienda y la administración de catálogo.

126. **Se definió el modelo de publicación.** `publicacion.model.ts` representa el contenido que aparece en las tarjetas y en las listas.

127. **Se definió el modelo del foro.** `foro.model.ts` recoge la estructura de hilos, comentarios y categorías que utiliza la interfaz comunitaria.

128. **Se creó `FavoritosService`.** El servicio reúne carga, conversión, actualización y persistencia de favoritos.

129. **Se añadió `cargarFavoritos`.** Recupera los favoritos disponibles y los convierte al modelo que entiende la pantalla.

130. **Se añadió `toggleFavorito`.** La función permite agregar o quitar un elemento y mantener una sola entrada por publicación o producto.

131. **Se añadieron funciones de normalización de favoritos.** `toViewModel`, `readFavoriteId` y `createTitle` adaptan las distintas formas de datos que pueden aparecer en los favoritos.

132. **Se añadió persistencia local como apoyo.** `persist` y `restoreLocalFavorites` mantienen una recuperación local para los casos previstos por el servicio. La persistencia local no sustituye la fuente del servidor cuando el favorito está asociado a una cuenta.

133. **Se creó `ForoService`.** Este servicio concentra la consulta de hilos, consulta de comentarios, envío de comentarios y adaptación de categorías.

134. **Se creó `ProductosService`.** `obtenerTodos`, `obtenerPorId`, `crear`, `actualizar` y `eliminar` reúnen las operaciones del catálogo. La tienda y el CRUD administrativo utilizan el mismo punto de acceso.

135. **Se creó `PublicacionesService`.** `getAll`, `obtenerPorCategoria`, `buscar` y `crearPublicacion` concentran las operaciones del feed y la creación de contenido.

136. **Se añadieron modelos de vista en el servicio.** `toViewModel` adapta la respuesta del backend a los campos que necesita la interfaz, reduciendo el trabajo repetido en Home y Explorar.

137. **Se mantuvo la configuración de API en un solo lugar.** `enviroment.ts` contiene la URL base que usa Angular para comunicarse con el backend. El nombre de la carpeta en el proyecto actual conserva la grafía histórica `enviroments`.

---

## 6. Renderizado del frontend y rutas

138. **Se incorporó renderizado del lado del servidor.** La aplicación actual tiene `main.server.ts`, `app.config.server.ts`, `app.routes.server.ts` y `server.ts`. Angular puede preparar HTML desde el servidor además de renderizar la interfaz en el navegador.

139. **Se separó la configuración común de la configuración de servidor.** `app.config.ts` reúne providers generales; `app.config.server.ts` agrega la configuración específica que necesita el renderizado del lado del servidor.

140. **Se configuró el bootstrap de servidor.** `main.server.ts` y `BootstrapContext` conectan el arranque de Angular con el entorno SSR. Esta firma fue ajustada durante la revisión técnica para alinearse con la forma esperada por la versión de Angular utilizada.

141. **Se definieron rutas de renderizado.** `app.routes.server.ts` establece el comportamiento de renderizado de rutas, incluyendo la estrategia de prerender que aparece en el estado actual.

142. **Se preparó el servidor Angular.** `src/server.ts` usa el motor de Angular para atender las solicitudes SSR. Esto es distinto del servidor Express del backend: uno entrega la aplicación Angular y el otro entrega la API de KEFEX.

143. **Se aplicó carga diferida de páginas.** Las rutas usan `loadComponent` para importar cada vista cuando se necesita. Esto ayuda a mantener separadas las pantallas y a no cargar todos sus componentes desde el primer momento.

144. **Se conservaron alias de rutas.** `home` redirige a la ruta raíz; `explorer` y `explorar`, así como `profile` y `perfil`, permiten conservar accesos con nombres alternativos.

145. **Se añadieron títulos a las rutas.** Cada ruta principal declara un título de página, lo que ayuda a mantener una navegación más clara y una identificación consistente de cada sección.

146. **Se añadió una ruta comodín.** Las rutas que no coinciden con una página conocida vuelven a la página raíz. Esto evita dejar una pantalla sin salida dentro de la aplicación.

147. **Se mantuvo una prueba básica de aplicación.** `app.spec.ts` verifica que la aplicación pueda montarse y que el elemento principal se encuentre presente. Es una prueba inicial de arranque, no una prueba completa de todas las páginas.

---

## 7. Construcción del backend: servidor, conexión y rutas

148. **Se organizó el arranque del backend.** `BACKEND/src/index.js` carga la configuración, valida los datos necesarios y prepara el servidor antes de aceptar tráfico.

149. **Se separó la conexión a MongoDB.** `connection.js` contiene `connectDatabase`, que toma la URI de configuración y abre la conexión con Mongoose.

150. **Se hizo que el servidor dependa de la conexión.** El backend espera a que MongoDB esté conectado antes de comenzar a escuchar solicitudes. Esto evita iniciar una API que aparenta estar disponible pero no puede guardar ni consultar datos.

151. **Se añadió validación de configuración.** El arranque revisa que exista un secreto JWT adecuado. La aplicación no debería iniciar con una clave vacía o débil.

152. **Se añadió manejo de cierre.** `index.js` registra el cierre del servidor y la conexión cuando el proceso termina. Esto ayuda a que el apagado sea ordenado.

153. **Se construyó la capa HTTP en `server.js`.** Allí se configura Express, se registran los middleware, se sirven los archivos estáticos y se conectan las rutas de cada recurso.

154. **Se configuró CORS.** El backend define los orígenes permitidos para que el frontend pueda comunicarse con la API sin abrir indiscriminadamente el acceso desde cualquier sitio.

155. **Se configuraron los parsers de petición.** Express interpreta los cuerpos JSON y los datos de formularios que llegan desde la interfaz o Postman.

156. **Se configuró el directorio de archivos subidos.** Las imágenes se guardan en `BACKEND/uploads/` y se sirven mediante una ruta estática del backend.

157. **Se añadió una ruta de salud.** `/api/health` permite comprobar si el servidor responde. Esta comprobación no significa por sí sola que todos los recursos o la base de datos estén funcionando correctamente.

158. **Se conectaron las rutas de autenticación.** `/api/auth` reúne registro, login, recuperación y cambio de contraseña.

159. **Se conectaron las rutas de perfil y usuarios.** `/api/usuario` reúne operaciones de perfil y algunas operaciones administrativas de usuarios.

160. **Se conectaron las rutas de publicaciones.** `/api/publicaciones` permite consultar, crear, editar y eliminar publicaciones según las reglas de acceso.

161. **Se conectaron las rutas de comentarios y foro.** `/api/comments` y `/api/comments-for-you` representan los dos flujos de comentarios que conserva el backend.

162. **Se conectaron las rutas de opiniones.** `/api/opinions` administra opiniones del foro y sus operaciones asociadas.

163. **Se conectaron las rutas de sitios.** `/api/sites` reúne las operaciones de reseñas y administración de sitios.

164. **Se conectó la búsqueda.** `/api/search` concentra la búsqueda de contenido en los recursos que contempla el controlador.

165. **Se conectaron las rutas de productos.** `/api/productos` gestiona el catálogo y sus operaciones administrativas.

166. **Se conectó el carrito.** `/api/carrito` mantiene las operaciones de consulta y modificación del carrito del usuario.

167. **Se conectaron los favoritos.** `/api/favoritos` permite guardar, consultar y retirar favoritos.

168. **Se mantuvieron rutas de usuarios con responsabilidades administrativas.** `/api/usuarios` expone operaciones de gestión que requieren permisos, separadas del perfil propio.

169. **Se añadieron respuestas para errores y rutas desconocidas.** El servidor termina con manejo de error y una respuesta 404 para solicitudes que no coinciden con rutas registradas.

170. **Se dejó constancia de un controlador que aún no está montado.** `User-notifications.controller.js` existe, pero la ruta de notificaciones no aparece conectada en `server.js` en la versión revisada. Por eso no contamos las notificaciones como una función de API completa.

---

## 8. Modelos de MongoDB: qué empezamos a guardar

171. **Se creó el modelo `User`.** `User.model.js` representa la cuenta, sus datos básicos, la contraseña cifrada, el rol y el estado de la cuenta. La contraseña no se debe devolver en respuestas públicas.

172. **Se creó el modelo `Publication`.** `Publication.model.js` guarda el contenido de la publicación, su autor, categoría y la referencia de multimedia cuando existe.

173. **Se creó el modelo `Comment`.** `Comment.model.js` representa comentarios asociados al foro/opiniones según el contrato que mantiene la versión actual.

174. **Se creó el modelo `CommentForYou`.** `CommentForYou.model.js` mantiene el flujo de comentarios que se utiliza en la sección correspondiente.

175. **Se creó el modelo `Opinion`.** `Opinion.model.js` representa opiniones del foro y los datos relacionados con productos que contempla su esquema.

176. **Se creó el modelo `Favorite`.** `Favorite.model.js` registra la relación de un usuario con el elemento que decidió guardar.

177. **Se creó el modelo `Cart`.** `Cart.model.js` organiza el carrito y sus artículos, incluyendo cantidades y referencias de producto.

178. **Se creó el modelo `Product`.** `Product.model.js` contiene los datos del catálogo: nombre, descripción, precio e información de imagen que consume la tienda.

179. **Se creó el modelo `Site`.** `Site.model.js` representa reseñas o información de sitios que administra el recurso correspondiente.

180. **Se creó el modelo `Category`.** `Category.model.js` describe categorías que se pueden utilizar para organizar contenido y recursos.

181. **Se creó el modelo `Notification`.** `Notification.model.js` define la estructura de notificaciones, aunque su controlador todavía no está integrado como una ruta activa en el servidor revisado.

182. **Se creó el modelo `SearchHistory`.** `SearchHistory.model.js` representa el historial de búsqueda que puede asociarse a la actividad de un usuario.

183. **Se conservó `UserRecord.model.js`.** El archivo existe en la estructura actual, pero no contiene una definición activa en el snapshot revisado. Lo dejamos registrado como archivo presente, no como una entidad operativa confirmada.

184. **Se revisaron los contratos entre modelos y controladores.** En el proceso de normalización aparecieron diferencias de nombres y campos heredadas de las ramas anteriores. Parte de la revisión consistió en alinear el modelo que guarda MongoDB con los datos que el controlador espera recibir y devolver.

---

## 9. Autenticación, roles y seguridad del backend

185. **Se creó el middleware de autenticación.** `auth.middleware.js` contiene `autenticar`, que revisa si la petición lleva un token Bearer y si ese token puede verificarse.

186. **Se añadió validación de JWT.** El middleware utiliza el secreto configurado para verificar la firma y leer las claims de la sesión.

187. **Se comprueba la cuenta en la base de datos.** La autenticación revisa que el usuario exista y que la cuenta siga activa. No basta con que el token tenga una firma válida si la cuenta fue deshabilitada.

188. **Se evita cargar la contraseña en la consulta de autenticación.** El middleware utiliza una proyección que excluye el campo de contraseña, para no mantener el hash en el objeto de usuario que se entrega a los controladores.

189. **Se añadió autorización por rol.** `autorizarRoles` limita rutas a los roles que corresponden. Esta comprobación se ejecuta en el backend, donde no puede ser sustituida por una decisión visual del frontend.

190. **Se preparó un bypass limitado para Postman en desarrollo.** `POSTMAN_AUTH_BYPASS` y los correos configurados para usuario y administrador permiten una vía controlada de pruebas locales. El middleware bloquea el bypass cuando el entorno no es de desarrollo.

191. **Se mantuvo el bypass desactivado por defecto.** La configuración actual establece `POSTMAN_AUTH_BYPASS=false`. El bypass no se debe convertir en una forma normal de autenticar usuarios ni permanecer habilitado en producción.

192. **Se separó el login de usuario y administrador.** El controlador ofrece funciones de login específicas por rol. La solicitud no puede elegir libremente un rol superior desde el cuerpo del registro público.

193. **Se protegieron las operaciones de administración.** La gestión de usuarios, productos y otros recursos administrativos requiere permisos de administrador en las rutas y controladores correspondientes.

194. **Se restringió el carrito al propietario.** Las operaciones del carrito se basan en el usuario autenticado y no deberían permitir que una cuenta modifique el carrito de otra.

195. **Se protegieron los favoritos.** Las operaciones de favoritos requieren sesión y se relacionan con la cuenta que realiza la petición.

196. **Se añadió validación de carga de imágenes.** `upload.middleware.js` permite imágenes de tipos admitidos y establece un límite de tamaño de 5 MiB para el archivo recibido.

197. **Se generaron nombres de archivo en el servidor.** Multer utiliza nombres generados para que el cliente no controle directamente el nombre final del archivo almacenado.

198. **Se documentó una mejora pendiente de seguridad multimedia.** La validación actual se basa en el tipo MIME declarado y el tamaño. Aún hace falta comprobar la firma real del archivo y considerar análisis antimalware antes de una operación de producción más exigente.

199. **Se documentó el almacenamiento local de imágenes.** La versión actual guarda archivos en `BACKEND/uploads/`. Para un despliegue escalable, conviene evaluar almacenamiento externo persistente y una política de limpieza de archivos.

200. **Se documentó el almacenamiento de JWT en `localStorage`.** Es compatible con la implementación actual, pero un XSS podría exponer el token. La evolución de seguridad debería evaluar cookies `HttpOnly`, `Secure`, `SameSite` y protección CSRF según el despliegue.

201. **Se documentó la recuperación de contraseña heredada.** El flujo actual genera y envía una contraseña temporal y persiste su hash. Para una versión más segura, la recuperación debería evolucionar hacia un token de un solo uso con vencimiento, sin enviar contraseñas por correo.

---

## 10. Controladores del backend: las operaciones que fuimos construyendo

### Autenticación

202. **Se creó `Auth.controller.js`.** Este controlador concentra la creación de tokens, registro, login, recuperación y cambio de contraseña.

203. **Se añadió `createToken`.** La función firma el JWT con la información de identidad y rol que necesita la sesión.

204. **Se añadió generación de contraseña temporal.** `generarContrasenaAleatoria` forma parte del flujo de recuperación heredado.

205. **Se configuró el envío de correo.** El controlador utiliza el transporte de correo y las variables `EMAIL_NODE` y `PASS_NODE` cuando el proceso de recuperación necesita enviar un mensaje.

206. **Se añadió `registro`.** La función valida los datos requeridos, normaliza el correo, cifra la contraseña, guarda el usuario y devuelve una proyección segura.

207. **Se añadió `loginForRole`.** Esta función comparte la lógica de autenticación y permite que los endpoints de usuario y administrador exijan el rol que corresponde.

208. **Se añadieron `iniciarSesionUsuario` e `iniciarSesionAdmin`.** Son las entradas específicas para cada tipo de login y ayudan a mantener separados los contratos de acceso.

209. **Se añadieron alias de autenticación heredados.** Algunas rutas mantienen nombres anteriores para conservar compatibilidad con clientes y pruebas de etapas previas.

210. **Se añadió `forgotPassword`.** La función valida el correo y mantiene una respuesta genérica para no revelar fácilmente si una cuenta existe.

211. **Se añadió `cambiarPassword`.** La función verifica la contraseña actual, valida la nueva y actualiza el hash solamente cuando se cumplen las condiciones.

### Perfil y administración de usuarios

212. **Se creó `Profile.controller.js`.** Este controlador concentra lectura y actualización del perfil propio, además de la lista administrativa.

213. **Se añadió `obtenerPerfil`.** Devuelve los datos del usuario autenticado sin exponer información sensible.

214. **Se añadió `actualizarPerfil`.** La función actualiza los campos permitidos del perfil y mantiene la identidad ligada a la sesión.

215. **Se añadió `listarUsuariosAdmin`.** Permite que el administrador consulte usuarios mediante una ruta protegida.

216. **Se creó `Admin-users.controller.js`.** Este controlador concentra operaciones de creación, consulta, actualización y eliminación de cuentas.

217. **Se añadió `crearUsuario`.** La función valida los campos, prepara la cuenta y guarda el usuario.

218. **Se añadió `obtenerUsuarios` y `obtenerUsuarioPorId`.** Permiten consultar el conjunto de usuarios o una cuenta concreta desde el área administrativa.

219. **Se añadió `actualizarUsuario`.** La función aplica cambios a una cuenta existente y devuelve el resultado de la operación.

220. **Se añadió `eliminarUsuario`.** Permite retirar una cuenta según las reglas de acceso del recurso.

221. **Se añadió `crearAdministrador`.** Esta operación permite crear una cuenta administrativa por un flujo controlado, distinto del registro público.

### Publicaciones

222. **Se creó `User-publications.controller.js`.** Este controlador reúne el flujo central de publicaciones de KEFEX.

223. **Se añadió `crearPublicacion`.** La función toma el contenido y categoría, utiliza la identidad autenticada como autor y guarda la referencia de imagen si se recibió un archivo.

224. **Se añadió `obtenerPublicaciones`.** Devuelve el feed, con filtros de categoría y paginación acotada.

225. **Se añadió `obtenerPublicacionPorId`.** Permite consultar una publicación individual y devolver 404 cuando no existe.

226. **Se añadió `actualizarPublicacion`.** La función permite modificar campos admitidos y aplica reglas de propietario o administrador.

227. **Se añadió `eliminarPublicacion`.** El controlador contempla propietario y administrador, aunque la ruta actual de DELETE se encuentra configurada como administrativa. Esa diferencia entre controlador y ruta quedó documentada para revisión.

### Comentarios y foro

228. **Se creó `User-comments.controller.js`.** El controlador gestiona comentarios asociados al flujo de opiniones del foro.

229. **Se añadió creación de comentarios.** La función valida el texto y la opinión relacionada antes de guardar el comentario.

230. **Se añadió consulta de comentarios.** La API recupera los comentarios vinculados al recurso que se está viendo.

231. **Se añadió prevención de duplicados en el flujo correspondiente.** El controlador revisa si ya existe un comentario con la combinación prevista antes de crear uno nuevo.

232. **Se creó `User-comments-for-you.controller.js`.** Este controlador mantiene el flujo separado de comentarios que aparece en la experiencia “Para ti”.

233. **Se añadió validación y guardado de texto.** El controlador revisa el contenido antes de persistirlo y devuelve la información que necesita el frontend.

234. **Se creó `User-opinions.controller.js`.** El controlador reúne la creación, consulta, actualización y eliminación de opiniones.

235. **Se añadió `crearOpinion`.** La función valida el título y los datos de la opinión y la guarda en MongoDB.

236. **Se añadió `obtenerOpiniones`.** Permite consultar opiniones disponibles para la comunidad.

237. **Se añadió actualización de opinión.** La función aplica cambios al recurso existente y verifica que la operación sea válida.

238. **Se añadió eliminación de opinión.** El controlador elimina la opinión cuando se cumplen las reglas de acceso.

### Búsqueda

239. **Se creó `Search.controller.js`.** El controlador reúne la búsqueda de contenido del foro y recursos relacionados.

240. **Se añadió limpieza de la consulta.** `cleanQuery` normaliza el texto que llega desde el usuario.

241. **Se añadió escape de expresiones regulares.** `escapedQuery` evita que los caracteres ingresados se interpreten como operadores no deseados dentro de la búsqueda.

242. **Se añadió búsqueda con regex.** El controlador construye el patrón para localizar contenido y reunir resultados.

243. **Se añadió recuento de resultados.** `totalResults` permite devolver información de cantidad junto con los resultados.

244. **Se añadieron datos de tendencias y opiniones.** El controlador reúne los grupos que contempla la búsqueda actual, aunque cada subrecurso necesita validación end-to-end con datos reales.

### Productos y sitios

245. **Se creó `Admin-products.controller.js`.** El controlador concentra el CRUD administrativo de productos.

246. **Se añadió `crearProducto`.** La función valida los datos del producto y lo guarda en el catálogo.

247. **Se añadió `obtenerProductos`.** Devuelve el catálogo que consume la tienda y la administración.

248. **Se añadió `obtenerProductoPorId`.** Permite recuperar un producto individual.

249. **Se añadió `actualizarProducto`.** La función modifica un producto existente con los datos permitidos.

250. **Se añadió `eliminarProducto`.** Permite retirar un producto del catálogo desde la administración.

251. **Se creó `Admin-sites.controller.js`.** El controlador reúne la administración de reseñas o sitios.

252. **Se añadió creación de sitio.** La función valida los datos y guarda una nueva entrada.

253. **Se añadió consulta de sitios.** Permite recuperar el conjunto de sitios y los elementos destacados contemplados por el controlador.

254. **Se añadió actualización de sitio.** La función modifica la información de una entrada existente.

255. **Se añadió eliminación de sitio.** Permite retirar una entrada de la colección.

### Favoritos y carrito

256. **Se creó `User-favorites.controller.js`.** El controlador gestiona el guardado y consulta de favoritos.

257. **Se añadió `agregarFavorito`.** La función valida la referencia al elemento y guarda el favorito asociado al usuario.

258. **Se añadió `obtenerFavoritos`.** Recupera los favoritos del usuario autenticado.

259. **Se añadió consulta por usuario.** `obtenerFavoritosPorUsuario` permite consultar favoritos por la referencia de usuario en la ruta protegida correspondiente.

260. **Se añadió `eliminarFavorito`.** Permite retirar un favorito específico.

261. **Se creó `User-cart.controller.js`.** El controlador reúne las operaciones del carrito y su cálculo de total.

262. **Se añadió `cargarCarrito`.** La función prepara el carrito del usuario y calcula los datos que necesita la respuesta.

263. **Se añadió `recalcularCarrito`.** Recorre los artículos y calcula el total según producto y cantidad.

264. **Se añadió `obtenerCarrito`.** Recupera el carrito actual del usuario.

265. **Se añadió `agregarAlCarrito`.** La función valida la cantidad, consulta el producto y agrega o actualiza el artículo.

266. **Se añadió `actualizarCantidadCarrito`.** Permite cambiar la cantidad de un producto que ya está en el carrito.

267. **Se añadió `eliminarDelCarrito`.** Retira un artículo del carrito.

268. **Se añadió `vaciarCarrito`.** Elimina todos los artículos del carrito del usuario.

### Notificaciones

269. **Se creó `User-notifications.controller.js`.** El archivo contiene funciones para crear, consultar, marcar como leída y eliminar notificaciones.

270. **Se añadió `crearNotificacion`.** La función prepara una notificación y la guarda en la colección.

271. **Se añadió `obtenerNotificaciones`.** Permite recuperar las notificaciones del usuario.

272. **Se añadió `marcarComoLeida`.** Actualiza el estado de lectura de una notificación.

273. **Se añadió `eliminarNotificacion`.** Permite retirar una notificación existente.

274. **Se dejó pendiente el montaje de notificaciones.** Aunque el modelo y controlador existen, la API actual no registra el recurso en `server.js`. La funcionalidad está parcialmente construida, no completa de extremo a extremo.

---

## 11. Rutas: cómo quedaron conectadas las funciones

275. **Se separaron las rutas de autenticación.** `Auth.routes.js` conecta registro, login de usuario, login de administrador, recuperación y cambio de contraseña.

276. **Se mantuvieron rutas de compatibilidad.** Las rutas antiguas de registro e inicio de sesión siguen presentes como alias para no romper las integraciones que todavía las usan.

277. **Se conectaron rutas de perfil.** `Profile.routes.js` protege la consulta y actualización del perfil y la lista administrativa.

278. **Se conectaron rutas de usuarios.** `Admin-users.routes.js` expone las operaciones administrativas de cuentas.

279. **Se conectaron rutas de publicaciones.** `User-publications.routes.js` registra GET de feed, GET por ID, POST, PUT y DELETE.

280. **Se conectaron rutas de comentarios.** `User-comments.routes.js` y `User-comments-for-you.routes.js` mantienen separados los dos tipos de comentarios.

281. **Se conectaron rutas de opiniones.** `User-opinions.routes.js` registra las operaciones del recurso de opiniones.

282. **Se conectaron rutas de productos.** `Admin-products.routes.js` mantiene el CRUD del catálogo con permisos administrativos.

283. **Se conectaron rutas de sitios.** `Admin-sites.routes.js` mantiene las operaciones de administración de sitios.

284. **Se conectaron rutas de búsqueda.** `Search.routes.js` registra el endpoint de búsqueda.

285. **Se conectaron rutas de carrito.** `User-cart.routes.js` conecta las operaciones de carrito con el middleware de sesión.

286. **Se conectaron rutas de favoritos.** `User-favorites.routes.js` registra creación, consulta y eliminación de favoritos.

287. **Se revisó el contrato de Postman.** La colección se actualizó para representar rutas actuales, variables de entorno, tokens y encabezados de rol de manera consistente.

---

## 12. Postman y el trabajo de integración

288. **Postman se convirtió en una herramienta de trabajo compartida.** La colección permite revisar cada recurso sin tener que navegar manualmente por todas las pantallas de Angular.

289. **Se separó la autenticación de las pruebas de recursos.** La colección contempla login y almacenamiento del token para las peticiones protegidas.

290. **Se incorporó un modo de desarrollo controlado.** El bypass de Postman se añadió para facilitar las pruebas locales, pero quedó desactivado por defecto y restringido al entorno de desarrollo.

291. **Se añadieron solicitudes para publicaciones.** La colección cubre consulta, creación, lectura por ID, actualización y eliminación.

292. **Se añadieron solicitudes para productos y carrito.** Esto permite revisar la relación entre catálogo y artículos guardados en el carrito.

293. **Se añadieron solicitudes para perfil y usuarios.** La colección contempla rutas propias de usuario y operaciones administrativas.

294. **Se añadieron solicitudes para foro, comentarios, opiniones, búsqueda y favoritos.** Así se puede revisar el contrato de cada recurso aunque algunas operaciones todavía necesiten pruebas con una base de datos real.

295. **Se añadieron comprobaciones estáticas de la colección.** `postman-collection.test.js` revisa que el JSON tenga la estructura esperada, apunte a la API local y contenga rutas y encabezados requeridos.

296. **Se mantuvo la colección como evidencia de contrato.** Que una solicitud exista en Postman no significa automáticamente que el flujo completo haya pasado contra MongoDB; la colección ayuda a documentar y revisar el contrato.

---

## 13. Errores y ajustes que fueron apareciendo durante el desarrollo

297. **Se revisaron errores de imports y nombres de funciones.** En distintas etapas, rutas y controladores usaban nombres que ya habían cambiado. La normalización consistió en hacer coincidir los imports con las exportaciones reales.

298. **Se corrigieron problemas de módulos de Node.** En una etapa apareció `SyntaxError: Unexpected token 'export'` en el controlador de autenticación. El problema estaba relacionado con la forma de exportar/importar y el modo de módulos del backend.

299. **Se corrigieron referencias a middleware.** Se encontró un error donde `autorizarRoles` no estaba definido en una ruta de publicaciones. La revisión de rutas y middleware fue necesaria para que el backend pudiera registrar correctamente los endpoints.

300. **Se revisaron contratos de frontend y backend.** Algunos servicios esperaban campos que los controladores no devolvían con el mismo nombre. Esto generó errores de TypeScript y de presentación que se fueron resolviendo mediante modelos de vista y adaptación de respuestas.

301. **Se corrigieron problemas de tipos en publicaciones.** En `publicaciones.service.ts` aparecieron errores relacionados con `PublicacionViewModel`, incluyendo el campo `imagenUrl`. El trabajo consistió en alinear la estructura de los datos que se construyen con los campos requeridos por el modelo.

302. **Se corrigieron expresiones regulares mal formadas.** Durante una edición del servicio de publicaciones se introdujeron caracteres y escapes incorrectos en líneas de `replace`. Esos errores provocaron `TS1127` y expresiones que TypeScript consideraba siempre verdaderas.

303. **Se revisaron llamadas a `replace`.** También apareció una llamada con una cantidad de argumentos distinta a la que acepta el método. La corrección se orientó a dejar una normalización de URL válida y legible.

304. **Se revisó el manejo de expiración del token.** Se detectó una inconsistencia entre la inicialización de sesión y la función que verifica si el token sigue vigente. Quedó registrada como punto de ajuste para evitar sesiones que se interpretaran de forma distinta según el método.

305. **Se revisó el requisito de versión de Node.** En el trabajo anterior apareció una diferencia entre el engine declarado y Node 24.19.0. La decisión del proyecto fue no depender de instalar una versión anterior solo para ocultar el problema, sino revisar la compatibilidad de los paquetes con el entorno previsto para Vercel.

306. **Se revisó un problema de instalación con esbuild.** Se registró un error `EPERM` al intentar eliminar `esbuild.exe` dentro de `node_modules`. Era un problema de archivo bloqueado en Windows, no un error de lógica de KEFEX.

307. **Se revisó la integración del formulario de contacto del portafolio.** En el trabajo de otro proyecto se había detectado una respuesta 502 en Vercel y una integración con Static Forms. Esa corrección pertenece al portafolio, no al backend de KEFEX, por lo que no se mezcla como una funcionalidad de KEFEX.

308. **Se revisó el acceso de administración.** Se trabajó sobre la recuperación de acceso al primer administrador y la posibilidad de restablecerlo sin borrar los datos de MongoDB. La idea fue tratar la cuenta administrativa como un dato que se recupera de forma controlada, no como motivo para eliminar la base completa.

309. **Se revisaron errores de creación de usuarios.** Se registraron respuestas 409 aun cuando el correo parecía no estar en la colección. El diagnóstico requería comparar el índice de unicidad, la normalización del correo y la respuesta del backend, en lugar de borrar usuarios al azar.

310. **Se revisó la experiencia de publicaciones.** Se decidió que las tarjetas publicadas aparecieran en “Para ti” y “Explorar”, reutilizando el mismo componente y servicio.

311. **Se revisó la organización de categorías.** La idea fue mantener una experiencia de descubrimiento con categorías y referencias visuales de otras redes, pero adaptada a KEFEX y a sus recursos reales.

312. **Se documentaron los límites de funciones todavía no conectadas.** Votos separados, pagos, seguimiento real, notificaciones montadas y algunos contratos antiguos no se describen como funciones completas si el código no demuestra el flujo de extremo a extremo.

---

## 14. Pruebas técnicas: lo que se preparó y lo que se verificó

313. **Se incorporó Jest para pruebas del backend.** La configuración permite separar pruebas unitarias de pruebas de integración y ejecutar los archivos de forma controlada.

314. **Se añadió Supertest para integración HTTP.** Las pruebas de integración pueden llamar a la aplicación Express y revisar respuestas, rutas y middleware sin depender de abrir un navegador.

315. **Se creó `jest.config.json`.** La configuración recoge los archivos de prueba, define el entorno y establece umbrales de cobertura iniciales.

316. **Se definieron pruebas unitarias de autenticación.** `Auth.controller.unit.test.js` cubre registro, login, recuperación y cambio de contraseña con dependencias controladas.

317. **Se definieron pruebas de integración de autenticación.** `Auth.controller.integration.test.js` recorre el registro, login, validación de roles, recuperación y cambio de contraseña a través de las rutas HTTP.

318. **Se definieron pruebas unitarias de publicaciones.** `User-publications.controller.unit.test.js` revisa creación, consulta, paginación, lectura por ID, actualización y eliminación.

319. **Se definieron pruebas de integración de publicaciones.** `User-publications.controller.integration.test.js` revisa la API HTTP, la identidad autenticada, validación de datos, carga multipart y reglas de acceso.

320. **Se añadieron pruebas del middleware de autenticación.** `auth.middleware.unit.test.js` cubre token ausente, token válido e inválido, cuenta inactiva, bypass local y autorización por rol.

321. **Se añadieron pruebas de integración de subida de archivos.** `upload.middleware.integration.test.js` cubre MIME permitido, campo multipart, nombre de archivo generado y límite de 5 MiB.

322. **Se prepararon pruebas para productos.** Los archivos unitario e integración de `Admin-products.controller` dejan definido el lugar para validar el CRUD administrativo.

323. **Se prepararon pruebas para sitios.** Los archivos de `Admin-sites.controller` separan la lógica del controlador de la comprobación de sus rutas.

324. **Se prepararon pruebas para usuarios administrativos.** `Admin-users.controller.unit.test.js` y su integración cubren la gestión de cuentas.

325. **Se prepararon pruebas para perfil.** Los archivos `Profile.controller.*.test.js` dejan separados los casos de lectura/actualización del perfil y las rutas.

326. **Se prepararon pruebas para búsqueda.** `Search.controller.*.test.js` permite revisar el comportamiento del buscador en el controlador y la API.

327. **Se prepararon pruebas para comentarios.** Los archivos de `User-comments.controller` y `User-comments-for-you.controller` separan los dos contratos de comentario.

328. **Se prepararon pruebas para opiniones.** Los archivos de `User-opinions.controller` cubren la lógica de opiniones y sus rutas.

329. **Se prepararon pruebas para favoritos.** Los archivos de `User-favorites.controller` permiten completar la verificación de guardar, consultar y retirar favoritos.

330. **Se prepararon pruebas para carrito.** Los archivos de `User-cart.controller` permiten revisar cantidades, totales y operaciones del carrito.

331. **Se prepararon pruebas para notificaciones.** Los archivos de `User-notifications.controller` existen, aunque el recurso aún no está montado en el servidor de la versión revisada.

332. **Se incorporaron pruebas de contrato de Postman.** `postman-collection.test.js` verifica que la colección esté en formato v2.1, use la API local y tenga las rutas y encabezados de autenticación esperados.

333. **Se dejó una diferencia entre pruebas activas y plantillas pendientes.** En el paquete de pruebas, los casos de autenticación y publicaciones, middleware de autenticación, subida de archivos y colección Postman tienen pruebas activas. Varios controladores de recursos conservan casos `todo`, que documentan el alcance previsto pero todavía no cuentan como pruebas ejecutadas.

334. **Se establecieron umbrales de cobertura iniciales.** La configuración exige una cobertura global de arranque y umbrales más altos para piezas sensibles como autenticación, publicaciones y middleware. La cobertura real debe generarse ejecutando Jest en el entorno con dependencias instaladas.

335. **Se añadió una comprobación de sintaxis del proyecto.** `scripts/check-project.mjs` revisa archivos JavaScript y la consistencia de imports relativos. Esta comprobación ayuda a detectar errores antes de iniciar el servidor.

336. **Se validó la colección de Postman como JSON.** La colección pasó la comprobación estática de estructura y contrato que se preparó para ella.

337. **Se validó la sintaxis de los archivos backend revisados.** En la revisión anterior, los archivos JavaScript del backend pasaron `node --check` y el script de comprobación del proyecto.

338. **Se validó el paquete ZIP.** El archivo de entrega se revisó para confirmar que no estuviera corrupto y que incluyera los archivos de documentación, pruebas y colección previstos.

339. **No se afirmó una prueba end-to-end que no se hubiera ejecutado.** En esta revisión no se ejecutó una compilación de producción de Angular, una sesión SSR real en navegador ni una integración contra MongoDB Atlas con credenciales privadas. Esos resultados deben quedar pendientes hasta que se ejecuten en el entorno del proyecto.

---

## 15. Preparación para la publicación y estado actual

340. **Se preparó la estructura para trabajar con despliegues separados.** Angular y Express tienen responsabilidades distintas y pueden publicarse en servicios diferentes, siempre que se configure correctamente la URL de la API y los orígenes permitidos.

341. **Se revisó la compatibilidad con Vercel.** El trabajo de entorno contempló la versión de Node y la forma en que Angular genera la aplicación. No se debe confundir la preparación de compatibilidad con una verificación completa de despliegue.

342. **Se revisó la URL base del frontend.** La variable de entorno del frontend apunta al backend y debe coincidir con el dominio que esté activo en cada ambiente.

343. **Se revisó la configuración de CORS.** La API necesita permitir el origen real del frontend, sin abrir acceso innecesario a otros dominios.

344. **Se separaron los secretos del código.** `.env.example` conserva nombres de variables y valores de ejemplo, mientras que los archivos `.env` privados no deben compartirse ni incluirse en entregas públicas.

345. **Se mantuvo una colección Postman de entorno actual.** Esto ayuda a que el equipo pruebe la API con una URL base y variables coherentes con la versión que está revisando.

346. **Se documentaron los límites de producción.** Antes de considerar KEFEX listo para usuarios reales, quedan por completar pruebas end-to-end, revisar el almacenamiento persistente de imágenes, reforzar la validación de archivos, mejorar el flujo de recuperación de contraseña y cerrar los contratos que aún están marcados como pendientes.

347. **Se consolidó la documentación del proyecto.** La etapa más reciente reunió la descripción del backend, frontend, perfiles de contribución, estado de pruebas y límites conocidos. Esta bitácora unifica esa información en un único relato cronológico.

348. **KEFEX pasó de un prototipo de páginas sueltas a una aplicación full-stack organizada.** Hoy hay una interfaz Angular con páginas y componentes reutilizables, una API Express con controladores y modelos de Mongoose, autenticación con JWT, recursos de comunidad y comercio, una colección de Postman y una base de pruebas preparada para seguir creciendo.

349. **La historia no termina con el último archivo.** La versión actual es una base funcional y documentada que todavía necesita cerrar integraciones, ejecutar las pruebas completas en su entorno real y confirmar el despliegue activo. Lo importante es que ahora el trabajo está separado por responsabilidades y se puede continuar sin tener que reconstruir desde cero qué hace cada parte.

---

## 16. Archivo por archivo: mapa de lo que quedó en la versión actual

Esta sección deja una referencia concreta de los archivos que forman la aplicación. No sustituye el relato anterior; sirve para que podamos volver a una pieza específica y recordar qué papel cumple.

### Frontend — estructura y configuración

350. **`src/main.ts`**: entrada de Angular en navegador.
351. **`src/main.server.ts`**: entrada de Angular para el renderizado del servidor.
352. **`src/server.ts`**: servidor que integra Angular SSR y responde las solicitudes de la aplicación.
353. **`src/index.html`**: documento HTML base que recibe la aplicación.
354. **`src/styles.css`**: estilos globales y base visual compartida.
355. **`src/app/app.ts`**: componente raíz.
356. **`src/app/app.html`**: plantilla del componente raíz.
357. **`src/app/app.css`**: estilos locales del componente raíz; en el snapshot revisado está vacío.
358. **`src/app/app.config.ts`**: providers comunes de Angular.
359. **`src/app/app.config.server.ts`**: providers específicos de SSR.
360. **`src/app/app.routes.ts`**: rutas de páginas y guards.
361. **`src/app/app.routes.server.ts`**: reglas de renderizado del servidor.
362. **`src/app/app.spec.ts`**: prueba básica del componente raíz.
363. **`src/app/enviroments/enviroment.ts`**: configuración de la URL de API.

### Frontend — modelos

364. **`core/models/credential.ts`**: datos de credenciales.
365. **`core/models/usuario.model.ts`**: estructura de usuario.
366. **`core/models/producto.model.ts`**: estructura de producto.
367. **`core/models/publicacion.model.ts`**: estructura de publicación.
368. **`core/models/foro.model.ts`**: estructuras de foro, hilo y comentario.

### Frontend — servicios y seguridad

369. **`core/services/auth.service.ts`**: login, recuperación, cambio de contraseña, token, expiración, rol y logout.
370. **`core/services/auth.interceptor.ts`**: adjunta JWT a peticiones de la API KEFEX.
371. **`core/guards/auth-guard.ts`**: protege rutas que requieren sesión.
372. **`core/guards/admin-guard.ts`**: protege rutas que requieren rol de administrador.
373. **`core/guards/auth-guard.spec.ts`**: prueba del guard de sesión.
374. **`core/guards/admin-guard.spec.ts`**: prueba del guard administrativo.
375. **`core/services/publicaciones.service.ts`**: consulta, búsqueda, categoría, creación y transformación de publicaciones.
376. **`core/services/favoritos.service.ts`**: carga, alternancia, normalización y persistencia de favoritos.
377. **`core/services/foro.service.ts`**: hilos, comentarios y categorías.
378. **`core/services/productos-service.ts`**: operaciones del catálogo de productos.

### Frontend — componentes compartidos

379. **`componentes/navbar/navbar.ts`**: comportamiento de navegación, scroll, menú móvil y logout.
380. **`componentes/navbar/navbar.html`**: estructura de navegación.
381. **`componentes/navbar/navbar.css`**: presentación responsive de navegación.
382. **`componentes/recover/recover.ts`**: solicitud de recuperación de contraseña.
383. **`componentes/recover/recover.html`**: formulario de recuperación.
384. **`componentes/recover/recover.css`**: estilos del componente; en el snapshot revisado está vacío.
385. **`componentes/publication-composer/publication-composer.ts`**: selección, optimización y envío de publicaciones.
386. **`componentes/publication-composer/publication-composer.html`**: formulario de publicación.
387. **`componentes/publication-composer/publication-composer.css`**: estilos propios del composer, incluyendo distribución, bordes, superficies y estados del formulario.
388. **`componentes/publication-card/publication-card.ts`**: componente de tarjeta de publicación.
389. **`componentes/publication-card/publication-card.html`**: presentación de una publicación.
390. **`componentes/publication-card/publication-card.css`**: estilos propios de la tarjeta, como superficie, borde, radio, separación y presentación del contenido.
391. **`componentes/posted-publications/posted-publications.ts`**: carga y organización de secciones de publicaciones.
392. **`componentes/posted-publications/posted-publications.html`**: estructura de publicaciones agrupadas.
393. **`componentes/posted-publications/posted-publications.css`**: ajustes visuales locales.
394. **`componentes/admin/crud-productos.ts`**: creación, edición, imagen, guardado y eliminación de productos.
395. **`componentes/admin/crud-productos.html`**: formulario y lista de productos administrativos.
396. **`componentes/admin/crud-productos.css`**: estilos del CRUD.

### Frontend — páginas

397. **`pages/home/home.ts`**: carga del feed y cambio de pestañas.
398. **`pages/home/home.html`**: estructura de “Para ti”.
399. **`pages/home/home.css`**: estilos de Home, tarjetas, composición y estados responsive.
400. **`pages/explorer/explorer.ts`**: búsqueda, categoría y orden.
401. **`pages/explorer/explorer.html`**: estructura de Explorar.
402. **`pages/explorer/explorer.css`**: estilos de Explorar, con composición, encabezado, filtros, resultados y ajustes responsive.
403. **`pages/foro/foro.ts`**: carga de hilos, comentarios, creación y modal.
404. **`pages/foro/foro.html`**: estructura de comunidad.
405. **`pages/foro/foro.css`**: ajustes visuales del foro.
406. **`pages/tienda/tienda.ts`**: carga de catálogo y agregado al carrito.
407. **`pages/tienda/tienda.html`**: estructura de tienda.
408. **`pages/tienda/tienda.css`**: estilos de avisos, catálogo y tarjetas de tienda.
409. **`pages/carrito/carrito.ts`**: consulta, cantidades, eliminación, vaciado y simulación de checkout.
410. **`pages/carrito/carrito.html`**: plantilla compacta que contiene la estructura del carrito y sus estados de presentación.
411. **`pages/carrito/carrito.css`**: estilos de mensajes, artículos y resumen del carrito.
412. **`pages/favoritos/favoritos.ts`**: presentación y retirada de favoritos.
413. **`pages/favoritos/favoritos.html`**: plantilla compacta para el mensaje de estado y la lista de favoritos.
414. **`pages/favoritos/favoritos.css`**: estilos para el mensaje de favoritos y sus elementos destacados.
415. **`pages/profile/profile.ts`**: pestañas, actualización, cambio de contraseña y logout.
416. **`pages/profile/profile.html`**: estructura del perfil.
417. **`pages/profile/profile.css`**: estilos del encabezado, portada y composición del perfil.
418. **`pages/designers/designers.ts`**: inicialización de la vista de diseñadores.
419. **`pages/designers/designers.html`**: presentación de perfiles creativos.
420. **`pages/designers/designers.css`**: estilos de diseñadores.
421. **`pages/login/login.ts`**: validación, login y navegación posterior.
422. **`pages/login/login.html`**: formulario de login.
423. **`pages/login/login.css`**: estilos del layout y la tarjeta de inicio de sesión.
424. **`pages/registro/registro.ts`**: validación y envío de registro.
425. **`pages/registro/registro.html`**: plantilla compacta del formulario de registro.
426. **`pages/registro/registro.css`**: estilos del layout y los campos de registro.
427. **`pages/admin/admin.ts`**: usuarios, estado, moderación y comprobación del servidor.
428. **`pages/admin/admin.html`**: estructura del panel administrativo.
429. **`pages/admin/admin.css`**: estilos de pestañas y elementos de navegación del panel administrativo.

### Backend — inicio y configuración

430. **`src/index.js`**: carga de configuración, validación de JWT, conexión y cierre del servidor.
431. **`src/server.js`**: Express, CORS, parsers, archivos estáticos, rutas, health, errores y 404.
432. **`src/connection.js`**: conexión a MongoDB mediante Mongoose.
433. **`src/middleware/auth.middleware.js`**: autenticación JWT, bypass local y autorización por rol.
434. **`src/middleware/upload.middleware.js`**: configuración de Multer, tipos permitidos, límite y nombre de archivo.
435. **`scripts/check-project.mjs`**: comprobación de sintaxis e imports relativos.
436. **`scripts/reset-admin-password.mjs`**: herramienta de recuperación controlada de acceso administrativo.
437. **`.env.example`**: nombres de variables de entorno sin secretos.
438. **`exmapleenv.txt`**: archivo de referencia heredado de variables; su nombre conserva un error tipográfico histórico.

### Backend — modelos

439. **`Models/User.model.js`**: cuenta, contraseña, rol y estado.
440. **`Models/Publication.model.js`**: publicación, autor, categoría y multimedia.
441. **`Models/Comment.model.js`**: comentario del foro.
442. **`Models/CommentForYou.model.js`**: comentario del flujo “Para ti”.
443. **`Models/Opinion.model.js`**: opinión y datos de producto asociados.
444. **`Models/Favorite.model.js`**: favorito asociado a usuario.
445. **`Models/Cart.model.js`**: carrito y artículos.
446. **`Models/Product.model.js`**: producto de tienda.
447. **`Models/Site.model.js`**: reseña o sitio.
448. **`Models/Category.model.js`**: categoría.
449. **`Models/Notification.model.js`**: notificación.
450. **`Models/SearchHistory.model.js`**: historial de búsqueda.
451. **`Models/UserRecord.model.js`**: archivo de modelo sin definición activa en el snapshot revisado.

### Backend — controladores

452. **`Controller/Auth.controller.js`**: registro, login, JWT, recuperación y cambio de contraseña.
453. **`Controller/Profile.controller.js`**: lectura y actualización del perfil, listado administrativo.
454. **`Controller/Admin-users.controller.js`**: CRUD y creación administrativa de usuarios.
455. **`Controller/User-publications.controller.js`**: CRUD de publicaciones y paginación.
456. **`Controller/User-comments.controller.js`**: comentarios asociados a opiniones.
457. **`Controller/User-comments-for-you.controller.js`**: comentarios del flujo “Para ti”.
458. **`Controller/User-opinions.controller.js`**: CRUD de opiniones.
459. **`Controller/Search.controller.js`**: limpieza de consulta, regex y agrupación de resultados.
460. **`Controller/Admin-products.controller.js`**: CRUD de productos.
461. **`Controller/Admin-sites.controller.js`**: administración de sitios y reseñas.
462. **`Controller/User-favorites.controller.js`**: favoritos.
463. **`Controller/User-cart.controller.js`**: carrito, cantidades y total.
464. **`Controller/User-notifications.controller.js`**: creación, consulta, lectura y eliminación de notificaciones; todavía sin ruta montada.

### Backend — rutas

465. **`Routes/Auth.routes.js`**: rutas de registro y login de usuario/admin, recuperación y cambio de contraseña.
466. **`Routes/Profile.routes.js`**: perfil y listado administrativo.
467. **`Routes/Admin-users.routes.js`**: administración de usuarios.
468. **`Routes/User-publications.routes.js`**: feed y CRUD de publicaciones.
469. **`Routes/User-comments.routes.js`**: comentarios.
470. **`Routes/User-comments-for-you.routes.js`**: comentarios de “Para ti”.
471. **`Routes/User-opinions.routes.js`**: opiniones.
472. **`Routes/Search.routes.js`**: búsqueda.
473. **`Routes/Admin-products.routes.js`**: productos.
474. **`Routes/Admin-sites.routes.js`**: sitios.
475. **`Routes/User-cart.routes.js`**: carrito.
476. **`Routes/User-favorites.routes.js`**: favoritos.

### Backend — pruebas

477. **`test/controllers/Auth.controller.unit.test.js`**: pruebas unitarias de registro, login, recuperación y cambio de contraseña.
478. **`test/controllers/Auth.controller.integration.test.js`**: pruebas HTTP de autenticación.
479. **`test/controllers/User-publications.controller.unit.test.js`**: pruebas unitarias del contrato de publicaciones.
480. **`test/controllers/User-publications.controller.integration.test.js`**: pruebas HTTP de publicaciones y multipart.
481. **`test/middleware/auth.middleware.unit.test.js`**: pruebas de JWT, cuenta y roles.
482. **`test/middleware/upload.middleware.integration.test.js`**: pruebas de carga de imágenes.
483. **`test/postman-collection.test.js`**: pruebas estáticas de la colección Postman.
484. **`test/controllers/Admin-products.controller.*.test.js`**: plantillas unitarias e integración de productos.
485. **`test/controllers/Admin-sites.controller.*.test.js`**: plantillas unitarias e integración de sitios.
486. **`test/controllers/Admin-users.controller.*.test.js`**: plantillas unitarias e integración de usuarios.
487. **`test/controllers/Profile.controller.*.test.js`**: plantillas unitarias e integración de perfil.
488. **`test/controllers/Search.controller.*.test.js`**: plantillas unitarias e integración de búsqueda.
489. **`test/controllers/User-cart.controller.*.test.js`**: plantillas unitarias e integración de carrito.
490. **`test/controllers/User-comments.controller.*.test.js`**: plantillas unitarias e integración de comentarios.
491. **`test/controllers/User-comments-for-you.controller.*.test.js`**: plantillas unitarias e integración de comentarios “Para ti”.
492. **`test/controllers/User-favorites.controller.*.test.js`**: plantillas unitarias e integración de favoritos.
493. **`test/controllers/User-notifications.controller.*.test.js`**: plantillas unitarias e integración de notificaciones.
494. **`test/controllers/User-opinions.controller.*.test.js`**: plantillas unitarias e integración de opiniones.

### Archivos de trabajo y entrega

495. **`POSTMAN/KEFEX BACKEND API — Current environment.postman_collection.json`**: colección de la API en el paquete de documentación actual.
496. **`BACKEND/package.json`**: dependencias y scripts del backend, incluyendo la estructura de pruebas.
497. **`BACKEND/package-lock.json`**: bloqueo de dependencias; en la entrega de pruebas se dejó indicado que debe sincronizarse después de incorporar Jest y Supertest.
498. **`BACKEND/jest.config.json`**: configuración de Jest y cobertura.
499. **`FRONTEND/package.json`**: dependencias y scripts de Angular.
500. **`FRONTEND/package-lock.json`**: versiones bloqueadas de dependencias del frontend.
501. **`FRONTEND/angular.json`**: configuración de build, desarrollo y SSR de Angular.
502. **`FRONTEND/tsconfig.json`, `tsconfig.app.json` y `tsconfig.spec.json`**: configuración de TypeScript para aplicación y pruebas.
503. **`FRONTEND/.editorconfig` y `.prettierrc`**: convenciones de formato.
504. **`.gitignore` de frontend y backend**: exclusión de archivos locales y dependencias que no deben formar parte de la entrega.

---

## 17. Lo que queda como siguiente capítulo

505. **Cerrar el historial commit por commit.** La página del repositorio muestra la actividad general, pero para documentar con precisión el mensaje, fecha, autor y diff de cada uno de los 48 commits hace falta consultar la vista completa de GitHub o disponer de una conexión al repositorio que permita leer cada commit. Esta bitácora no inventa ese detalle.

506. **Ejecutar las pruebas activas en el entorno real.** La sintaxis y el contrato estático se revisaron, pero falta ejecutar la batería completa con las dependencias sincronizadas y comprobar los resultados reales de Jest.

507. **Completar los casos `todo`.** Las plantillas de controladores restantes ya indican el lugar donde cerrar pruebas unitarias e integración para cada recurso.

508. **Probar la API con MongoDB de desarrollo.** Los flujos de sitio, comentarios, búsqueda, favoritos, carrito y administración necesitan comprobarse con datos reales y sus permisos correspondientes.

509. **Completar la compilación Angular y la revisión SSR.** Falta dejar un resultado confirmado de build de producción, navegación en navegador y renderizado del lado del servidor con la versión de Node compatible.

510. **Cerrar los puntos de seguridad antes de producción.** La validación real de archivos, recuperación de contraseña, estrategia de sesión, almacenamiento de imágenes y revisión de roles son mejoras importantes para la siguiente etapa.

511. **Confirmar el despliegue activo.** La publicación debe verificarse con URL, respuesta de API, carga de imágenes, autenticación y una navegación real entre páginas. Hasta esa verificación, el estado queda descrito como preparación e integración.

512. **Seguir construyendo desde una base que ya tiene memoria.** Esta es la parte más importante de la bitácora: KEFEX conserva el prototipo original, el trabajo de cada rama, la evolución de la interfaz, la separación de backend y frontend, los modelos, los servicios, las rutas, los errores que fuimos corrigiendo y la estrategia de pruebas. El proyecto ya no es una colección de ideas sueltas; es una aplicación organizada cuya siguiente etapa puede continuar sobre lo que realmente existe.

---

## Fuentes de esta bitácora

- [Repositorio KEFEX](https://github.com/FX-Roma/Kefex-Fullstack/)
- [Historial de commits de `main`](https://github.com/FX-Roma/Kefex-Fullstack/commits/main/)
- `fundamentos kefex.zip`: prototipo HTML/CSS/JavaScript y ramas visuales.
- `kefex.zip`: etapa intermedia `Front/` y `Back/` con nombres históricos de colaboradores.
- Snapshot normalizado de KEFEX y paquete de pruebas disponibles en esta conversación.

**Nota final de equipo:** esta historia describe lo que aparece en los materiales revisados. Cuando una parte está preparada pero no probada en vivo, queda indicada como pendiente; cuando una función existe en el código pero todavía no está conectada por ruta o no tiene pruebas activas, no la presentamos como terminada.
