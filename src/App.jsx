import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const STORAGE_KEY = "Guerrita_todo_list_v2";

const INITIAL_TODOS = [
  { id: "init-1", text: "Revisar requerimientos de Don Guerra", priority: "alta", completed: true },
  { id: "init-2", text: "Probar React Hook Form", priority: "media", completed: false }
];

export default function App() {
  // 1. Estado global de las tareas
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TODOS;
  });

  // 2. Inicialización de React Hook Form (Sustituye a useState para los inputs)
  const {
    register,      // Reemplaza a "value" y "onChange" (No Controlado por debajo)
    handleSubmit,  // Sustituye al e.preventDefault()
    reset,         // Sustituye a setInputText("")
    formState: { errors }
  } = useForm({
    defaultValues: { text: "", priority: "media" }
  });

  // Persistencia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 3. Función al hacer submit: Ya recibe la "data" empaquetada y validada
  const onSubmit = (data) => {
    const newTodo = {
      id: crypto.randomUUID(),
      text: data.text,
      priority: data.priority,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    reset(); // Limpia automáticamente los inputs
  };

  // Funciones de las tareas
  const deleteFirst = () => setTodos((prev) => prev.slice(1));
  const deleteIndividual = (id) => setTodos((prev) => prev.filter(t => t.id !== id));
  const toggleComplete = (id) => setTodos((prev) =>
    prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  );

  // VISTA SIMPLE FUNCIONAL (HTML Semántico, sin Tailwind)
  return (
    <main style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>

      <h1>TODO List con React Hook Form</h1>
      <p>Visualización simple funcional </p>

      {/* 4. Formulario enganchado a RHF */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "20px 0", border: "1px solid #ccc", padding: "16px" }}>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="text" style={{ display: "block", marginBottom: "4px" }}>Nueva Tarea:</label>

          {/* Input registrado en RHF con validación */}
          <input
            id="text"
            placeholder="Ej. Comprar leche..."
            {...register("text", {
              required: "La tarea no puede estar vacía",
              minLength: { value: 3, message: "Debe tener al menos 3 caracteres" }
            })}
            style={{ width: "80%", padding: "6px" }}
          />
          {/* Mensajes de error en tiempo real */}
          {errors.text && <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{errors.text.message}</div>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="priority" style={{ display: "block", marginBottom: "4px" }}>Prioridad:</label>

          {/* Select también registrado en RHF */}
          <select id="priority" {...register("priority")} style={{ padding: "6px" }}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit" style={{ marginRight: "10px", padding: "6px 12px", cursor: "pointer" }}>
            Añadir Tarea
          </button>
          <button type="button" onClick={deleteFirst} disabled={todos.length === 0} style={{ padding: "6px 12px", cursor: "pointer" }}>
            Eliminar Primera (Top)
          </button>
        </div>

      </form>

      <section>
        <h2>Lista de Tareas ({todos.length})</h2>
        {todos.length === 0 ? (
          <p><em>No hay tareas en la lista.</em></p>
        ) : (
          <ul style={{ paddingLeft: "20px" }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "10px" }}>

                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  style={{ transform: "scale(1.2)", cursor: "pointer" }}
                />

                <span style={{ textDecoration: todo.completed ? "line-through" : "none", color: todo.completed ? "#888" : "#000" }}>
                  <strong>{todo.text}</strong> <em style={{ fontSize: "12px" }}>(Prioridad: {todo.priority})</em>
                </span>

                <button type="button" onClick={() => deleteIndividual(todo.id)} style={{ padding: "2px 6px", cursor: "pointer" }}>
                  Eliminar
                </button>

              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
