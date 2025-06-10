
# Requerimientos

Python 3.12

- REACT y react router - La tecnología estandard y con mayor comunidad, facilita mejorar los problemas de Organización y mala UX, comunidad grande util para facilitar la toma de decisiones basandose en otros proyectos
- FastAPI - Enfoque en velocidad necesaria para plataformas de eventos, soporte de operaciones asincronas para la UX, documentación con Swagger util para la organización interna y automatización
- PostgreSQL - Estructurado para facilidad organización y eficiencia, disminuye las posibilidades de desorganización, al mismo tiempo que mantiene estructuras rigdas de información para facilitar automatización y predictibilidad necesaria para auditorias, trazabilidad y procesos de pago
- SQLModel + SQLAlchemy - Ayuda a la organización al tener modelos con type hinting y definiciones unicas de modelos

Otras herramientas necesarias
Poetry - dependency manager
Alembic - migraciones
pytest - pruebas unitarias
Swagger - doc

Borrador modelos backend:


Evento - Nombre, lugar_general string o ubicacion de mapa, duración (opcional), categoría Enum, descripción, image url, creador (link a usuarios), relación con sesiones (1:N), estado del evento (precede estados de sesión), fecha de inicio, fecha de fin, recursos_de_evento string, capacidad máxima (en función de la capacidad de las sesiones)

SesiónDeEvento - Evento relacionado (FK), Presentador (string para que no necesite crear usuario), estado de la sesión (borrador, teaser, preventa, venta, en progreso, terminado, cancelado, suspendido), fecha y hora, lugar (especifico), capacidad maxima, recursos_de_sesion. 

Asistentes - usuario_id fk, sesión_id fk, fecha de registro, estado_registro (confirmado, cancelado, lista_espera.), rol string,

usuario - nombre string, rol (enum), correo (string), contraseña encriptada y verificable (string), fecha de creación, activo booleano, ultima fecha de conexión (Para analitica)

Nota: todo tiene deleted_at para softdelete

Nota: Se descartó el uso de boletas por simplicidad, los usuarios se relacionan con eventos a través de las sesiones y modelo de asistente


---------------

Borrador features front:

barra de busqueda (Busqueda automática a partir del tercer caracter o debounce)

paginación (horizontal en front)

lista de eventos (usa componente de tile)

componente tile de evento (previsualización)

página individual para evento (luego de click en tile) inclute info sesiones (No hay componente de sesión)

toast para confirmación y errores

componente formulario evento (creación y edición, incluye sesiones)

formulario login/registro de usuario

Componente de carga (LoadSpinner)

Manejo de errores con ErrorBoundries (Similar a try-catch)

componente de botón registro a evento

RUTAS: eventos, eventos/id, eventos/crear (incluye creación de sesiones, necesita protección), eventos/id/editar (incluye sesiones, necesita protección y validación de horarios), login, registro, /perfil ó /mis-eventos, home,

ESTADOS: authState (usuario, token, isAuthenticated), eventosState (lista, evento actual), sesionesState (sesiones del evento actual), uiState (toasts, loading global)

--------------------

borrador integración front y back:

EventosAPI - a cargo de eventos y busqueda - events, events/id, /events/search?q={query}

SessionsAPI -  a cargo de sesiones, ruta de eventos para uso intuitivo - events/id/sessions, events/id/sessions/id, events

Nota: Los anteriores incluyen validación de conflictos de horarios entre eventos y sesiones

AssistanceAPI - a cargo de registros a eventos y validar capacidad - events/id/sessions/id/register

Nota: el anterior incluye validación de capacidad y estado antes de registro de asistencia

AuthAPI - login y registro - 

UsuariosAPI - eventos registrados - users/me/events

AnalyticsAPI - Generación de reportes

Nota: El front y el back deben de tener sanitización de inputs

----------------------

DOCKER

Services:
 backend
 frontend
 postgres
 redis (opcional)


----------------

Bonus 1:
● Roles de usuarios (Admin, Organizador, Asistente)
● Permisos de acceso por rol
● Gestión de perfiles por parte del administrador.

Bonus 2
 Rate limiting para B2B

Bonus 3
- CI/CD local (Code Quality check, corre tests de front y back con githubActions, makefile + package.json)
- Dashboard en el frontend para datos
- Performance metrics
- Documentación B2B
- CachePara busquedas frecuentes (Redis o similar)
- Middleware de auditoría
- Evaluar tiempo de respuesta y recursos
- Creación en masa de eventos/sesiones (B2B)
- Webhooks para notificaciones (B2B)
- GraphQL
- Multitenancy