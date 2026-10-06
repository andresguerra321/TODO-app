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
      
      <form onSubmit={addTodo}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Escribe una tarea..."
        />
        <button type="submit">Add TODO</button>
        <button type="button" onClick={deleteFirst} disabled={todos.length === 0}>
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
