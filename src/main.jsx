import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // quita esta línea si quieres la versión 100% sin estilos
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
