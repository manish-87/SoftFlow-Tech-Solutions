import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create root and render app
const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(<App />);
