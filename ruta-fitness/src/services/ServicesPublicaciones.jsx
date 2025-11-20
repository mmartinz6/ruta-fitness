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



// === Exportación ===
export default { crearPost, getPosts };