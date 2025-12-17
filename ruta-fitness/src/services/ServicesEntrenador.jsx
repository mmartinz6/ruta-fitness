import { apiClient } from "./ApiClient";

/**
 * Obtener todas las rutinas asignadas al entrenador
 */
async function getRutinas() {
  try {
    const response = await apiClient(
      "http://127.0.0.1:8000/api/entrenador/rutinas/",
      { method: "GET" }
    );

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error al obtener las rutinas:", error);
    throw error;
  }
}

/**
 * Obtener el detalle completo de una rutina por ID
 */
async function getRutinaById(id) {
  try {
    const response = await apiClient(
      `http://127.0.0.1:8000/api/usuario-rutinas/${id}/`,
      { method: "GET" }
    );

    return response || {};
  } catch (error) {
    console.error("Error al obtener la rutina:", error);
    throw error;
  }
}

/**
 * Obtener banco completo de ejercicios
 */
async function getEjercicios() {
  try {
    const response = await apiClient(
      "http://127.0.0.1:8000/api/ejercicios/",
      { method: "GET" }
    );

    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error al obtener los ejercicios:", error);
    throw error;
  }
}

/**
 * Actualizar rutina (orden de ejercicios y marcar como revisada)
 */
async function putRutina(id, data) {
  try {
    const response = await apiClient(
      `http://127.0.0.1:8000/api/entrenador/rutina/${id}/editar/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response;
  } catch (error) {
    console.error("Error al actualizar la rutina:", error);
    throw error;
  }
}

export default {
  getRutinas,
  getRutinaById,
  getEjercicios,
  putRutina,
};
