# Dashboard de Logitrack

Base: https://github.com/4lexxe/DevsProject, revisión 6cfcbced90be1e2bdc22680f8e4faa0cf77cf9d2.
Se adaptaron Sidebar.tsx y Header.tsx de dashboard-admin/src/dashboard/layout a Next.js y a los roles de Logitrack. Se conservan los servicios HTTP y operaciones existentes; no se instala el backend de cursos.
El resumen consulta conteos por estado y envíos recientes al Gateway. No utiliza cifras inventadas. La portada es propia de Logitrack y el recorrido de su ilustración es explicativo.
Dockerfile es la fuente única de construcción del frontend. El servidor obtiene esta rama desde GitHub y construye una imagen fijada al commit. No se sincronizan carpetas de código por SCP.
