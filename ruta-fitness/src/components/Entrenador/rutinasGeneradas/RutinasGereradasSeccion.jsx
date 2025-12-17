import React, { useEffect, useState } from "react";
import entrenadorServices from "../../../services/ServicesEntrenador";
import EditarRutinaModal from "./EditarRutinaModal";

function RutinasAutogeneradas() {
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

  const cargarRutinas = async () => {
    try {
      setLoading(true);
      const res = await entrenadorServices.getRutinas();

      // Filtrar solo rutinas que tengan usuario asignado
      const usuarioRutinas = (res || []).filter(r => r.usuario_username);

      // Mapear para asegurar que todos los campos necesarios estén presentes
      const rutinasMapeadas = usuarioRutinas.map(r => ({
        id: r.id,
        nombre: r.rutina?.nombre || r.rutina_nombre || "Sin nombre",
        usuario_username: r.usuario_username || "Desconocido",
        nivel: r.rutina?.nivel || r.nivel || "Desconocido",
        rutina: r.rutina || null
      }));

      setRutinas(rutinasMapeadas);
    } catch (err) {
      setError("No se pudieron cargar las rutinas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRutinas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rutinas Autogeneradas</h1>

      {error && <p className="text-red-600">{error}</p>}

      {loading ? (
        <p>Cargando rutinas...</p>
      ) : rutinas.length === 0 ? (
        <p>No hay rutinas generadas aún.</p>
      ) : (
        <div className="space-y-4">
          {rutinas.map(rutina => (
            <div
              key={rutina.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{rutina.nombre}</h2>
                <p className="text-sm text-gray-600">Usuario: {rutina.usuario_username}</p>
                <p className="text-sm text-gray-600">Nivel: {rutina.nivel}</p>
              </div>
              <button
                onClick={() => setRutinaSeleccionada(rutina)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      )}

      {rutinaSeleccionada && (
        <EditarRutinaModal
          rutina={rutinaSeleccionada}
          onClose={() => {
            setRutinaSeleccionada(null);
            cargarRutinas();
          }}
        />
      )}
    </div>
  );
}

export default RutinasAutogeneradas;
