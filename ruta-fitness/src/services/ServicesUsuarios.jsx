async function getUsuarios() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/usuarios", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los usuarios");
        }

        const usuarios = await response.json();
        return usuarios;

    } catch (error) {
        console.error("Hay un error al obtener los usuarios", error);
        throw error;
    }
}

async function postUsuarios(usuario) {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/usuarios/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            throw new Error("Error al crear el usuario");
        }

        const usuarioCreado = await response.json();
        return usuarioCreado;

    } catch (error) {
        console.error("Hay un error al crear el usuario", error);
        throw error;
    }
}

export default { getUsuarios, postUsuarios };
