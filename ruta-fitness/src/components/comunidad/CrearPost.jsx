import React, { useState, useRef } from "react";
import { Bold, Italic, Underline, Image, X } from "lucide-react";
import llamadopublicaciones from "../../services/ServicesPublicaciones";
import { uploadToCloudinary } from "../cloud/SubirCloudinary";

function CrearPost() {
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const editorRef = useRef(null);

  const token = localStorage.getItem("access");

  if (!token) {
    return (
      <p className="text-center text-gray-600 text-sm py-6">
        Debes iniciar sesión para publicar.
      </p>
    );
  }

  function aplicarFormato(comando) {
    document.execCommand(comando, false, null);
  }

  async function manejarPublicar() {
    const contenido = editorRef.current.innerHTML.trim();

    if (!contenido || contenido === "<br>") {
      alert("El contenido no puede estar vacío.");
      return;
    }

    let imagen_url = null;


    if (archivoImagen) {
      try {
        const result = await uploadToCloudinary(archivoImagen);
        imagen_url = result.secure_url;
      } catch (error) {
        console.error("Error subiendo imagen:", error);
      }
    }

    const nuevoPost = { contenido, imagen_url };

    try {
      await llamadopublicaciones.crearPost(nuevoPost);
      alert("Publicado con éxito");


      editorRef.current.innerHTML = "";
      setArchivoImagen(null);
      setPreview(null);


      window.location.reload();
    } catch (error) {
      alert("No se pudo publicar.");
      console.error(error);
    }
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Crear publicación
      </h2>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="w-full border border-gray-300 rounded-lg p-3 min-h-[120px]
                   focus:outline-none focus:ring-2 focus:ring-green-600 mb-3 bg-white"
      ></div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 p-2 border border-gray-300 rounded-lg bg-gray-50 mb-4">
        <button onClick={() => aplicarFormato("bold")} className="text-gray-700 hover:text-black">
          <Bold size={20} />
        </button>

        <button onClick={() => aplicarFormato("italic")} className="text-gray-700 hover:text-black">
          <Italic size={20} />
        </button>

        <button onClick={() => aplicarFormato("underline")} className="text-gray-700 hover:text-black">
          <Underline size={20} />
        </button>

        {/* Botón de imagen */}
        <label className="ml-auto cursor-pointer">
          <Image size={18} className="text-gray-700 hover:text-black" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;


              setArchivoImagen(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      {/* Vista previa pequeña + botón eliminar */}
      {preview && (
        <div className="relative w-32 h-32 mb-4">
          <img
            src={preview}
            alt="Vista previa"
            className="w-32 h-32 object-cover rounded-lg border"
          />

          {/* Botón de eliminar */}
          <button
            onClick={() => {
              setArchivoImagen(null);
              setPreview(null);
            }}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Botón Publicar */}
      <button
        onClick={manejarPublicar}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Publicar
      </button>
    </div>
  );
}

export default CrearPost;