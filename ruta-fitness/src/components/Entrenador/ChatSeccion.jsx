import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const ChatEntrenador = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionId, setConversacionId] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");

  // 1️⃣ Cargar conversaciones del entrenador
  useEffect(() => {
    api.get("/conversaciones/")
      .then(res => setConversaciones(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2️⃣ Cargar mensajes al seleccionar conversación
  useEffect(() => {
    if (!conversacionId) return;

    api.get(`/mensajes-chat/?conversacion=${conversacionId}`)
      .then(res => setMensajes(res.data))
      .catch(err => console.error(err));
  }, [conversacionId]);

  // 3️⃣ Enviar mensaje
  const enviarMensaje = () => {
    if (!texto.trim() || !conversacionId) return;

    api.post("/mensajes-chat/", {
      conversacion: conversacionId,
      contenido: texto
    })
    .then(res => {
      setMensajes(prev => [...prev, res.data]);
      setTexto("");
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="flex h-[80vh] bg-gray-100 rounded-xl shadow-lg">

      {/* 🟦 LISTA DE CHATS */}
      <div className="w-1/3 bg-white border-r overflow-y-auto">
        <div className="p-4 font-bold bg-indigo-600 text-white">
          Chats de alumnos
        </div>

        {conversaciones.map(conv => (
          <div
            key={conv.id}
            onClick={() => setConversacionId(conv.id)}
            className={`p-3 cursor-pointer border-b hover:bg-indigo-100
              ${conv.id === conversacionId ? "bg-indigo-200" : ""}`}
          >
            👤 {conv.alumno_username}
          </div>
        ))}
      </div>

      {/* 🟩 CHAT */}
      <div className="flex flex-col flex-1">

        <div className="p-4 bg-indigo-600 text-white font-bold">
          Conversación
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {mensajes.map(msg => (
            <div
              key={msg.id}
              className={`max-w-xs px-4 py-2 rounded-xl text-sm
                ${msg.usuario_emisor === usuario.id
                  ? "bg-indigo-500 text-white ml-auto"
                  : "bg-white text-gray-800 mr-auto"}`}
            >
              {msg.contenido}
              <div className="text-[10px] opacity-70">
                {msg.usuario_emisor_username}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-2 border-t bg-white">
          <input
            className="flex-1 border rounded-full px-4 py-2 text-sm"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => e.key === "Enter" && enviarMensaje()}
            placeholder="Escribe un mensaje..."
          />
          <button
            onClick={enviarMensaje}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full"
          >
            Enviar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChatEntrenador;
