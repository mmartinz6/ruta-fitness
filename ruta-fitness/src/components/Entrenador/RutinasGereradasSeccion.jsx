import React, { useEffect, useState } from "react";
import usuarioRutina from "../../services/ServicesUsuarioRutina"

function RutinasGeneradasSeccion() {
  const [rutinas, setRutinas] = useState([]);

  useEffect(() => {
    cargarRutinas();
  }, []);

  const cargarRutinas = async () => {
    try {
      const data = await usuarioRutina.obtenerTodas();
      setRutinas(data);
    } catch (error) {
      console.error("Error cargando rutinas:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Rutinas Generadas Automáticamente</h1>

      {rutinas.length === 0 ? (
        <p>No hay rutinas generadas.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rutinas.map((r) => (
            <div key={r.id} className="border rounded p-3 shadow">
              <p><strong>Usuario:</strong> {r.usuario_username}</p>
              <p><strong>Rutina:</strong> {r.rutina_nombre}</p>
              <p><strong>Estado:</strong> {r.estado}</p>
              <p><strong>Fecha:</strong> {r.fecha_asignacion}</p>

              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
                Ver / Editar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RutinasGeneradasSeccion;
