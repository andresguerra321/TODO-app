# TODO App (React 19 + Vite 7 + Tailwind CSS v4)

Proyecto de gestión de tareas ordenadas tipo cola (FIFO) creado para cumplir los criterios de evaluación técnicos y sus extras opcionales (*Nice to have*).

---

## 🚀 Inicio Rápido con Vite

### 1. Requisitos
- **Node.js**: v20.19 o superior (probado en Node v24).

### 2. Comandos Principales
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo con recarga instantánea (HMR)
npm run dev

# Compilar para producción (genera la carpeta dist/)
npm run build

# Previsualizar el build de producción localmente
npm run preview
```

> 💡 **Nota para Windows (PowerShell):**  
> Si te aparece el error: *"No se puede cargar npm.ps1 porque la ejecución de scripts está deshabilitada"*, puedes:
> 1. Usar `npm.cmd run dev` en lugar de `npm run dev`.
> 2. O habilitar permisos en PowerShell con:  
>    `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

---

## 📋 Cumplimiento de Criterios de Aceptación

| Criterio de Aceptación | Estado | Implementación |
| :--- | :---: | :--- |
| **View List** | ✅ | Muestra la lista de todos los TODOs activos ordenados. |
| **Add TODO** | ✅ | Botón dedicado que agrega inmediatamente una nueva tarea. |
| **Generic Text Only** | ✅ | Agrega el texto estándar por defecto `"TODO Item"` (en Modo Estricto no hay input). |
| **Delete First TODO** | ✅ | Botón dedicado que remueve **únicamente** el primer elemento (el superior de la lista). |
| **Unstyled UI (Criterio Base)** | ✅ | Disponible en `src/App.base.jsx` y mediante el botón **"Modo Estricto (HTML puro)"** en la interfaz. |
| **NICE TO HAVE: Tailwind CSS** | ✅ | Estilizado con Tailwind CSS v4 y tema moderno glassmorphism. |
| **NICE TO HAVE: Input antes del botón** | ✅ | Campo de texto para personalizar la tarea antes de añadirla. |

---

## 🔄 Cómo probar los dos modos

La aplicación incluye un selector integrado en la parte superior:
1. **Modo Mejorado (Nice to Have):**  
   Interfaz estilizada con Tailwind CSS v4, input para texto personalizado, contador de tareas, indicadores visuales de cuál elemento es el `#1` (próximo a eliminarse) y botón de eliminación.
2. **Modo Estricto (HTML Semántico Puro):**  
   HTML 100% nativo sin clases CSS ni estilos en línea, sin input de texto (agrega `"TODO Item"` directamente), cumpliendo a rajatabla los criterios de evaluación.

Archivos disponibles en `src/`:
- [App.jsx](file:///src/App.jsx): Componente principal interactivo con selector de modo y soporte completo para ambos requisitos.
- [App.base.jsx](file:///src/App.base.jsx): Versión mínima y aislada con HTML semántico puro sin CSS.

