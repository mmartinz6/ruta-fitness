import React, { useEffect, useState } from "react";
import llamadopublicaciones from "../../services/ServicesPublicaciones";
import comentariosAPI from "../../services/ServicesComentariosPost";
import { Heart, MessageCircle, MoreVertical } from "lucide-react";

function ListaPost() {
  const [posts, setPosts] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [contenidoEditado, setContenidoEditado] = useState("");

  //ESTADOS PARA COMENTARIOS
  const [comentarioAbierto, setComentarioAbierto] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  //Se guarda comentarios por post: { postId: [comentarios raíz con 'respuestas'] }
  const [comentarios, setComentarios] = useState({});

  //Para respuestas (toggle por comentario id) y texto por comentario id
  const [respuestasAbiertas, setRespuestasAbiertas] = useState({});
  const [textoRespuesta, setTextoRespuesta] = useState({});

  function htmlToText(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.innerText;
  }

  async function cargarPosts() {
    try {
      const data = await llamadopublicaciones.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error al cargar posts", error);
    }
  }

  // Cargar comentarios raíz (el serializer debe incluir 'respuestas' anidadas)
  async function cargarComentarios(postId) {
    try {
      const data = await comentariosAPI.getComentarios(postId); // espera ?post=postId
      // data debe ser array de comentarios raíz, cada uno con campo 'respuestas' recursivo
      setComentarios(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error("Error al cargar comentarios", err);
    }
  }

  useEffect(() => {
    cargarPosts();
  }, []);

  function toggleMenu(id) {
    setMenuAbierto(menuAbierto === id ? null : id);
  }

  function activarEdicion(post) {
    setEditandoId(post.id);
    setContenidoEditado(htmlToText(post.contenido));
    setMenuAbierto(null);
  }

  async function guardarEdicion(post) {
    try {
      const actualizado = await llamadopublicaciones.editarPost(post.id, {
        contenido: contenidoEditado,
      });

      setPosts(posts.map((p) => (p.id === post.id ? actualizado : p)));
      setEditandoId(null);
    } catch (error) {
      console.error("Error editando:", error);
    }
  }

  async function eliminarPost(id) {
    if (!window.confirm("¿Eliminar publicación?")) return;

    try {
      const ok = await llamadopublicaciones.eliminarPost(id);
      if (ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  }

  // Crear comentario raíz
  async function enviarComentario(postId) {
    if (nuevoComentario.trim() === "") return;

    try {
      await comentariosAPI.crearComentario({
        post: postId,
        contenido: nuevoComentario,
        respuesta_a: null, // campo que espera el backend
      });

      setNuevoComentario("");
      await cargarComentarios(postId);

      // actualizar contador local (opcional)
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, num_comentarios: (p.num_comentarios || 0) + 1 } : p));
    } catch (err) {
      console.error("Error enviando comentario:", err);
    }
  }

  // Abrir/ocultar textarea de respuesta para un comentario
  function toggleRespuesta(comentarioId) {
    setRespuestasAbiertas(prev => ({ ...prev, [comentarioId]: !prev[comentarioId] }));
  }

  // Enviar respuesta (hilo) indicando respuesta_a
  async function enviarRespuesta(postId, parentId) {
    const texto = textoRespuesta[parentId];
    if (!texto || texto.trim() === "") return;

    try {
      await comentariosAPI.crearComentario({
        post: postId,
        contenido: texto,
        respuesta_a: parentId,
      });

      // Limpiar y cerrar
      setTextoRespuesta(prev => ({ ...prev, [parentId]: "" }));
      setRespuestasAbiertas(prev => ({ ...prev, [parentId]: false }));

      // Recargar comentarios de ese post (traerá nuevas respuestas anidadas)
      await cargarComentarios(postId);

      // actualizar contador local (opcional)
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, num_comentarios: (p.num_comentarios || 0) + 1 } : p));
    } catch (err) {
      console.error("Error enviando respuesta:", err);
    }
  }

  // Render recursivo de hilo: usa 'respuestas' que tu serializer devuelve
  function renderHilo(comentario, nivel = 0) {
    return (
      <div key={comentario.id} style={{ marginLeft: nivel * 18 }} className="mt-1">
        <div className="p-2 border rounded-lg bg-gray-50">
          <p className="font-semibold">{comentario.usuario_username}</p>
          <p className="text-sm">{comentario.contenido}</p>

          <div className="mt-2 flex gap-3 items-center">
            {/* Puedes agregar Like aquí si lo deseas */}
            <button
              onClick={() => toggleRespuesta(comentario.id)}
              className="text-xs text-blue-600"
            >
              Responder
            </button>
          </div>

          {respuestasAbiertas[comentario.id] && (
            <div className="mt-2">
              <textarea
                className="w-full border rounded-lg p-2 text-gray-800 text-sm"
                rows="2"
                placeholder="Escribe una respuesta..."
                value={textoRespuesta[comentario.id] || ""}
                onChange={(e) => setTextoRespuesta(prev => ({ ...prev, [comentario.id]: e.target.value }))}
              />
              <div className="mt-2">
                <button
                  onClick={() => enviarRespuesta(comentario.post, comentario.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs"
                >
                  Enviar respuesta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sub-hilos recursivos */}
        {comentario.respuestas && comentario.respuestas.length > 0 && (
          <div className="mt-2 space-y-2">
            {comentario.respuestas.map((r) => renderHilo(r, nivel + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 relative">
      {imagenSeleccionada && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setImagenSeleccionada(null)}
        >
          <img
            src={imagenSeleccionada}
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-xl"
            alt="Vista ampliada"
          />
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No hay publicaciones aún.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white shadow-lg shadow-green-400/15 rounded-xl p-5 relative">

            {/* === MENÚ === */}
            <button
              onClick={() => toggleMenu(post.id)}
              className="absolute right-3 top-3 p-1 rounded-md hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {menuAbierto === post.id && (
              <div className="absolute right-3 top-10 bg-white shadow-md rounded-md py-2 w-36 z-20">
                <button
                  className="w-full text-left px-3 py-1 text-gray-700 hover:bg-gray-100"
                  onClick={() => activarEdicion(post)}
                >
                  Editar
                </button>

                <button
                  className="w-full text-left px-3 py-1 text-red-600 hover:bg-gray-100"
                  onClick={() => eliminarPost(post.id)}
                >
                  Eliminar
                </button>

                <button
                  className="w-full text-left px-3 py-1 text-gray-700 hover:bg-gray-100"
                  onClick={() => console.log("Reportar", post.id)}
                >
                  Reportar
                </button>
              </div>
            )}

            {/* === INFO DEL USUARIO === */}
            <div className="mb-3">
              <p className="font-semibold text-gray-900 text-lg">
                {post.usuario_nombre} {post.usuario_apellido}
              </p>
              <p className="text-gray-600 text-sm">@{post.usuario_username}</p>
            </div>

            {/* === EDITAR O MOSTRAR CONTENIDO === */}
            {editandoId === post.id ? (
              <div className="mb-4">
                <textarea
                  className="w-full border rounded-lg p-2 text-gray-800"
                  rows="4"
                  value={contenidoEditado}
                  onChange={(e) => setContenidoEditado(e.target.value)}
                />

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => guardarEdicion(post)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    className="px-3 py-1 bg-gray-400 text-white rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="text-gray-800 mb-4"
                dangerouslySetInnerHTML={{ __html: post.contenido }}
              />
            )}

            {/* === IMAGEN DEL POST === */}
            {post.imagen_url && (
              <div className="w-full h-64 rounded-xl overflow-hidden mb-4 cursor-pointer">
                <img
                  src={post.imagen_url}
                  className="w-full h-full object-cover"
                  alt="Imagen del post"
                  onClick={() => setImagenSeleccionada(post.imagen_url)}
                />
              </div>
            )}

            <p className="text-xs text-gray-500 mb-3">
              {new Date(post.fecha_publicacion).toLocaleString()}
            </p>

            {/* === BOTONES DE LIKE Y COMENTAR === */}
            <div className="flex items-center gap-6 text-gray-700">
              <button
                className="flex items-center gap-1 hover:text-green-500 transition"
                onClick={async () => {
                  try {
                    const data = await llamadopublicaciones.toggleLike(post.id);
                    setPosts(posts.map((p) =>
                      p.id === post.id
                        ? { ...p, num_reacciones: data.num_reacciones, liked: data.liked }
                        : p
                    ));
                  } catch (err) {
                    console.error("Error al dar like:", err);
                  }
                }}
              >
                <Heart className={`w-5 h-5 ${post.liked ? "text-green-500 fill-green-500" : ""}`} />
                <span className="text-sm">{post.num_reacciones}</span>
              </button>

              {/* Abrir comentarios */}
              <button
                className="flex items-center gap-1 hover:text-blue-600 transition"
                onClick={() => {
                  const nuevo = comentarioAbierto === post.id ? null : post.id;
                  setComentarioAbierto(nuevo);
                  if (nuevo) cargarComentarios(post.id);
                }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.num_comentarios}</span>
              </button>
            </div>

            {/* === ÁREA DE COMENTARIOS === */}
            {comentarioAbierto === post.id && (
              <div className="mt-4">

                {/* LISTADO DE COMENTARIOS RAÍZ (cada uno trae 'respuestas') */}
                <div className="space-y-2 mb-3">
                  {!comentarios[post.id] || comentarios[post.id]?.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
                  ) : (
                    comentarios[post.id].map((c) => renderHilo(c))
                  )}
                </div>

                {/* ESCRIBIR COMENTARIO RAÍZ */}
                <textarea
                  className="w-full border rounded-lg p-2 text-gray-800"
                  rows="3"
                  placeholder="Escribe un comentario..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                />

                <button
                  onClick={() => enviarComentario(post.id)}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md"
                >
                  Enviar
                </button>
              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
}

export default ListaPost;
