import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { SocketProvider } from './contexts/SocketContext';
import { AuthProvider } from './contexts/AuthContext';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthProvider>
);