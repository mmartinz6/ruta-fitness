import React, { useState, useEffect } from "react";
import axios from "axios";

function Configuracion() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const rawUser = localStorage.getItem("usuarioActivo");

        if (rawUser) {
            const user = JSON.parse(rawUser);
            if (user.id_user) {
                setUserId(user.id_user);
            }
        }
    }, []);

    // ---------- CAMBIAR NOMBRE ----------
    const handleNombre = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/update-nombre/${userId}/`, {
                nombre: nombre,
            });

            alert("Nombre actualizado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar nombre");
        }
    };

    // ---------- CAMBIAR EMAIL ----------
    const handleCorreo = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/update-email/${userId}/`, {
                email: correo,
            });

            alert("Correo actualizado correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar correo");
        }
    };

    // ---------- CAMBIAR PASSWORD ----------
    const handlePassword = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://127.0.0.1:8000/api/update-password/${userId}/`, {
                password: password,
            });

            alert("Contraseña actualizada correctamente");
        } catch (error) {
            console.error(error);
            alert("Error al actualizar contraseña");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 mt-6">
            <h1 className="text-2xl font-bold text-gray-800">Configuración de la Cuenta</h1>

            {/* Cambiar Nombre */}
            <form onSubmit={handleNombre} className="p-4 bg-white shadow-md rounded-xl space-y-4">
                <h2 className="text-lg font-semibold">Cambiar nombre</h2>
                <input
                    type="text"
                    placeholder="Nuevo nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Guardar
                </button>
            </form>

            {/* Cambiar correo */}
            <form onSubmit={handleCorreo} className="p-4 bg-white shadow-md rounded-xl space-y-4">
                <h2 className="text-lg font-semibold">Cambiar correo electrónico</h2>
                <input
                    type="email"
                    placeholder="Nuevo correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Guardar
                </button>
            </form>

            {/* Cambiar contraseña */}
            <form onSubmit={handlePassword} className="p-4 bg-white shadow-md rounded-xl space-y-4">
                <h2 className="text-lg font-semibold">Cambiar contraseña</h2>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default Configuracion;