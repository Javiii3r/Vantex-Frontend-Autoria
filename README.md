<div align="center">
  <img src="public/vvVantex.png" alt="Vantex Logo" width="200"/>

  # Vantex Frontend
  
  ### Sistema de gestión industrial y de maquinaria
  
  [![Astro](https://img.shields.io/badge/Astro-6.3.1-FF5D01.svg)](https://astro.build/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.4-38B2AC.svg)](https://tailwindcss.com/)
  [![Node.js](https://img.shields.io/badge/Node.js-22.12+-green.svg)](https://nodejs.org/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  <p align="center">
    <strong>Una interfaz moderna, ágil e intuitiva</strong> para la administración de máquinas, órdenes de trabajo, inventario y perfiles, construida sobre arquitectura Astro para maximizar el rendimiento.
  </p>
</div>

---

## 📋 Descripción

**VantexCorp Frontend** es la plataforma visual para el control integral de procesos industriales y de manufactura. Desarrollada con Astro, ofrece un rendimiento ultrarrápido al enviar la menor cantidad de JavaScript posible al cliente. 

El proyecto cuenta con un diseño que soporta "Dark Mode" de forma nativa e interactiva, empleando componentes aislados e integraciones eficientes mediante Vanilla JS para el consumo del API y garantizando una excelente experiencia de usuario (UX) tanto en dispositivos móviles (responsive) como de escritorio.

## ✨ Características

- 📊 **Dashboard Interactivo** - Panel de control general para supervisión de métricas (En desarrollo).
- 📋 **Órdenes de Trabajo** - Gestión y seguimiento completo de órdenes reactivas y preventivas.
- ⚙️ **Maquinaria** - Control del estado y operación continua de activos industriales.
- 📦 **Inventario de Repuestos** - Organización y monitoreo en tiempo real del almacén.
- 🔒 **Sistema de Autenticación** - Flujos seguros de Login, Registro y gestión avanzada de perfiles de usuario.
- 🌗 **Modo Oscuro/Claro** - Adaptación automática y manual del tema visual del sistema.
- ⚡ **Arquitectura MPA (Multi-Page App)** - Renderizado rápido y amigable gracias a las islas de Astro.
- 🎨 **Estilizado Moderno** - Integración fluida y responsiva mediante Tailwind CSS 4.

## 🛠️ Tecnologías Utilizadas

- **[Astro 6.3+](https://astro.build/)** - Framework web ultrarrápido enfocado en contenido.
- **[Tailwind CSS 4.2+](https://tailwindcss.com/)** - Framework CSS de utilidad (Utility-first) para estilización.
- **[Astro Icon 1.1+](https://www.astroicon.dev/)** - Gestión optimizada de íconos (Lucide Icons).
- **[Vanilla JavaScript]** - Lógica de vistas, servicios base (`api.js`, `auth.js`) y utilidades compartidas.
- **[Toastify JS 1.12+](https://apvarun.github.io/toastify-js/)** - Notificaciones emergentes, ligeras y personalizables.

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

| Requisito | Versión | Enlace |
|-----------|---------|--------|
| **Node.js** | 22.12+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 10+ | Incluido con Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

## 🚀 Instalación Rápida

### 1. Clona el Repositorio

```bash
git clone https://github.com/tuusuario/Vantex-Frontend.git
cd Vantex-Frontend
```

### 2. Instala las Dependencias

```bash
npm install
```

### 3. Configura las Variables de Entorno

Crea un archivo `.env` en la raíz con la configuración del Backend:

```env
PUBLIC_API_URL=http://localhost:8080/api
```

### 4. Inicia el Entorno de Desarrollo

```bash
npm run dev
```

✅ **La aplicación estará disponible en** `http://localhost:4321`

## 🏗️ Uso Rápido y Scripts Disponibles

El proyecto incluye los siguientes scripts de npm integrados para facilitar y automatizar el trabajo:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en modo watch en `localhost:4321` |
| `npm run build` | Construye el proyecto optimizado para producción en `dist/` |
| `npm run preview` | Permite previsualizar localmente el build de producción generado |
| `npm run astro` | Acceso directo a todos los comandos completos de la CLI de Astro |

## 📁 Estructura del Proyecto

```text
Vantex-Frontend/
├── public/                 # Archivos estáticos de acceso público directo (Sin build)
│   ├── favicon.svg
│   └── vvVantex.png        # Logos e identidad visual de la empresa
├── src/
│   ├── assets/             # Assets estáticos procesados (imágenes, fuentes, SVG)
│   ├── components/         # Componentes reutilizables UI en formato (.astro)
│   │   ├── AuthBranding.astro
│   │   ├── PageHeader.astro
│   │   ├── Sidebar.astro
│   │   └── ...
│   ├── layouts/            # Plantillas maestras de diagramación (Root wrapper)
│   │   └── Layout.astro
│   ├── lib/                # Funciones base de dominio, Lógica y APIs en Vanilla JS puro
│   │   ├── api.js          # Interceptores y wrappers de llamadas fetch()
│   │   ├── auth.js         # Lógica central del JWT, redirección de rutas y sesión
│   │   └── ui.js           # Cambios del DOM puros (tema visual, etc.)
│   ├── pages/              # Vista base, Rutas, y Endpoints HTML renderizados por Astro
│   │   ├── index.astro
│   │   ├── login.astro
│   │   ├── perfil.astro
│   │   └── register.astro
│   ├── styles/             # Hojas de estilo y Tailwind global CSS directives
│   │   └── global.css
│   └── views/              # Controladores dinámicos Vanilla JS atados a cada vista individual
│       ├── login.view.js
│       ├── perfil.view.js
│       └── register.view.js
├── tsconfig.json           # Configuración de compilador local e InteliSense (Typings)
├── package.json            # Instalaciones y scripts clave
└── astro.config.mjs        # Configuración y plugins principales de Astro
```

## 🏗️ Flujo de Arquitectura y Renderizado

**Vistas y Controladores Desacoplados:**
1. **`pages/*.astro`:** Estructura web HTML. Las interfaces se declaran puras, modulares y estáticas para reducir JS pesado on-load.
2. **`views/*.view.js`:** La lógica interactiva al nivel de usuario (control de DOM, eventos submit, manipulación de clases) se administra desde controladores dedicados adjuntos al tag `<script>` del componente superior.
3. **`lib/`:** Funciones de lógica transversal. La capa cliente se nutre del API y Auth base sin importar de qué "View" se llame.

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## 👥 Autores

<div align="center">
  <table align="center">
    <tr>
      <td align="center">
        <a href="https://github.com/Lorenzoo195">
          <img src="https://avatars.githubusercontent.com/u/214143437?v=4" width="100px; border-radius: 50%;" alt="Lorenzo"/><br />
          <sub><b>Lorenzo</b></sub>
        </a>
        <br />
        <p><strong>Full Stack Developer</strong></p>
      </td>
      <td align="center">
        <a href="https://github.com/Javiii3r">
          <img src="https://avatars.githubusercontent.com/u/232877625?v=4" width="100px; border-radius: 50%;" alt="Javi"/><br />
          <sub><b>Javier</b></sub>
        </a>
        <br />
        <p><strong>Full Stack Developer</strong></p>
      </td>
    </tr>
  </table>
</div>

## 🏆 Créditos y Agradecimientos

<div align="center">
  <p>Este proyecto fue desarrollado con dedicación por el equipo de VantexCorp Team.</p>
  
  **Desarrollado con ❤️ para llevar una eficiencia industrial óptima.**
  
  ---
  
  Agradecimientos Especiales a:
  - **La Comunidad de Astro** por un framework fantástico multi-page basado en content-first.
  - **Tailwind CSS team** por aportar el sistema de estilización más veloz.
  - **El equipo de QA y Diseño** de Vantex por proponer un dashboard dinámico y robusto.
</div>

---

<div align="center">
  
  [⬆ Volver al inicio](#-vantexcorp-frontend)
  
</div>