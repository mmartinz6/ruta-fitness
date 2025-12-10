import { apiClient } from "./ApiClient";

async function getGrupos() { 
    try {
        const grupos = await apiClient("http://127.0.0.1:8000/api/usergroup/", {
            method: "GET"
        });
        return grupos;
    } catch (error) {
        console.error("Hay un error al obtener los grupos", error);
        throw error;
    }
}

async function postGrupos(info) {
    try {
        // Validar que info tenga user y group
        if (!info.user || !info.group) {
            throw new Error("Los campos 'user' y 'group' son obligatorios");
        }

        const grupoCreado = await apiClient("http://127.0.0.1:8000/api/usergroup/", {
            method: "POST",
            body: JSON.stringify(info)
        });
        return grupoCreado;

    } catch (error) {
        console.error("Hay un error al crear el grupo", error);
        throw error;
    }
}

async function deleteGrupos(id) {
    try {
        await apiClient(`http://127.0.0.1:8000/api/usergroup/${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Hay un error al eliminar el grupo", error);
        throw error;
    }
}

export default { getGrupos, postGrupos, deleteGrupos };

