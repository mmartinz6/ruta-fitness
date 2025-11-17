async function postGrupos(info) {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/usergroup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
        });

        if (!response.ok) {
            throw new Error("Error al crear el usuario");
        }

        const usuarioGrupoCreado = await response.json();
        return usuarioGrupoCreado;

    } catch (error) {
        console.error("Hay un error al crear el usuario", error);
        throw error;
    }
}

export default {postGrupos };
