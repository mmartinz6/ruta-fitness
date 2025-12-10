import { apiClient } from "./ApiClient";

// === Crear Post ===
async function crearPost(info) {
    try {
        const postCreado = await apiClient("http://127.0.0.1:8000/api/comunidad-posts/", {
            method: "POST",
            body: JSON.stringify(info)
        });
        return postCreado;
    } catch (error) {
        console.error("Error creando post", error);
        throw error;
    }
}

// === Obtener Posts (GET) ===
async function getPosts() {
    try {
        const posts = await apiClient("http://127.0.0.1:8000/api/comunidad-posts/", {
            method: "GET"
        });
        return posts;
    } catch (error) {
        console.error("Hay un error al obtener los posts", error);
        throw error;
    }
}

// === Editar Post (PUT) ===
async function editarPost(id, infoActualizada) {
    try {
        const postEditado = await apiClient(`http://127.0.0.1:8000/api/comunidad-posts/${id}/`, {
            method: "PUT",
            body: JSON.stringify(infoActualizada)
        });
        return postEditado;
    } catch (error) {
        console.error("Error editando el post", error);
        throw error;
    }
}

// === Eliminar Post (DELETE) ===
async function eliminarPost(id) {
    try {
        await apiClient(`http://127.0.0.1:8000/api/comunidad-posts/${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Error eliminando el post", error);
        throw error;
    }
}

// === Toggle Like ===
async function toggleLike(postId) {
    try {
        const resultado = await apiClient(`http://127.0.0.1:8000/api/posts/${postId}/toggle-like/`, {
            method: "POST"
        });
        return resultado; // { liked: true/false, num_reacciones: X }
    } catch (error) {
        console.error("Error al dar like:", error);
        throw error;
    }
}


export default { crearPost, getPosts, editarPost, eliminarPost, toggleLike };

