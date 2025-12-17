import { apiClient } from "./ApiClient";

async function listar(categoriaId = "") {
    try {
        const url = categoriaId
            ? `http://127.0.0.1:8000/api/ejercicios/?categoria=${categoriaId}`
            : "http://127.0.0.1:8000/api/ejercicios/";

        return await apiClient(url, { method: "GET" });
    } catch (error) {
        console.error("Error al obtener ejercicios", error);
        throw error;
    }
}

async function crear(ejercicio) {
    try {
        return await apiClient("http://127.0.0.1:8000/api/ejercicios/", {
            method: "POST",
            body: JSON.stringify(ejercicio)
        });
    } catch (error) {
        console.error("Error al crear ejercicio", error);
        throw error;
    }
}

async function actualizar(id, ejercicio) {
    try {
        return await apiClient(`http://127.0.0.1:8000/api/ejercicios/${id}/`, {
            method: "PUT",
            body: JSON.stringify(ejercicio)
        });
    } catch (error) {
        console.error("Error al actualizar ejercicio", error);
        throw error;
    }
}

async function eliminar(id) {
    try {
        await apiClient(`http://127.0.0.1:8000/api/ejercicios/${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Error al eliminar ejercicio", error);
        throw error;
    }
}

export default { listar, crear, actualizar, eliminar };
