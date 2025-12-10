import { apiClient } from "./ApiClient";
// === Base URL === 
const BASE = "http://127.0.0.1:8000/api/comentario-posts/";

// === Crear Comentario ===
async function crearComentario(info) {
    try {
        const comentarioCreado = await apiClient(BASE, {
            method: "POST",
            body: JSON.stringify(info)
        });
        return comentarioCreado;
    } catch (error) {
        console.error("Error creando comentario:", error);
        throw error;
    }
}

// === Obtener Comentarios por Post ===
async function getComentarios(postId) {
    try {
        const comentarios = await apiClient(`${BASE}?post=${postId}`, {
            method: "GET"
        });
        return comentarios;
    } catch (error) {
        console.error("Error obteniendo comentarios:", error);
        throw error;
    }
}

// === Editar Comentario ===
async function editarComentario(id, info) {
    try {
        const comentarioEditado = await apiClient(`${BASE}${id}/`, {
            method: "PUT",
            body: JSON.stringify(info)
        });
        return comentarioEditado;
    } catch (error) {
        console.error("Error editando comentario:", error);
        throw error;
    }
}

// === Eliminar Comentario ===
async function eliminarComentario(id) {
    try {
        await apiClient(`${BASE}${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Error eliminando comentario:", error);
        throw error;
    }
}

export default {
    crearComentario,
    getComentarios,
    editarComentario,
    eliminarComentario,
};
