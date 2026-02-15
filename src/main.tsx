import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
// Buffer polyfill required by some dependencies (e.g., Plaid, crypto)
(window as unknown as Record<string, unknown>).Buffer = Buffer;
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
