import { apiClient } from "./ApiClient"; // importa apiClient

async function getUsuarios() {
    try {
        const usuarios = await apiClient("http://127.0.0.1:8000/api/usuarios", {
            method: "GET"
        });
        return usuarios;
    } catch (error) {
        console.error("Hay un error al obtener los usuarios", error);
        throw error;
    }
}

async function postUsuarios(usuario) {
    try {
        const usuarioCreado = await apiClient("http://127.0.0.1:8000/api/usuarios/", {
            method: "POST",
            body: JSON.stringify(usuario)
        });
        return usuarioCreado;
    } catch (error) {
        console.error("Hay un error al crear el usuario", error);
        throw error;
    }
}

async function putUsuarios(id, usuarioActualizado) {
    try {
        const usuario = await apiClient(`http://127.0.0.1:8000/api/usuarios/${id}/`, {
            method: "PUT",
            body: JSON.stringify(usuarioActualizado)
        });
        return usuario;
    } catch (error) {
        console.error("Hay un error al actualizar el usuario", error);
        throw error;
    }
}

async function deleteUsuarios(id) {
    try {
        await apiClient(`http://127.0.0.1:8000/api/usuarios/${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Hay un error al eliminar el usuario", error);
        throw error;
    }
}

export default { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios };

