import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const DEFAULT_TEXT = "TODO Item";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: text.trim() || DEFAULT_TEXT },
    ]);
    setText("");
  };

  const deleteFirst = () => setTodos((prev) => prev.slice(1));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">TODO List</h1>

        <form onSubmit={addTodo} className="mb-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={DEFAULT_TEXT}
            aria-label="Texto del TODO"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus size={18} /> Add TODO
          </button>
        </form>

        <button
          onClick={deleteFirst}
          disabled={todos.length === 0}
          className="mb-6 flex w-full items-center justify-center gap-1 rounded-lg bg-rose-500 px-4 py-2 font-medium text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={18} /> Delete first TODO
        </button>

        {todos.length === 0 ? (
          <p className="text-center text-slate-400">No hay tareas aún.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                {todo.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
