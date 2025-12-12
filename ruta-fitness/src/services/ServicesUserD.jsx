import { apiClient } from "./ApiClient";

async function getUsuariosD() {
    try {
        const usuarios = await apiClient("http://127.0.0.1:8000/api/usuariosD/", {
            method: "GET"
        });
        return usuarios;
    } catch (error) {
        console.error("Hay un error al obtener usuariosD", error);
        throw error;
    }
}

async function postUsuariosD(usuario) {
    try {
        const usuarioCreado = await apiClient("http://127.0.0.1:8000/api/usuariosD/", {
            method: "POST",
            body: JSON.stringify(usuario)
        });
        return usuarioCreado;
    } catch (error) {
        console.error("Hay un error al crear usuarioD", error);
        throw error;
    }
}

async function putUsuariosD(id, usuarioActualizado) {
    try {
        const usuario = await apiClient(`http://127.0.0.1:8000/api/usuariosD/${id}/`, {
            method: "PUT",
            body: JSON.stringify(usuarioActualizado)
        });
        return usuario;
    } catch (error) {
        console.error("Hay un error al actualizar usuarioD", error);
        throw error;
    }
}

async function deleteUsuariosD(id) {
    try {
        await apiClient(`http://127.0.0.1:8000/api/usuariosD/${id}/`, {
            method: "DELETE"
        });
        return true;
    } catch (error) {
        console.error("Hay un error al eliminar usuarioD", error);
        throw error;
    }
}

export default { getUsuariosD, postUsuariosD, putUsuariosD, deleteUsuariosD };



