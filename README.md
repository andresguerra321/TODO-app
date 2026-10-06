# TODO App (React 19 + Vite 7)

Proyecto de gestión de tareas ordenadas tipo cola (FIFO) creado para cumplir estrictamente los criterios de evaluación técnicos utilizando **HTML Semántico Puro** y descartando cualquier complejidad de estilos (CSS/Tailwind).

---

## 🌳 Arquitectura de Ramas

Este repositorio está dividido en dos ramas principales para separar los enfoques de resolución:

1. **Rama `main` (Por defecto):**
   - Contiene la implementación base en HTML Semántico Puro.
   - Cero CSS: Todo rastro de estilos en línea o frameworks como Tailwind ha sido eliminado.
   - Utiliza el patrón tradicional de **Componentes Controlados** de React (`useState` / `onChange`) para el manejo del formulario.

2. **Rama `feat/react-hook-form`:**
   - Comparte la misma interfaz pura en HTML sin estilos, pero el "motor" del formulario ha sido refactorizado.
   - Utiliza la librería **React Hook Form**.
   - Implementa **Componentes No Controlados** de alto rendimiento.
   - Añade validaciones integradas (mínimo de caracteres, campos requeridos) sin afectar el rendimiento de los re-renders.
   - *Para probarla usa:* `git checkout feat/react-hook-form`

---

## 🚀 Inicio Rápido con Vite

### 1. Requisitos
- **Node.js**: v20.19 o superior.

### 2. Comandos Principales
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev
```

> 💡 **Nota para Windows (PowerShell):**  
> Si te aparece el error de ejecución de scripts deshabilitados en terminal, puedes utilizar `npm.cmd run dev` en lugar de `npm run dev`.

---

## 📋 Cumplimiento de Criterios de Aceptación (HTML Semántico)

| Criterio | Estado | Descripción |
| :--- | :---: | :--- |
| **View List** | ✅ | Muestra la lista de todos los TODOs creados ordenados correctamente. |
| **Add TODO** | ✅ | Formulario dedicado que agrega inmediatamente una nueva tarea (con fallback automático a "TODO Item" si se deja vacío). |
| **Delete First TODO** | ✅ | Botón dedicado que remueve **únicamente** el primer elemento (Regla FIFO / el más antiguo en la lista). |
| **Unstyled UI (Obligatorio)** | ✅ | Estructura HTML 100% nativa sin clases CSS, sin frameworks y sin dependencias visuales. |
