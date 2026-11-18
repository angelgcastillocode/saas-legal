# SaaS Legal — The Sovereign Vault v2.4 AI

Plataforma integral de gestión de expedientes judiciales, litigio y administración de firmas legales (*Legal Practice Management*), diseñada con un enfoque prioritario en seguridad soberana, clasificación asistida por IA y un importador documental de procesamiento *zero-touch*.

---

## 📌 Descripción del Proyecto

**SaaS Legal** proporciona a bufetes de abogados y departamentos jurídicos una solución centralizada, reactiva y confidencial para gobernar expedientes, clientes, audiencias y contratos.

Entre sus características principales destacan:
- **Importador Zero-Touch:** Motor de ingestión documental que analiza, extrae metadatos y clasifica automáticamente archivos y expedientes sin intervención manual.
- **Repositorio Documental Seguro (*Vault*):** Bóveda estructurada para control de versiones, hash SHA-256 de integridad pericial y visualización de expedientes.
- **Búsqueda Global Inteligente:** Localización ultrarrápida de clientes, números de expediente judicial y documentos.
- **Reclasificación Asistida:** Auditoría y reclasificación granular de tipos documentales y estados procesales.
- **Interfaz Moderna en Tema Oscuro:** Diseñada bajo especificaciones de alta fidelidad con Tailwind CSS y tipografías especializadas (*Inter* y *JetBrains Mono*).

---

## 🏛️ Arquitectura del Sistema

La arquitectura está construida como una Single-Page Application (SPA) modular y desacoplada, ejecutada en el cliente con arquitectura de capas:

```
Saas Abogados/
├── index.html                   # Punto de entrada SPA, configuración de tema y layouts
├── iniciar_servidor.bat         # Script utilitario de entorno local
├── assets/
│   └── styles.css               # Estilos globales y personalizaciones visuales
├── js/
│   ├── app.js                   # Orquestador del ciclo de vida y navegación de la aplicación
│   ├── components/              # Modales y componentes reutilizables
│   │   ├── globalSearchModal.js # Búsqueda global reactiva
│   │   ├── reclassifyModal.js   # Modal de reclasificación pericial
│   │   └── webViewerModal.js    # Visor documental integrado
│   ├── services/                # Capa lógica de servicios de procesamiento
│   │   ├── extractorEngine.js   # Motor de análisis, regex y extracción inteligente
│   │   ├── fileNormalizer.js    # Normalización de archivos, tipos MIME y metadatos
│   │   └── reportGenerator.js   # Exportación y generación de reportes periciales
│   ├── store/                   # Capa de almacenamiento y estado
│   │   ├── fileVault.js         # Gestión de almacenamiento documental
│   │   ├── mockData.js          # Datos demostrativos de expedientes y clientes
│   │   └── state.js             # Gestor de estado global reactivo
│   └── views/                   # Vistas principales de la plataforma
│       ├── casesView.js         # Vista de gestión de expedientes
│       ├── clientsView.js       # Directorio y perfiles de clientes
│       ├── dashboardView.js     # Tablero analítico y métricas clave
│       ├── hearingsView.js      # Calendario de audiencias y términos procesales
│       ├── importerView.js      # Interfaz del Importador Zero-Touch
│       ├── loginView.js         # Pantalla de acceso y control de credenciales
│       ├── repositoryView.js    # Explorador y repositorio documental
│       └── settingsView.js      # Configuración del bufete y preferencias
├── samples/                     # Archivos de prueba para validación del motor de importación
└── stitch_saas_legal_practice_management/ # Especificaciones de diseño y mockups de alta fidelidad
```

### Capas Principales:
1. **Presentación (Views & Components):** Renderizado dinámico basado en componentes ligeros sin dependencias pesadas de frameworks externos.
2. **Servicios (Services):** Procesamiento de documentos con normalización y deducción automática de datos de litigio (`extractorEngine.js`).
3. **Estado y Bóveda (Store):** Estado centralizado (`state.js`) sincronizado con almacenamiento seguro en cliente (`fileVault.js`).

---

## ⚖️ Propiedad Intelectual y Licenciamiento

**Copyright © 2026 Ángel Gabriel Castillo Castillo. Todos los derechos reservados.**

Este proyecto es software propietario. Todos los derechos de autor, propiedad intelectual, marcas, código fuente, documentación, algoritmos y diseño son titularidad exclusiva de **Ángel Gabriel Castillo Castillo**.

> **ADVERTENCIA:** Queda expresamente prohibida la copia, reproducción, modificación, alteración, distribución, ingeniería inversa, comercialización o uso de este software y sus recursos asociados, total o parcialmente, sin la previa y expresa autorización por escrito del titular de los derechos. Consulte el archivo [LICENSE](LICENSE) para más detalles.
