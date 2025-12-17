import React, { useEffect, useState } from "react";
import api from "../api/axios";

const ChatCliente = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState("");
  const [conversacionId, setConversacionId] = useState(null);

  useEffect(() => {
    api.get("/conversaciones/")
      .then(res => {
        if (res.data.length > 0) {
          setConversacionId(res.data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!conversacionId) return;

    api.get(`/mensajes-chat/?conversacion=${conversacionId}`)
      .then(res => setMensajes(res.data))
      .catch(console.error);
  }, [conversacionId]);

  const enviarMensaje = () => {
    if (!texto.trim() || !conversacionId) return;

    api.post("/mensajes-chat/", {
      conversacion: conversacionId,
      contenido: texto
    }).then(res => {
      setMensajes(prev => [...prev, res.data]);
      setTexto("");
    });
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-100 rounded-xl shadow-lg">
      <div className="p-4 bg-indigo-600 text-white font-bold">
        Chat con tu entrenador
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {mensajes.map(msg => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-xl
              ${msg.usuario_emisor === usuario.id
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-white text-gray-800 mr-auto"}`}
          >
            {msg.contenido}
            <div className="text-[10px] opacity-60">
              {msg.usuario_emisor_username}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 flex gap-2 border-t bg-white">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === "Enter" && enviarMensaje()}
          className="flex-1 border rounded-full px-4 py-2"
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
  );
};

export default ChatCliente;
