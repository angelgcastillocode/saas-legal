# SaaS Legal — La Bóveda Soberana v2.4 AI

Plataforma integral de gestión de recursos judiciales, litigio y administración de firmas legales (*Gestión de la práctica jurídica*), enferma con un enfoque prioritario en seguridad sobria, clasificación asistida por IA y un importador documental de proceso *cero toques*.

---

## 📌 Descripción del Proyecto

**SaaS Legal** proporciona a bufetes de abogados y departamentos jurídicos una solución centralizada, reactiva y confidencial para gobiernos recurrentes, clientes, audiencias y contratos.

Entre sus características principales destacan:
- **Importador Zero-Touch:** Motor de ingesta documental que analiza, extrae metadatos y clasificación automáticamente archivos y recursos sin intervención manual.
- **Repositorio Documental Seguro (*Bóveda*):** Bóveda estructurada para control de versiones, hash SHA-256 de integración pericial y visualización de recursos.
- **Búsqueda Global Inteligente:** Localización ultrarrápida de clientes, números de recurso judicial y documentos. **Búsqueda Global Inteligente:** Localización ultrarrápida de clientes, números de recurso judicial y documentos.
- **Reclasificación Asistida:** Auditoria y reclasificación granular de tipos documentales y estados procesales. **Reclasificación Asistida:** Auditoria y reclasificación granular de tipos documentales y estados procesales.
- **Interfaz Moderna en Tema Oscuro:** Diseñada bajo especificaciones de alta fidelidad con Tailwind CSS y tipografías especializadas (*Inter* y *JetBrains Mono*). **Interfaz Moderna en Tema Oscuro:** Diseñada bajo especificaciones de alta fidelidad con Tailwind CSS y tipografías especializadas (*Inter* y *JetBrains Mono*).

---

## 🏛️ Arquitectura del Sistema 🏛️ Arquitectura del Sistema

La arquitectura está construida como una Aplicación de Página Única (SPA) modular y desacoplada, ejecutada en el cliente con arquitectura de capas:

```
└── stitch_saas_legal_practice_management/ # Especificaciones de enfermería y maquetas de alta fidelidad
Saas Abogados/
├── iniciar_servidor.bat # Script utilitario de entorno local
├── activos/
│ └── estilos.css # Estilos globales y personalizaciones visuales
├── js/
│ ├── app.js # Ordenador del ciclo de vida y navegación de la aplicación
│ ├── componentes/ # Modales y componentes reutilizables
│ │ ├── globalSearchModal.js # Búsqueda reactiva global
│ │ ├── reclasifyModal.js # Modal de reclasificación pericial
│ │ └── webViewerModal.js # Visor documental integrado
│ ├── servicios/ # Capa lógica de servicios de procesamiento
│ │ ├── extractorEngine.js # Motor de análisis, regex y extracción inteligente
│ │ ├── fileNormalizer.js # Normalización de archivos, tipos MIME y metadatos
│ │ └── reportGenerator.js # Exportación y generación de informes periódicos
│ ├── tienda/ # Capa de alojamiento y estado
│ │ ├── fileVault.js # Gestión de mantenimiento documental
│ │ ├── mockData.js # Datos demostrativos de recursos y clientes
│ │ └── state.js # Gestor de estado global reactivo
│ └── vistas/ # Vistas principales de la plataforma
│ ├── casesView.js # Vista de gestión de recursos
│ ├── clientsView.js # Dirección y perfiles de clientes
│ ├── dashboardView.js # Tablero analítico y métricas clave
│ ├── auditionsView.js # Calendario de audiencias y términos procesales
│ ├── importadorView.js # Interfaz del Importador Zero-Touch
│ ├── loginView.js # Pantalla de acceso y control de credenciales
│ ├── repositoryView.js # Explorador y repositorio documental
│ └── settingsView.js # Configuración del bufete y preferencias
├── muertos/ # Archivos de prueba para validación del motor de importación
└── stitch_saas_legal_practice_management/ # Especificaciones de enfermería y maquetas de alta fidelidad
```

### Capas Principales: Capas Principales:
1. **Presentación (Vistas y Componentes):** Renderizado dinámico basado en componentes ligeros sin dependencias pesadas de frameworks externos. **Presentación (Vistas y Componentes):** Renderizado dinámico basado en componentes ligeros sin dependencias pesadas de frameworks externos.
 SaaS Legal — La Bóveda Soberana v2.4 AIPlataforma integral de gestión de recursos judiciales, litigio y administración de firmas legales (cero todosServicios (Servicios):** Proceso de documentos con normalización y deducción automática de datos de litigio (`extractorEngine.js`). **Servicios (Servicios):** Proceso de documentos con normalización y deducción automática de datos de litigio (`extractorEngine.js`).
 SaaS Legal — La Bóveda Soberana v2.4 AIPlataforma integral de gestión de recursos judiciales, litigio y administración de firmas legales (cero toquesEstado y Bóveda (Tienda):** Estado centralizado (`estado.js`) sincronizado con mantenimiento seguro en cliente (`fileVault.js`).

---

## ⚖️ Propiedad Intelectual y Licencia

**Copyright © 2026 Angel Gabriel Castillo Castillo. Todos los derechos reservados.**

Este proyecto es software propietario. Todos los derechos de autor, propiedad intelectual, marcas, código fuente, documentación, algoritmos y enfermería son titularidad exclusiva de **Ángel Gabriel Castillo Castillo**.

> **ADVERGENCIA:** Queda expresamente prohibida la copia, reproducción, modificación, alteración, distribución, ingeniería inversa, comercialización o uso de este software y sus recursos asociados, total o parcialmente, sin la previa y expresión autorización por escrito del titular de los derechos. Consulta el archivo [LICENCIA](LICENCIA) para más detalles.
