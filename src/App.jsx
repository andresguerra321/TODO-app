import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Check, ListFilter } from "lucide-react";

const DEFAULT_TEXT = "TODO Item";
const STORAGE_KEY = "globant_todo_list_v2";

const INITIAL_TODOS = [
  { id: "1", text: "Revisar requerimientos de Globant", completed: true },
  { id: "2", text: "Probar el botón Add TODO", completed: false },
  { id: "3", text: "Validar eliminación del primer ítem", completed: false },
];

export default function App() {
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
  const [viewMode, setViewMode] = useState("styled"); // "styled" | "raw"
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
  }, [todos]);

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const handleToggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTodo = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const taskContent = inputText.trim() || DEFAULT_TEXT;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: taskContent, completed: false },
    ]);
    setInputText("");
  };

  const handleAddGeneric = () => {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: DEFAULT_TEXT, completed: false },
    ]);
  };

  const handleDeleteFirst = () => {
    setTodos((prev) => prev.slice(1));
  };

  if (viewMode === "raw") {
    return (
      <main style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <nav style={{ marginBottom: "24px", paddingBottom: "12px", borderBottom: "1px solid #ccc" }}>
          <span>Vista: <strong>HTML Semántico Puro (Criterios Obligatorios)</strong></span>
          {" — "}
          <button onClick={() => setViewMode("styled")}>
            Cambiar a Diseño Moderno (Nice to have)
          </button>
        </nav>

        <h1>TODO List</h1>
        <div style={{ margin: "16px 0" }}>
          <button onClick={handleAddGeneric} style={{ marginRight: "10px" }}>
            Add TODO
          </button>
          <button onClick={handleDeleteFirst} disabled={todos.length === 0}>
            Delete first TODO
          </button>
        </div>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      </main>
    );
  }

  const firstItem = todos[0];

  return (
    <div className="min-h-screen bg-zinc-100/80 text-zinc-900 antialiased font-sans flex flex-col justify-between p-4 sm:p-8">
      <main className="mx-auto w-full max-w-xl my-auto">
        <div className="mb-4 flex items-center justify-between px-1">
          <span className="text-xs font-medium text-zinc-600">
            Prueba Técnica • <strong className="text-zinc-700">TODO FIFO</strong>
          </span>

          <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 shadow-2xs text-xs">
            <button
              onClick={() => setViewMode("styled")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                viewMode === "styled"
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Diseño
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`rounded-md px-2.5 py-1 font-medium transition ${
                viewMode === "raw"
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              HTML Puro
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
          <div className="mb-6 border-b border-zinc-100 pb-4">
            <div className="flex items-baseline justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  TODO List
                </h1>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Las tareas se ordenan cronológicamente y se eliminan desde arriba.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-zinc-900">
                  {completedCount}/{totalCount} completadas
                </span>
                <span className="text-xs text-zinc-600 ml-1 font-mono">
                  ({progressPercent}%)
                </span>
              </div>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full bg-zinc-900 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="mb-4">
            <label htmlFor="todo-input" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Nueva tarea <span className="font-normal text-zinc-600">(opcional: si lo dejas vacío añade &quot;{DEFAULT_TEXT}&quot;)</span>
            </label>
            <div className="flex gap-2">
              <input
                id="todo-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe el nombre de la tarea..."
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
          </form>

          <div className="mb-6 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-medium text-zinc-700">Acción de borrado: </span>
                {firstItem ? (
                  <span className="text-zinc-600">
                    Siguiente en salir: <strong className="text-zinc-900 font-semibold">&quot;{firstItem.text}&quot;</strong>
                  </span>
                ) : (
                  <span className="text-zinc-600 italic">No hay tareas para eliminar</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleDeleteFirst}
                disabled={todos.length === 0}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 shadow-2xs transition hover:bg-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-600"
              >
                <Trash2 size={14} />
                <span>Delete first TODO</span>
              </button>
            </div>
          </div>

          {/* Barra de Filtros */}
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
                  className={`rounded-md px-2 py-1 font-medium transition ${
                    filter === tab.key
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

          <div>
            <div className="mb-2 flex items-center justify-between px-1 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              <span>Orden de atención</span>
              <span>Posición</span>
            </div>

            {filteredTodos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center">
                <CheckCircle2 size={32} className="mx-auto text-zinc-600 mb-2" />
                <p className="text-sm font-medium text-zinc-700">No hay tareas</p>
              </div>
            ) : (
              <ol className="divide-y divide-zinc-100 rounded-xl border border-zinc-200/80 overflow-hidden">
                {filteredTodos.map((todo, index) => {
                  const isFirst = index === 0;
                  return (
                    <li
                      key={todo.id}
                      className={`flex items-center justify-between px-3.5 py-3 text-sm transition ${
                        isFirst
                          ? "bg-amber-50/50 hover:bg-amber-50"
                          : "bg-white hover:bg-zinc-50/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
                        <button
                          type="button"
                          onClick={() => handleToggleComplete(todo.id)}
                          aria-label={todo.completed ? "Marcar como pendiente" : "Marcar como completada"}
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition ${
                            todo.completed
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-zinc-300 bg-white hover:border-zinc-400"
                          }`}
                        >
                          {todo.completed && <Check size={12} strokeWidth={3} />}
                        </button>

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-mono font-semibold ${
                            isFirst && !todo.completed
                              ? "bg-amber-500 text-white"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {index + 1}
                        </span>

                        <span className={`truncate ${todo.completed ? "line-through text-zinc-400" : isFirst ? "font-semibold text-zinc-900" : "text-zinc-700"}`}>
                          {todo.text}
                        </span>
                      </div>

                      {isFirst && (
                        <span className="shrink-0 rounded-md border border-amber-200 bg-amber-100/80 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                          Primero (Top)
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
