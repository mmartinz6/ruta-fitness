import { apiClient } from "./ApiClient";

async function listar() {
    try {
        return await apiClient("http://127.0.0.1:8000/api/categorias/", {
            method: "GET"
        });
    } catch (error) {
        console.error("Error al obtener categorías", error);
        throw error;
    }
}

async function crear(categoria) {
    try {
        return await apiClient("http://127.0.0.1:8000/api/categorias/", {
            method: "POST",
            body: JSON.stringify(categoria)
        });
    } catch (error) {
        console.error("Error al crear categoría", error);
        throw error;
    }
}

async function actualizar(id, categoria) {
    try {
        return await apiClient(`http://127.0.0.1:8000/api/categorias/${id}/`, {
            method: "PUT",
            body: JSON.stringify(categoria)
        });
    } catch (error) {
        console.error("Error al actualizar categoría", error);
        throw error;
    }
}

async function eliminar(id) {
    try {
        await apiClient(`http://127.0.0.1:8000/api/categorias/${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Error al eliminar categoría", error);
        throw error;
    }
}

export default { listar, crear, actualizar, eliminar };
