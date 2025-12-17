import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import entrenadorServices from "../../../services/ServicesEntrenador";

function EditarRutinaModal({ rutina, onClose }) {
  const [ejerciciosRutina, setEjerciciosRutina] = useState([]);
  const [bancoEjercicios, setBancoEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [nivelRutina, setNivelRutina] = useState("Desconocido");
  const [nombreRutina, setNombreRutina] = useState("Sin nombre");

  const cargarDatos = async () => {
    try {
      // Obtener la rutina completa desde la API
      const rutinaData = await entrenadorServices.getRutinaById(rutina.id);
      const ejerciciosBanco = await entrenadorServices.getEjercicios();

      // Guardar nombre y nivel
      const nombre = rutinaData.rutina?.nombre || rutinaData.rutina_nombre || "Sin nombre";
      const nivel = rutinaData.rutina?.nivel || rutinaData.nivel || "Desconocido";
      setNombreRutina(nombre);
      setNivelRutina(nivel);

      // Extraer ejercicios asignados a la rutina
      // Cambiado a rutinaData.ejercicios según tu serializer
      const ejercicios = (rutinaData.ejercicios || []).map(er => ({
        id: er.ejercicio, // el serializer devuelve solo el id del ejercicio
        nombre: er.nombre_ejercicio,
        repeticiones: er.repeticiones || 10,
        descanso: er.descanso || 60,
        orden: er.orden,
      }));

      // Filtrar banco de ejercicios por nivel
      const bancoFiltrado = (ejerciciosBanco || []).filter(e => e.nivel === nivel);

      setEjerciciosRutina(ejercicios);
      setBancoEjercicios(bancoFiltrado);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      alert("No se pudieron cargar los datos de la rutina.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [rutina.id]);

  const quitarEjercicio = id => setEjerciciosRutina(prev => prev.filter(e => e.id !== id));

  const agregarEjercicio = ejercicio => {
    if (!ejerciciosRutina.find(e => e.id === ejercicio.id)) {
      setEjerciciosRutina(prev => [...prev, ejercicio]);
    }
  };

  const onDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(ejerciciosRutina);
    const [reordenado] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordenado);
    setEjerciciosRutina(items);
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      await entrenadorServices.putRutina(rutina.id, {
        ejercicios: ejerciciosRutina.map((e, idx) => ({
          ejercicio: e.id,
          orden: idx + 1,
          accion: "reordenar"
        })),
        estado: "revisada",
      });
      alert("Rutina guardada correctamente.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la rutina.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-2">{nombreRutina}</h2>
        <p className="mb-2">Usuario: {rutina.usuario_username || rutina.usuario?.username || "Desconocido"}</p>
        <p className="mb-4">Nivel: {nivelRutina}</p>

        <div className="flex gap-6">
          {/* Ejercicios de la rutina */}
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Ejercicios de la rutina</h3>
            {ejerciciosRutina.length === 0 ? (
              <p>No hay ejercicios en esta rutina.</p>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="rutinaEjercicios">
                  {provided => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {ejerciciosRutina.map((e, i) => (
                        <Draggable key={e.id} draggableId={e.id.toString()} index={i}>
                          {provided => (
                            <div
                              className="flex justify-between items-center p-2 border rounded mb-1"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span>{e.nombre}</span>
                              <button
                                onClick={() => quitarEjercicio(e.id)}
                                className="px-1 bg-red-500 text-white rounded"
                              >
                                X
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Banco de ejercicios */}
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Banco de ejercicios (Nivel: {nivelRutina})</h3>
            {bancoEjercicios.length === 0 ? (
              <p>No hay ejercicios disponibles.</p>
            ) : (
              bancoEjercicios.map(e => (
                <div key={e.id} className="flex justify-between items-center p-2 border rounded mb-1">
                  <span>{e.nombre}</span>
                  <button
                    onClick={() => agregarEjercicio(e)}
                    className="px-2 bg-green-600 text-white rounded"
                  >
                    Agregar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button
            onClick={guardarCambios}
            disabled={guardando}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarRutinaModal;
