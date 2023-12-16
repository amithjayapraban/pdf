import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <CProvider>
      <App />
    </CProvider>
  </React.StrictMode>
);
