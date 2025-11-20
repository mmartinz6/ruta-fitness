import React, { useEffect, useState } from "react";
import llamadopublicaciones from "../../services/ServicesPublicaciones";
import { Heart, MessageCircle } from "lucide-react";

function ListaPost() {
  const [posts, setPosts] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  async function cargarPosts() {
    try {
      const data = await llamadopublicaciones.getPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error al cargar posts", error);
    }
  }

  // === NUEVO: LLAMAR AL ENDPOINT DE LIKE ===
  async function toggleLike(postId) {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/posts/${postId}/toggle-like/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error al dar like", err);
    }
  }

  useEffect(() => {
    cargarPosts();
  }, []);

  return (
    <div className="space-y-5 relative">

      {/* === MODAL === */}
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

      {/* === LISTA === */}
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No hay publicaciones aún.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border shadow-sm rounded-xl p-5"
          >
            {/* USUARIO */}
            <div className="mb-3">
              <p className="font-semibold text-gray-900 text-lg">
                {post.usuario_nombre} {post.usuario_apellido}
              </p>
              <p className="text-gray-600 text-sm">@{post.usuario_username}</p>
            </div>

            {/* CONTENIDO */}
            <div
              className="text-gray-800 mb-4"
              dangerouslySetInnerHTML={{ __html: post.contenido }}
            />

            {/* IMAGEN */}
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

            {/* FECHA */}
            <p className="text-xs text-gray-500 mb-3">
              {new Date(post.fecha_publicacion).toLocaleString()}
            </p>

            {/* ICONOS */}
            <div className="flex items-center gap-6 text-gray-700">

              {/* === LIKE === */}
              <button
                className="flex items-center gap-1 hover:text-red-500 transition"
                onClick={async () => {
                  const data = await toggleLike(post.id);

                  setPosts(
                    posts.map((p) =>
                      p.id === post.id
                        ? {
                            ...p,
                            num_reacciones: data.num_reacciones,
                            liked: data.liked,
                          }
                        : p
                    )
                  );
                }}
              >
                <Heart
                  className={`w-5 h-5 ${
                    post.liked ? "text-red-500 fill-red-500" : ""
                  }`}
                />
                <span className="text-sm">{post.num_reacciones}</span>
              </button>

              {/* COMENTARIOS */}
              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.num_comentarios}</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ListaPost;