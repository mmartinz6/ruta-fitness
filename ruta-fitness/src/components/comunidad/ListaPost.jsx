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

  // === ESTADOS PARA COMENTARIOS ===
  const [comentarioAbierto, setComentarioAbierto] = useState(null);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);

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

  async function cargarComentarios(postId) {
    try {
      const data = await comentariosAPI.getComentarios();
      const filtrados = data.filter((c) => c.post === postId);
      setComentarios(filtrados);
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

  async function enviarComentario(postId) {
    if (nuevoComentario.trim() === "") return;

    try {
      await comentariosAPI.crearComentario({
        post: postId,
        contenido: nuevoComentario,
      });

      // Limpiar campo
      setNuevoComentario("");

      // Recargar comentarios del post
      cargarComentarios(postId);

      // Actualizar contador en UI
      setPosts(
        posts.map((p) =>
          p.id === postId
            ? { ...p, num_comentarios: p.num_comentarios + 1 }
            : p
        )
      );

    } catch (err) {
      console.error("Error enviando comentario:", err);
    }
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
                  setComentarioAbierto(
                    comentarioAbierto === post.id ? null : post.id
                  );
                  cargarComentarios(post.id);
                }}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.num_comentarios}</span>
              </button>
            </div>

            {/* === ÁREA DE COMENTARIOS === */}
            {comentarioAbierto === post.id && (
              <div className="mt-4">

                {/* LISTADO DE COMENTARIOS */}
                <div className="space-y-2 mb-3">
                  {comentarios.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
                  ) : (
                    comentarios.map((c) => (
                      <div key={c.id} className="p-2 border rounded-lg text-sm bg-gray-50">
                        <p className="font-semibold">{c.usuario_username}</p>
                        <p>{c.contenido}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* ESCRIBIR COMENTARIO */}
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
