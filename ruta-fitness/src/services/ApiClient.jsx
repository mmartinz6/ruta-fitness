import React, { useEffect } from "react"; 
import { createRoot } from "react-dom/client";
import SesionModalPortal from "../components/sesionModal/SesionModalPortal";

let modalAbierto = false; // Evita abrir varios modales a la vez

// Función para mostrar el modal y esperar la respuesta del usuario
export function mostrarModalAsync() {
  return new Promise((resolve) => {
    if (modalAbierto) return;
    modalAbierto = true;

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container); // React 18+

    const cleanup = () => {
      root.unmount();
      container.remove();
      modalAbierto = false;
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      cerrarSesion();
      resolve(false);
    };

    root.render(
      <SesionModalPortal onConfirm={handleConfirm} onCancel={handleCancel} />
    );
  });
}

// Función para renovar el token
export async function renovarToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return cerrarSesion();

  const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return cerrarSesion();

  const data = await res.json();
  localStorage.setItem("access", data.access);
  return data.access;
}

// Función para cerrar sesión
export function cerrarSesion() {
  localStorage.clear();
  window.location.href = "/login";
}

// Función para detectar si el token expira pronto
export function tokenExpiraPronto(token) {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const ahora = Date.now() / 1000;
  return payload.exp - ahora < 60; // alerta 1 minuto antes
}

// Función principal apiClient
export async function apiClient(url, options = {}) {
  let token = localStorage.getItem("access");

  if (token && tokenExpiraPronto(token)) {
    const continuar = await mostrarModalAsync();
    if (!continuar) throw new Error("Sesión cancelada por el usuario");
    token = await renovarToken();
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = { ...options, headers };
  const response = await fetch(url, config);

  if (response.status === 401) {
    const nuevoToken = await renovarToken();
    if (!nuevoToken) throw new Error("Sesión expirada");
    return apiClient(url, options); // reintentar
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API ERROR:", errorText);
    throw new Error(errorText || "Error en la petición");
  }

  if (response.status === 204 || response.status === 205) return true;

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// =====================
// Componente global TokenWatcher
// Montar una vez en App.jsx para revisar token continuamente
// =====================
export function TokenWatcher() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("access");
      if (token && tokenExpiraPronto(token)) {
        const continuar = await mostrarModalAsync();
        if (!continuar) return cerrarSesion();
        await renovarToken();
      }
    }, 30000); // revisar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return null; // no renderiza nada
}
