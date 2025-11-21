// === Base URL ===
const BASE = "http://127.0.0.1:8000/api/comentario-posts/";

// === Crear Comentario ===
async function crearComentario(info) {
    try {
        const token = localStorage.getItem("access");

        const response = await fetch(BASE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(info)
        });

        if (!response.ok) throw new Error("Error al crear comentario");

        return await response.json();
    } catch (error) {
        console.error("Error creando comentario:", error);
    }
}

// === Obtener Comentarios por Post ===
async function getComentarios(postId) {
    try {
        const response = await fetch(`${BASE}?post=${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Error al obtener comentarios");

        return await response.json();
    } catch (error) {
        console.error("Error obteniendo comentarios:", error);
    }
}

// === Editar Comentario ===
async function editarComentario(id, info) {
    try {
        const token = localStorage.getItem("access");

        const response = await fetch(`${BASE}${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(info)
        });

        if (!response.ok) throw new Error("Error al editar comentario");

        return await response.json();
    } catch (error) {
        console.error("Error editando comentario:", error);
    }
}

// === Eliminar Comentario ===
async function eliminarComentario(id) {
    try {
        const token = localStorage.getItem("access");

        const response = await fetch(`${BASE}${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        return response;
    } catch (error) {
        console.error("Error eliminando comentario:", error);
    }
}

export default {
    crearComentario,
    getComentarios,
    editarComentario,
    eliminarComentario,
};