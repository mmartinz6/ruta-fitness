import { useEffect, useState } from "react";
import ServicesEjercicios from "../../../services/ServicesEjercicios";
import llamadoCategorias from "../../../services/ServicesCategorias";

function EjercicioForm({ ejercicio, onGuardado }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    video_url: "",
    imagen_url: "",
    nivel: "fácil",
    categoria: ""
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    if (ejercicio) {
      setForm({
        nombre: ejercicio.nombre,
        descripcion: ejercicio.descripcion,
        video_url: ejercicio.video_url || "",
        imagen_url: ejercicio.imagen_url || "",
        nivel: ejercicio.nivel,
        categoria: ejercicio.categoria
      });
    }
  }, [ejercicio]);

  const cargarCategorias = async () => {
    try {
      const res = await llamadoCategorias.listar();
      setCategorias(res); // ← CORRECCIÓN CLAVE
    } catch (error) {
      console.error("Error al cargar categorías", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const guardar = async (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      video_url: form.video_url,
      imagen_url: form.imagen_url,
      nivel: form.nivel,
      categoria: form.categoria
    };

    try {
      if (ejercicio) {
        await ServicesEjercicios.actualizar(ejercicio.id, data);
      } else {
        await ServicesEjercicios.crear(data);
      }

      setForm({
        nombre: "",
        descripcion: "",
        video_url: "",
        imagen_url: "",
        nivel: "fácil",
        categoria: ""
      });

      onGuardado();
    } catch (error) {
      console.error("Error al guardar ejercicio", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {ejercicio ? "Editar ejercicio" : "Crear ejercicio"}
      </h2>

      <form onSubmit={guardar} className="space-y-4">
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="border p-2 w-full"
          required
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2 w-full"
          required
        />

        <input
          name="video_url"
          value={form.video_url}
          onChange={handleChange}
          placeholder="URL del video"
          className="border p-2 w-full"
        />

        <input
          name="imagen_url"
          value={form.imagen_url}
          onChange={handleChange}
          placeholder="URL de la imagen"
          className="border p-2 w-full"
        />

        <select
          name="nivel"
          value={form.nivel}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="fácil">Fácil</option>
          <option value="medio">Medio</option>
          <option value="avanzado">Avanzado</option>
        </select>

        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Seleccione categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}

export default EjercicioForm;
