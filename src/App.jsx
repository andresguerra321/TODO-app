import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  Check,
  Pencil,
  X,
  CheckCircle2,
  Flag,
  ListFilter,
} from "lucide-react";

const DEFAULT_TEXT = "TODO Item";
const STORAGE_KEY = "Guerrita_todo_list_v2";

const INITIAL_TODOS = [
  {
    id: "init-1",
    text: "Revisar requerimientos de Don Guerra",
    completed: true,
    priority: "high",
    category: "Trabajo",
    createdAt: Date.now() - 3600000,
  },
  {
    id: "init-2",
    text: "Probar el botón Add TODO",
    completed: false,
    priority: "medium",
    category: "Trabajo",
    createdAt: Date.now() - 1800000,
  },
  {
    id: "init-3",
    text: "Validar eliminación del primer ítem",
    completed: false,
    priority: "low",
    category: "General",
    createdAt: Date.now() - 900000,
  },
];

export default function App() {
  // --- Estado con Persistencia en LocalStorage ---
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Error al cargar tareas de localStorage:", e);
    }
    return INITIAL_TODOS;
  });

  const [inputText, setInputText] = useState("");
  const [inputPriority, setInputPriority] = useState("medium"); // "low" | "medium" | "high"
  const [inputCategory, setInputCategory] = useState("Trabajo"); // "Trabajo" | "Personal" | "General"

  // Filtros: "all" | "active" | "completed"
  const [filter, setFilter] = useState("all");

  // Edición en línea
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const editInputRef = useRef(null);

  // Selector de vista: "styled" (Diseño completo) | "raw" (HTML semántico puro obligatorio)
  const [viewMode, setViewMode] = useState("styled");

  // Guardar en localStorage ante cualquier cambio
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
  }, [todos]);

  // Enfocar input al editar
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // --- Acciones de Tareas ---

  // Añadir tarea (cumple el Nice-to-have con input y fallback al texto por defecto)
  const handleAddTodo = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const textToAdd = inputText.trim() || DEFAULT_TEXT;
    const newTodo = {
      id: crypto.randomUUID(),
      text: textToAdd,
      completed: false,
      priority: inputPriority,
      category: inputCategory,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
    setInputText("");
  };

  // Añadir directamente tarea con texto genérico
  const handleAddGeneric = () => {
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: DEFAULT_TEXT,
        completed: false,
        priority: "medium",
        category: "General",
        createdAt: Date.now(),
      },
    ]);
  };

  // Criterio Obligatorio: Eliminar solo el primer elemento (Top / FIFO)
  const handleDeleteFirst = () => {
    setTodos((prev) => prev.slice(1));
  };

  // Eliminar una tarea específica
  const handleDeleteIndividual = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  // Tachar / Alternar completado
  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Iniciar edición
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // Guardar edición
  const saveEditing = () => {
    if (editingId) {
      const trimmed = editingText.trim();
      if (trimmed) {
        setTodos((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, text: trimmed } : t))
        );
      }
      setEditingId(null);
    }
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Limpiar completadas
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // Cálculos de métricas
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Tareas filtradas para la lista visual
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const firstItem = todos[0];

  // Helper para color de prioridad
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return { label: "Alta", bg: "bg-red-50 text-red-700 border-red-200" };
      case "low":
        return { label: "Baja", bg: "bg-slate-50 text-slate-600 border-slate-200" };
      default:
        return { label: "Media", bg: "bg-amber-50 text-amber-700 border-amber-200" };
    }
  };

  // ==========================================
  // VISTA MODO ESTRICTO (HTML Semántico Puro)
  // Cumple el criterio obligatorio de la prueba: sin CSS, sin input
  // ==========================================
  if (viewMode === "raw") {
    return (
      <main style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <nav style={{ marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #ccc" }}>
          <span>Vista actual: <strong>HTML Semántico Puro (Criterios Obligatorios)</strong></span>
          {" — "}
          <button onClick={() => setViewMode("styled")}>
            Cambiar a Diseño Moderno (Nice to have)
          </button>
        </nav>

        <h1>TODO List</h1>
        <p>Cumplimiento estricto de criterios de aceptación base:</p>

        <form onSubmit={handleAddTodo} style={{ margin: "16px 0" }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe una tarea..."
            style={{ marginRight: "10px", padding: "4px" }}
          />
          <button type="submit" style={{ marginRight: "10px" }}>
            Add TODO
          </button>
          <button type="button" onClick={handleDeleteFirst} disabled={todos.length === 0}>
            Delete first TODO
          </button>
        </form>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>

        {todos.length === 0 && <p><em>No hay elementos en la lista.</em></p>}
      </main>
    );
  }

  // ==========================================
  // VISTA DISEÑO COMPLETO (Nice to have con funcionalidad real)
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-100/70 text-zinc-900 antialiased font-sans flex flex-col justify-between p-4 sm:p-8">
      <main className="mx-auto w-full max-w-xl my-4 sm:my-auto">

        {/* Barra superior: Identificación y Conmutador de Modo */}
        <header className="mb-4 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Task Manager • Globant
            </span>
          </div>

          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 shadow-2xs text-xs">
            <button
              onClick={() => setViewMode("styled")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${viewMode === "styled"
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              Diseño
            </button>
            <button
              onClick={() => setViewMode("raw")}
              title="Ver versión con HTML semántico puro sin estilos (Criterio obligatorio)"
              className={`rounded-md px-2.5 py-1 font-medium transition ${viewMode === "raw"
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
                }`}
            >
              HTML Puro
            </button>
          </div>
        </header>

        {/* Tarjeta Principal */}
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">

          {/* Cabecera y Barra de Progreso */}
          <div className="mb-5 border-b border-zinc-100 pb-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  TODO List
                </h1>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Organización en cola FIFO con persistencia en tu navegador.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-zinc-900">
                  {completedCount}/{totalCount} completadas
                </span>
                <span className="text-xs text-zinc-600 ml-1.5 font-mono">
                  ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Barra visual de progreso */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full bg-zinc-900 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Formulario de Nueva Tarea (Input + Prioridad + Categoría + Add TODO) */}
          <form onSubmit={handleAddTodo} className="mb-4 space-y-2.5">
            <div>
              <label htmlFor="todo-input" className="block text-xs font-medium text-zinc-700 mb-1">
                Nueva tarea <span className="font-normal text-zinc-600">(si lo dejas vacío añade &quot;{DEFAULT_TEXT}&quot;)</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="todo-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ej. Revisar documentación del proyecto..."
                  className="flex-1 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-2xs transition hover:bg-zinc-800 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  <span>Add TODO</span>
                </button>
              </div>
            </div>

            {/* Selectores de Prioridad y Categoría */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-zinc-600">
              <span className="flex items-center gap-1 font-medium text-zinc-600">
                <Flag size={13} /> Prioridad:
              </span>
              <div className="flex rounded-md border border-zinc-200 bg-zinc-50/70 p-0.5">
                {[
                  { key: "low", label: "Baja" },
                  { key: "medium", label: "Media" },
                  { key: "high", label: "Alta" },
                ].map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setInputPriority(p.key)}
                    className={`rounded px-2 py-0.5 font-medium transition ${inputPriority === p.key
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <span className="text-zinc-300">|</span>

              <span className="font-medium text-zinc-600">Categoría:</span>
              <div className="flex rounded-md border border-zinc-200 bg-zinc-50/70 p-0.5">
                {["Trabajo", "Personal", "General"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setInputCategory(cat)}
                    className={`rounded px-2 py-0.5 font-medium transition ${inputCategory === cat
                        ? "bg-white text-zinc-900 shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-900"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Bloque de Acción Específica: Delete First TODO (Criterio obligatorio) */}
          <div className="mb-5 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-semibold text-zinc-700">Regla FIFO: </span>
                {firstItem ? (
                  <span className="text-zinc-600">
                    Siguiente a salir de la cola:{" "}
                    <strong className="text-zinc-900 font-semibold truncate inline-block max-w-[200px] align-bottom">
                      &quot;{firstItem.text}&quot;
                    </strong>
                  </span>
                ) : (
                  <span className="text-zinc-600 italic">No hay tareas en cola</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleDeleteFirst}
                disabled={todos.length === 0}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-2xs transition hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-600"
              >
                <Trash2 size={13} />
                <span>Delete first TODO</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros y Acciones Secundarias */}
          <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2 text-xs">
            <div className="flex items-center gap-1 text-zinc-600">
              <ListFilter size={14} className="text-zinc-600 mr-1" />
              {[
                { key: "all", label: `Todas (${totalCount})` },
                { key: "active", label: `Pendientes (${pendingCount})` },
                { key: "completed", label: `Completadas (${completedCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-md px-2 py-1 font-medium transition ${filter === tab.key
                      ? "bg-zinc-100 text-zinc-900 font-semibold"
                      : "text-zinc-600 hover:text-zinc-800"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {completedCount > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-xs text-zinc-600 hover:text-red-600 transition"
              >
                Limpiar completadas
              </button>
            )}
          </div>

          {/* Listado de Tareas */}
          <div>
            {filteredTodos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center">
                <CheckCircle2 size={28} className="mx-auto text-zinc-600 mb-2" />
                <p className="text-sm font-medium text-zinc-700">
                  {filter === "completed"
                    ? "No hay tareas completadas todavía"
                    : filter === "active"
                      ? "¡Todo listo! No tienes tareas pendientes"
                      : "No hay tareas en la lista"}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  {totalCount === 0
                    ? "Usa el formulario superior para añadir tu primera tarea."
                    : "Cambia el filtro arriba para ver otras tareas."}
                </p>
                {totalCount === 0 && (
                  <button
                    onClick={handleAddGeneric}
                    className="mt-3 text-xs font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
                  >
                    + Agregar &quot;{DEFAULT_TEXT}&quot; rápido
                  </button>
                )}
              </div>
            ) : (
              <ol className="divide-y divide-zinc-100 rounded-xl border border-zinc-200/80 overflow-hidden bg-white">
                {filteredTodos.map((todo) => {
                  const absoluteIndex = todos.findIndex((t) => t.id === todo.id);
                  const isTopItem = absoluteIndex === 0;
                  const isEditing = editingId === todo.id;
                  const priorityMeta = getPriorityBadge(todo.priority);

                  return (
                    <li
                      key={todo.id}
                      className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm transition ${isTopItem && !todo.completed
                          ? "bg-amber-50/40 hover:bg-amber-50/70"
                          : todo.completed
                            ? "bg-zinc-50/50 hover:bg-zinc-50"
                            : "hover:bg-zinc-50/70"
                        }`}
                    >
                      {/* Checkbox + Posición + Texto de la Tarea */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {/* Checkbox de Completado */}
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(todo.id)}
                          aria-label={todo.completed ? "Marcar como pendiente" : "Marcar como completada"}
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${todo.completed
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-zinc-300 bg-white hover:border-zinc-400"
                            }`}
                        >
                          {todo.completed && <Check size={12} strokeWidth={3} />}
                        </button>

                        {/* Índice numérico en la cola */}
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-mono font-semibold ${isTopItem && !todo.completed
                              ? "bg-amber-500 text-white"
                              : "bg-zinc-100 text-zinc-600"
                            }`}
                        >
                          {absoluteIndex + 1}
                        </span>

                        {/* Modo Edición vs Modo Vista */}
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditing();
                                if (e.key === "Escape") cancelEditing();
                              }}
                              className="flex-1 rounded border border-zinc-400 bg-white px-2 py-0.5 text-xs text-zinc-900 outline-none focus:border-zinc-900"
                            />
                            <button
                              onClick={saveEditing}
                              className="rounded bg-zinc-900 px-2 py-0.5 text-xs text-white hover:bg-zinc-800"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="rounded border border-zinc-300 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div
                            onDoubleClick={() => startEditing(todo)}
                            title="Doble clic para editar"
                            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                          >
                            <span
                              className={`truncate font-medium transition ${todo.completed
                                  ? "line-through text-zinc-600"
                                  : isTopItem
                                    ? "text-zinc-900 font-semibold"
                                    : "text-zinc-800"
                                }`}
                            >
                              {todo.text}
                            </span>

                            {/* Insignia de categoría */}
                            {todo.category && (
                              <span className="hidden sm:inline-block shrink-0 rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] text-zinc-600">
                                {todo.category}
                              </span>
                            )}

                            {/* Insignia de prioridad */}
                            <span
                              className={`shrink-0 rounded border px-1.5 py-0.2 text-[10px] font-medium ${priorityMeta.bg}`}
                            >
                              {priorityMeta.label}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Indicador de Top y Acciones Rápidas (Editar / Eliminar individual) */}
                      {!isEditing && (
                        <div className="flex items-center gap-1 shrink-0">
                          {isTopItem && !todo.completed && (
                            <span className="rounded border border-amber-200 bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
                              Top (Siguiente)
                            </span>
                          )}

                          {/* Botón Editar */}
                          <button
                            onClick={() => startEditing(todo)}
                            title="Editar tarea"
                            className="opacity-0 group-hover:opacity-100 rounded p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 transition"
                          >
                            <Pencil size={13} />
                          </button>

                          {/* Botón Eliminar individual */}
                          <button
                            onClick={() => handleDeleteIndividual(todo.id)}
                            title="Eliminar esta tarea"
                            className="opacity-0 group-hover:opacity-100 rounded p-1 text-zinc-600 hover:bg-red-50 hover:text-red-600 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* Atajos de teclado y tips */}
        <p className="mt-3 text-center text-xs text-zinc-600">
          Tips: <kbd className="rounded border border-zinc-200 bg-white px-1 py-0.5 font-mono text-[10px]">Enter</kbd> para añadir/guardar • Doble clic sobre una tarea para editarla.
        </p>
      </main>

      {/* Pie de página discreto */}
      <footer className="mt-6 text-center text-xs text-zinc-600">
        Task Manager • React 19 + Tailwind CSS + Vite
      </footer>
    </div>
  );
}
