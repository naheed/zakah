import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
// @ts-ignore
window.Buffer = Buffer;
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
