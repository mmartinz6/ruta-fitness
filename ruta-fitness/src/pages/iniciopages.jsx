import React, { useEffect, useState } from "react";

const mensajes = [
  "Hoy es un gran día para cuidar tu cuerpo 💪",
  "Pequeños hábitos crean grandes cambios 🌱",
  "Tu salud es tu mejor inversión ❤️",
  "Un paso a la vez, pero sin detenerse 🚀",
];

function InicioPages() {
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const rawUser = localStorage.getItem("usuarioActivo");
    if (rawUser) {
      setUsuario(JSON.parse(rawUser));
    }

    setMensaje(mensajes[Math.floor(Math.random() * mensajes.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center mt-20 space-y-6">
      
      <h1 className="text-3xl font-bold text-gray-800">
        {usuario
          ? `¡Hola ${usuario.first_name || usuario.username}! 👋`
          : "¡Bienvenido!"}
      </h1>

      <p className="text-lg text-gray-600 max-w-xl">
        {mensaje}
      </p>

      <div className="bg-indigo-100 text-indigo-700 px-6 py-4 rounded-xl shadow-md">
        Recuerda: entrenar tu cuerpo también fortalece tu mente 🧠💙
      </div>
    </div>
  );
}

export default InicioPages;
