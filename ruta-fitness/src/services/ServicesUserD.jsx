async function postUsuariosD(usuario) {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/usuariosD/", {
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

export default { postUsuariosD };