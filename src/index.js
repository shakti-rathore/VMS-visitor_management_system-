// index.js
import React from "react";
import { createRoot } from "react-dom/client"; // React 18's createRoot
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Import the new App component

// Render App component inside the BrowserRouter
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
