// === Crear Post ===
async function crearPost(info) {
    try {
        const token = localStorage.getItem("access");

        const response = await fetch("http://127.0.0.1:8000/api/comunidad-posts/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(info)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Respuesta del servidor:", errorText);
            throw new Error("Error al crear el post");
        }

        return await response.json();

    } catch (error) {
        console.error("Error creando post", error);
        throw error;
    }
}

// === Obtener Posts (GET) ===
async function getPosts() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/comunidad-posts/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los posts");
        }

        const posts = await response.json();
        return posts;

    } catch (error) {
        console.error("Hay un error al obtener los posts", error);
        throw error;
    }
}

// === Editar Post (PUT) ===
async function editarPost(id, infoActualizada) {
    try {
        const token = localStorage.getItem("access");

        const response = await fetch(`http://127.0.0.1:8000/api/comunidad-posts/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(infoActualizada)
        });

        if (!response.ok) {
            throw new Error("Error al editar el post");
        }

        return await response.json();
    } catch (error) {
        console.error("Error editando el post", error);
        throw error;
    }
}

// === Eliminar Post (DELETE) ===
async function eliminarPost(id) {
    try {
        const token = localStorage.getItem("access");

        const response = await fetch(`http://127.0.0.1:8000/api/comunidad-posts/${id}/`, {
            method: "DELETE",
            headers: {
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        return response.ok;
    } catch (error) {
        console.error("Error eliminando el post", error);
        throw error;
    }
}


// === Toggle Like ===
async function toggleLike(postId) {
    const token = localStorage.getItem("access");
    const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/toggle-like/`, {
        method: "POST",
        headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("Error al dar like:", errorText);
        throw new Error("Error al dar like");
    }

    return await res.json(); // { liked: true/false, num_reacciones: X }
}

// === Exportación ===
export default { crearPost, getPosts, editarPost, eliminarPost, toggleLike };
