// Versión BASE: HTML semántico puro, sin CSS (cumple los criterios obligatorios).
// Para usarla: renombra este archivo a App.jsx y quita el import de index.css en main.jsx.
import { useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);

  const [inputValue, setInputValue] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    const textToAdd = inputValue.trim() || "TODO Item";
    setTodos((prev) => [...prev, { id: crypto.randomUUID(), text: textToAdd }]);
    setInputValue("");
  };

  const deleteFirst = () => setTodos((prev) => prev.slice(1));

  return (
    <main>
      <h1>TODO List</h1>
      <form onSubmit={addTodo} style={{ marginBottom: "16px" }}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Escribe una tarea..."
          style={{ marginRight: "8px" }}
        />
        <button type="submit">Add TODO</button>
        <button type="button" onClick={deleteFirst} disabled={todos.length === 0} style={{ marginLeft: "8px" }}>
          Delete first TODO
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </main>
  );
}
