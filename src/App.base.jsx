// Versión BASE: HTML semántico puro, sin CSS (cumple los criterios obligatorios).
// Para usarla: renombra este archivo a App.jsx y quita el import de index.css en main.jsx.
import { useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = () =>
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: "TODO Item" }]);

  const deleteFirst = () => setTodos((prev) => prev.slice(1));

  return (
    <main>
      <h1>TODO List</h1>
      <button onClick={addTodo}>Add TODO</button>
      <button onClick={deleteFirst} disabled={todos.length === 0}>
        Delete first TODO
      </button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </main>
  );
}
