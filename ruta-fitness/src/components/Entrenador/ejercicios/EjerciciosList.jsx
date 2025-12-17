import { useEffect, useState } from "react";
import ServicesEjercicios from "../../../services/ServicesEjercicios";
import ServicesCategorias from "../../../services/ServicesCategorias";

function EjerciciosList({ onEditar }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState("");

  // FILTROS
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("");

  const cargarEjercicios = async () => {
    const res = await ServicesEjercicios.listar(categoriaId);
    setEjercicios(res);
  };

  const cargarCategorias = async () => {
    const res = await ServicesCategorias.listar();
    setCategorias(res);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    cargarEjercicios();
  }, [categoriaId]);

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar ejercicio?")) return;
    await ServicesEjercicios.eliminar(id);
    cargarEjercicios();
  };

  // FILTRADO EN TIEMPO REAL
  const ejerciciosFiltrados = ejercicios.filter(e =>
    e.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
    e.nivel.toLowerCase().includes(filtroNivel.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ejercicios</h2>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por nombre"
          className="border p-2"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filtrar por nivel"
          className="border p-2"
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value)}
        />

        <select
          className="border p-2"
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nivel</th>
            <th>Categoría</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ejerciciosFiltrados.map(e => (
            <tr key={e.id} className="border-t">
              <td>{e.nombre}</td>
              <td>
                <span className="px-2 py-1 rounded bg-gray-200">
                  {e.nivel}
                </span>
              </td>
              <td>{e.categoria_nombre}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => onEditar(e)}
                  className="text-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminar(e.id)}
                  className="text-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EjerciciosList;
